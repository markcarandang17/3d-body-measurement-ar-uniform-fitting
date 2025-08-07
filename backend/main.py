from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import mediapipe as mp
import numpy as np
from PIL import Image
import io
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="3D Body Measurement API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

def calculate_body_measurements(image_array):
    """
    Calculate body measurements using MediaPipe pose detection with realistic scaling
    """
    try:
        with mp_pose.Pose(
            static_image_mode=True,
            model_complexity=2,
            enable_segmentation=True,
            min_detection_confidence=0.5
        ) as pose:
            
            # Convert BGR to RGB
            rgb_image = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb_image)
            
            if not results.pose_landmarks:
                raise ValueError("No pose landmarks detected in the image")
            
            # Extract key landmarks
            landmarks = results.pose_landmarks.landmark
            
            # Get image dimensions
            img_height, img_width = image_array.shape[:2]
            
            # Calculate measurements using realistic proportions
            # Based on average human proportions and typical camera distances
            
            # Get key landmark positions
            nose = landmarks[mp_pose.PoseLandmark.NOSE]
            left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
            left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
            right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
            left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
            right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]
            
            # Calculate pixel distances
            shoulder_width_px = abs(left_shoulder.x - right_shoulder.x) * img_width
            hip_width_px = abs(left_hip.x - right_hip.x) * img_width
            avg_ankle_y = (left_ankle.y + right_ankle.y) / 2
            body_height_px = abs(nose.y - avg_ankle_y) * img_height
            
            # Use realistic scaling based on typical human proportions
            # Average shoulder width is about 45cm for adults
            # This gives us a scaling factor to convert pixels to real measurements
            
            # Estimate scale based on shoulder width (more reliable than height)
            # Assume average shoulder width is 40-50cm
            estimated_shoulder_width_cm = 45.0  # Average adult shoulder width
            if shoulder_width_px > 0:
                scale_factor = estimated_shoulder_width_cm / shoulder_width_px
            else:
                # Fallback: use body height ratio
                # Average person height in image should be around 400-800 pixels
                scale_factor = 170.0 / max(body_height_px, 400)  # Assume 170cm average height
            
            # Apply realistic constraints to prevent extreme values
            scale_factor = max(0.1, min(scale_factor, 2.0))  # Limit scale factor
            
            # Calculate final measurements
            shoulder_width_cm = shoulder_width_px * scale_factor
            body_height_cm = body_height_px * scale_factor
            hip_width_cm = hip_width_px * scale_factor
            
            # Apply realistic human proportion constraints
            body_height_cm = max(140, min(body_height_cm, 220))  # Height between 140-220cm
            shoulder_width_cm = max(30, min(shoulder_width_cm, 60))  # Shoulder width between 30-60cm
            hip_width_cm = max(25, min(hip_width_cm, 50))  # Hip width between 25-50cm
            
            # Calculate derived measurements
            chest_width_cm = shoulder_width_cm * 0.85  # Chest is typically 85% of shoulder width
            waist_width_cm = hip_width_cm * 0.9  # Waist is typically 90% of hip width
            
            # Ensure measurements are within realistic ranges
            chest_width_cm = max(25, min(chest_width_cm, 55))
            waist_width_cm = max(20, min(waist_width_cm, 45))
            
            measurements = {
                "height": round(body_height_cm, 1),
                "shoulderWidth": round(shoulder_width_cm, 1),
                "chestWidth": round(chest_width_cm, 1),
                "waistWidth": round(waist_width_cm, 1),
                "confidence": results.pose_landmarks.landmark[0].visibility,
                "landmarks_detected": len(landmarks)
            }
            
            # Log the measurements for debugging
            logger.info(f"Calculated measurements: {measurements}")
            logger.info(f"Scale factor used: {scale_factor:.4f}")
            logger.info(f"Image dimensions: {img_width}x{img_height}")
            logger.info(f"Body height in pixels: {body_height_px:.1f}")
            logger.info(f"Shoulder width in pixels: {shoulder_width_px:.1f}")
            
            return measurements
            
    except Exception as e:
        logger.error(f"Error in pose detection: {str(e)}")
        raise ValueError(f"Failed to process pose: {str(e)}")

@app.get("/")
async def root():
    return {"message": "3D Body Measurement API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "body-measurement-api"}

@app.post("/api/measure")
async def measure_body(file: UploadFile = File(...)):
    """
    Process uploaded image and return body measurements
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image file
        contents = await file.read()
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(contents))
        
        # Convert to OpenCV format
        opencv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        
        # Calculate measurements
        measurements = calculate_body_measurements(opencv_image)
        
        # Add recommended uniform sizes based on measurements
        uniform_recommendations = get_uniform_recommendations(measurements)
        
        response = {
            "success": True,
            "measurements": measurements,
            "uniform_recommendations": uniform_recommendations,
            "message": "Body measurements calculated successfully"
        }
        
        logger.info(f"Successfully processed image: {file.filename}")
        return response
        
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")

def get_uniform_recommendations(measurements):
    """
    Get uniform size recommendations based on measurements
    """
    height = measurements.get("height", 0)
    chest = measurements.get("chestWidth", 0)
    
    # Simple size mapping (this would be more sophisticated in production)
    if height < 150:
        size = "XS"
    elif height < 160:
        size = "S"
    elif height < 170:
        size = "M"
    elif height < 180:
        size = "L"
    else:
        size = "XL"
    
    return {
        "recommended_size": size,
        "shirt_size": size,
        "pants_size": size,
        "blazer_size": size,
        "fit_confidence": "high" if measurements.get("confidence", 0) > 0.7 else "medium"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
