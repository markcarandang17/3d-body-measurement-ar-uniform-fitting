"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MeasurementResult from '../fitting/MeasurementResult';
import Uniform3DViewer from '../fitting/Uniform3DViewer';

// Mock data that matches what the real API returns
const mockMeasurements = {
  height: 175.2,
  shoulderWidth: 44.8,
  chestWidth: 38.5,
  waistWidth: 32.1,
  confidence: 0.89,
  landmarks_detected: 33
};

const mockUniformRecommendations = {
  recommended_size: "M",
  shirt_size: "M",
  pants_size: "M", 
  blazer_size: "M",
  fit_confidence: "high"
};

export default function TestResultsPage() {
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Test Results Page</h1>
          <p className="text-gray-600 mb-4">
            This simulates the actual results page after image capture and processing
          </p>
          <Button 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            variant="outline"
            className="mb-4"
          >
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </Button>
        </div>

        {showDebugInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Measurements:</strong> {JSON.stringify(mockMeasurements, null, 2)}</div>
                <div><strong>Recommendations:</strong> {JSON.stringify(mockUniformRecommendations, null, 2)}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {(['instructions', 'camera', 'processing', 'results']).map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${
                  index < 3 ? 'text-green-600' : 'text-blue-600'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index < 3 ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-0.5 ml-2 ${index < 3 ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results content - matches the actual results page layout */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Measurements</CardTitle>
            <CardDescription>
              Based on AI analysis of your image
            </CardDescription>
          </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <MeasurementResult 
              measurements={mockMeasurements}
              recommendations={mockUniformRecommendations}
            />
          </div>
          <div>
            <Uniform3DViewer measurements={mockMeasurements} />
          </div>
        </div>

        <div className="text-center space-x-4 mt-6">
          <Button variant="outline">
            Take New Measurement
          </Button>
          <Button>
            Order Uniform
          </Button>
        </div>
      </div>
    </div>
  );
}
