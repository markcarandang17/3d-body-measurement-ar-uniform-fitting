import requests
import json

def test_measurement_api():
    """Test the measurement API with the sample image"""
    
    # Test with the sample image
    try:
        with open('test_image.jpg', 'rb') as f:
            files = {'file': ('test_image.jpg', f, 'image/jpeg')}
            response = requests.post('http://localhost:8001/api/measure', files=files)
        
        if response.status_code == 200:
            data = response.json()
            measurements = data['measurements']
            
            print("✅ API Test Successful!")
            print(f"Height: {measurements['height']} cm")
            print(f"Shoulder Width: {measurements['shoulderWidth']} cm")
            print(f"Chest Width: {measurements['chestWidth']} cm")
            print(f"Waist Width: {measurements['waistWidth']} cm")
            print(f"Confidence: {measurements['confidence']:.2f}")
            print(f"Landmarks Detected: {measurements['landmarks_detected']}")
            
            # Check if measurements are realistic
            height = measurements['height']
            if 140 <= height <= 220:
                print("✅ Height is within realistic range (140-220 cm)")
            else:
                print(f"❌ Height {height} cm is unrealistic!")
                
            return True
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_measurement_api()
