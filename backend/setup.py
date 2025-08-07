#!/usr/bin/env python3
"""
Setup script for the 3D Body Measurement API backend
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python requirements"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Python dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing Python dependencies: {e}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3.8, 0):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def main():
    print("🚀 Setting up 3D Body Measurement API Backend...")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✅ Backend setup completed successfully!")
    print("\nTo start the server, run:")
    print("  python main.py")
    print("\nOr with uvicorn directly:")
    print("  uvicorn main:app --host 0.0.0.0 --port 8001 --reload")
    print("\nAPI will be available at: http://localhost:8001")
    print("API documentation: http://localhost:8001/docs")

if __name__ == "__main__":
    main()
