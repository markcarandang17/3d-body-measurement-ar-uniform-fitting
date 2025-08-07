"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraPreviewProps {
  onImageCapture: (imageBlob: Blob) => void;
}

export default function CameraPreview({ onImageCapture }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true);
        };
      }
      
      setStream(mediaStream);
      setError('');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isReady) return;

    // Start countdown
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          performCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        onImageCapture(blob);
      }
    }, 'image/jpeg', 0.8);
  };

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          {error}
        </AlertDescription>
        <div className="mt-4">
          <Button onClick={startCamera} variant="outline">
            Try Again
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto rounded-lg bg-gray-100"
              style={{ maxHeight: '500px' }}
            />
            
            {/* Overlay guidelines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Body outline guide */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed rounded-full opacity-50"
                       style={{ width: '60%', height: '90%' }}>
                  </div>
                </div>
                
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white opacity-30 transform -translate-x-0.5"></div>
                
                {/* Instructions overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg text-sm">
                    <p className="font-semibold">Position yourself:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Stand within the dashed outline</li>
                      <li>• Keep your full body visible</li>
                      <li>• Stand straight with arms slightly apart</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown overlay */}
            {countdown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-8xl font-bold animate-pulse">
                  {countdown}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <Button
          onClick={captureImage}
          disabled={!isReady || countdown !== null}
          className="px-8 py-3 text-lg"
        >
          {countdown ? `Capturing in ${countdown}...` : 'Capture Image'}
        </Button>
        
        <p className="text-sm text-gray-600">
          Click the button above to start a 3-second countdown before capture
        </p>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
}
