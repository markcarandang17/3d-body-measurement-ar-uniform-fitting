"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CameraPreview from './CameraPreview';
import MeasurementResult from './MeasurementResult';
import Uniform3DViewer from './Uniform3DViewer';

type Step = 'instructions' | 'camera' | 'processing' | 'results';

interface Measurements {
  height: number;
  shoulderWidth: number;
  chestWidth: number;
  waistWidth: number;
  confidence: number;
  landmarks_detected: number;
}

interface UniformRecommendations {
  recommended_size: string;
  shirt_size: string;
  pants_size: string;
  blazer_size: string;
  fit_confidence: string;
}

interface MeasurementResponse {
  success: boolean;
  measurements: Measurements;
  uniform_recommendations: UniformRecommendations;
  message: string;
}

export default function FittingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('instructions');
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [uniformRecommendations, setUniformRecommendations] = useState<UniformRecommendations | null>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageCapture = async (imageBlob: Blob) => {
    setCurrentStep('processing');
    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', imageBlob, 'capture.jpg');

      // Use the current host but port 8001 for the API
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8001/api/measure'
        : `http://${window.location.hostname}:8001/api/measure`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process image');
      }

      const data: MeasurementResponse = await response.json();
      
      if (data.success) {
        setMeasurements(data.measurements);
        setUniformRecommendations(data.uniform_recommendations);
        setCurrentStep('results');
      } else {
        throw new Error('Measurement processing failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setCurrentStep('camera');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetProcess = () => {
    setCurrentStep('instructions');
    setMeasurements(null);
    setUniformRecommendations(null);
    setError('');
    setIsProcessing(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'instructions':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">3D Body Measurement</CardTitle>
              <CardDescription className="text-lg">
                Get accurate measurements for your school uniform fitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Instructions:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">1.</span>
                    Stand 6-8 feet away from your camera
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">2.</span>
                    Ensure good lighting and plain background
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">3.</span>
                    Stand straight with arms slightly away from body
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">4.</span>
                    Wear fitted clothing for accurate measurements
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">5.</span>
                    Make sure your full body is visible in the frame
                  </li>
                </ul>
              </div>
              <Button 
                onClick={() => setCurrentStep('camera')} 
                className="w-full py-6 text-lg"
              >
                Start Measurement
              </Button>
            </CardContent>
          </Card>
        );

      case 'camera':
        return (
          <div className="w-full max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Position Yourself</CardTitle>
                <CardDescription>
                  Follow the instructions and capture your image when ready
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CameraPreview onImageCapture={handleImageCapture} />
                {error && (
                  <Alert className="mt-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('instructions')}
                  >
                    Back to Instructions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'processing':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
                <h3 className="text-xl font-semibold">Processing Your Image</h3>
                <p className="text-gray-600">
                  Our AI is analyzing your body measurements...
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'results':
        return (
          <div className="w-full max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Your Measurements</CardTitle>
                <CardDescription>
                  Based on AI analysis of your image
                </CardDescription>
              </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {measurements && uniformRecommendations && (
                  <MeasurementResult 
                    measurements={measurements}
                    recommendations={uniformRecommendations}
                  />
                )}
              </div>
              <div>
                {measurements && (
                  <Uniform3DViewer measurements={measurements} />
                )}
              </div>
            </div>

            <div className="text-center space-x-4">
              <Button onClick={resetProcess} variant="outline">
                Take New Measurement
              </Button>
              <Button>
                Order Uniform
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {(['instructions', 'camera', 'processing', 'results'] as Step[]).map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${
                  index < (['instructions', 'camera', 'processing', 'results'] as Step[]).indexOf(currentStep)
                    ? 'text-green-600'
                    : index === (['instructions', 'camera', 'processing', 'results'] as Step[]).indexOf(currentStep)
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index < (['instructions', 'camera', 'processing', 'results'] as Step[]).indexOf(currentStep)
                      ? 'bg-green-600 text-white'
                      : index === (['instructions', 'camera', 'processing', 'results'] as Step[]).indexOf(currentStep)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`w-16 h-0.5 ml-2 ${
                      index < (['instructions', 'camera', 'processing', 'results'] as Step[]).indexOf(currentStep)
                        ? 'bg-green-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
}
