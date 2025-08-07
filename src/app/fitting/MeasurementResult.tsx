"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

interface MeasurementResultProps {
  measurements: Measurements;
  recommendations: UniformRecommendations;
}

export default function MeasurementResult({ measurements, recommendations }: MeasurementResultProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const getSizeColor = (fitConfidence: string) => {
    switch (fitConfidence.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Measurement Accuracy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Measurement Accuracy
            <Badge 
              variant="outline" 
              className={getConfidenceColor(measurements.confidence)}
            >
              {getConfidenceText(measurements.confidence)}
            </Badge>
          </CardTitle>
          <CardDescription>
            Based on {measurements.landmarks_detected} detected body landmarks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Detection Confidence</span>
              <span className={getConfidenceColor(measurements.confidence)}>
                {Math.round(measurements.confidence * 100)}%
              </span>
            </div>
            <Progress 
              value={measurements.confidence * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Body Measurements */}
      <Card>
        <CardHeader>
          <CardTitle>Your Measurements</CardTitle>
          <CardDescription>
            All measurements are in centimeters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Height</span>
                <span className="text-lg font-semibold">{measurements.height} cm</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Shoulder Width</span>
                <span className="text-lg font-semibold">{measurements.shoulderWidth} cm</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Chest Width</span>
                <span className="text-lg font-semibold">{measurements.chestWidth} cm</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Waist Width</span>
                <span className="text-lg font-semibold">{measurements.waistWidth} cm</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uniform Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recommended Uniform Sizes
            <Badge 
              className={getSizeColor(recommendations.fit_confidence)}
            >
              {recommendations.fit_confidence} fit confidence
            </Badge>
          </CardTitle>
          <CardDescription>
            Based on your body measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Recommendation */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900">Overall Recommended Size</h4>
                  <p className="text-sm text-blue-700">Best fit for your measurements</p>
                </div>
                <div className="text-3xl font-bold text-blue-900">
                  {recommendations.recommended_size}
                </div>
              </div>
            </div>

            {/* Individual Item Sizes */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">School Shirt</span>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {recommendations.shirt_size}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">School Pants</span>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {recommendations.pants_size}
                </Badge>
              </div>

              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">School Blazer</span>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {recommendations.blazer_size}
                </Badge>
              </div>
            </div>

            {/* Size Guide */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Size Guide Reference</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>XS: Height 140-150cm</span>
                  <span>S: Height 150-160cm</span>
                </div>
                <div className="flex justify-between">
                  <span>M: Height 160-170cm</span>
                  <span>L: Height 170-180cm</span>
                </div>
                <div className="flex justify-between">
                  <span>XL: Height 180cm+</span>
                  <span></span>
                </div>
              </div>
            </div>

            {/* Fit Notes */}
            {recommendations.fit_confidence === 'medium' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Consider trying on the uniform before ordering, 
                  or consult with our fitting specialist for the best fit.
                </p>
              </div>
            )}

            {recommendations.fit_confidence === 'low' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Recommendation:</strong> We suggest scheduling an in-person 
                  fitting appointment for the most accurate sizing.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
