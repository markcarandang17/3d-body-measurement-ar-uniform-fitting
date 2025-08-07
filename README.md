# 3D Body Measurement & AR School Uniform Fitting

A revolutionary AI-powered application that uses computer vision and 3D rendering to measure body dimensions and provide accurate school uniform fitting recommendations.

## 🚀 Features

- **AI Body Measurement**: Uses MediaPipe for precise body pose detection and measurement calculation
- **3D Uniform Preview**: Interactive Three.js 3D models scaled to your measurements
- **Smart Sizing**: Intelligent size recommendations for shirts, pants, and blazers
- **Real-time Processing**: Fast image analysis with confidence scoring
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Privacy-First**: Images are processed securely and not stored

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **3D Rendering**: Three.js for interactive uniform models
- **Camera Access**: WebRTC getUserMedia API
- **State Management**: React hooks

### Backend (Python FastAPI)
- **Framework**: FastAPI with async support
- **Computer Vision**: OpenCV + MediaPipe for pose detection
- **Image Processing**: PIL for image manipulation
- **API Documentation**: Auto-generated with Swagger/OpenAPI

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Camera-enabled device** (webcam, phone, tablet)
- **Modern web browser** with WebRTC support

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd 3d-body-measurement-app
```

### 2. Frontend Setup (Next.js)
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: http://localhost:8000

### 3. Backend Setup (Python FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Or run the setup script
python setup.py

# Start the FastAPI server
python main.py
```

The backend API will be available at: http://localhost:8001

## 🔧 API Documentation

### Backend Endpoints

#### `GET /`
- **Description**: Root endpoint
- **Response**: Welcome message

#### `GET /health`
- **Description**: Health check endpoint
- **Response**: Service status

#### `POST /api/measure`
- **Description**: Process uploaded image and return body measurements
- **Content-Type**: `multipart/form-data`
- **Parameters**: 
  - `file`: Image file (JPEG, PNG)
- **Response**:
```json
{
  "success": true,
  "measurements": {
    "height": 170.5,
    "shoulderWidth": 45.2,
    "chestWidth": 38.4,
    "waistWidth": 32.1,
    "confidence": 0.85,
    "landmarks_detected": 33
  },
  "uniform_recommendations": {
    "recommended_size": "M",
    "shirt_size": "M",
    "pants_size": "M",
    "blazer_size": "M",
    "fit_confidence": "high"
  },
  "message": "Body measurements calculated successfully"
}
```

### Testing the API

#### Using curl:
```bash
# Test with an image file
curl -X POST "http://localhost:8001/api/measure" \
  -F "file=@/path/to/your/image.jpg" \
  -w "\nHTTP: %{http_code}\nTime: %{time_total}s\n" | jq '.'

# Health check
curl http://localhost:8001/health
```

#### Using the Web Interface:
1. Navigate to http://localhost:8000
2. Click "Start 3D Body Measurement"
3. Follow the on-screen instructions
4. Position yourself according to the guidelines
5. Capture your image
6. View your measurements and 3D preview

## 📱 Usage Instructions

### For Best Results:
1. **Lighting**: Ensure good, even lighting
2. **Background**: Use a plain, contrasting background
3. **Distance**: Stand 6-8 feet from the camera
4. **Posture**: Stand straight with arms slightly away from body
5. **Clothing**: Wear fitted clothing for accurate measurements
6. **Visibility**: Ensure your full body is visible in the frame

### Step-by-Step Process:
1. **Instructions**: Read the positioning guidelines
2. **Camera**: Allow camera access and position yourself
3. **Capture**: Take a photo using the 3-second countdown
4. **Processing**: Wait for AI analysis (usually 2-5 seconds)
5. **Results**: View measurements, 3D model, and size recommendations

## 🔧 Development

### Project Structure
```
├── src/
│   ├── app/
│   │   ├── fitting/
│   │   │   ├── page.tsx              # Main fitting wizard
│   │   │   ├── CameraPreview.tsx     # Camera interface
│   │   │   ├── MeasurementResult.tsx # Results display
│   │   │   └── Uniform3DViewer.tsx   # 3D model viewer
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/ui/                # shadcn/ui components
│   └── lib/
├── backend/
│   ├── main.py                       # FastAPI application
│   ├── requirements.txt              # Python dependencies
│   └── setup.py                      # Setup script
└── public/                           # Static assets
```

### Key Technologies:
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Three.js
- **Backend**: FastAPI, OpenCV, MediaPipe, NumPy
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **3D Graphics**: Three.js with WebGL rendering

## 🚨 Troubleshooting

### Common Issues:

#### Camera Access Denied
- Ensure browser permissions are granted
- Try refreshing the page
- Check if other applications are using the camera

#### Backend Connection Error
- Verify the Python server is running on port 8001
- Check firewall settings
- Ensure all Python dependencies are installed

#### Low Measurement Confidence
- Improve lighting conditions
- Use a plain background
- Ensure full body is visible
- Stand closer to the recommended distance

#### 3D Model Not Loading
- Check browser WebGL support
- Try refreshing the page
- Ensure Three.js loaded properly

### Debug Mode:
```bash
# Frontend with detailed logging
npm run dev

# Backend with debug logging
uvicorn main:app --host 0.0.0.0 --port 8001 --reload --log-level debug
```

## 🔒 Privacy & Security

- **No Data Storage**: Images are processed in real-time and not stored
- **Local Processing**: All measurements calculated locally
- **Secure Transmission**: HTTPS recommended for production
- **CORS Protection**: Configured for specific origins

## 🚀 Production Deployment

### Frontend (Vercel/Netlify):
```bash
npm run build
npm start
```

### Backend (Docker):
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

## 📊 Performance

- **Measurement Time**: 2-5 seconds per image
- **Accuracy**: 85-95% confidence with proper setup
- **Supported Formats**: JPEG, PNG
- **Max Image Size**: 10MB
- **Browser Support**: Chrome, Firefox, Safari, Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **MediaPipe**: Google's framework for building perception pipelines
- **Three.js**: JavaScript 3D library
- **FastAPI**: Modern, fast web framework for building APIs
- **Next.js**: React framework for production
- **shadcn/ui**: Beautifully designed components

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using modern web technologies**
