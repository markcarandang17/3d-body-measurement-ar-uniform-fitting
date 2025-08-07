"use client";

import React from 'react';
import Uniform3DViewer from '../fitting/Uniform3DViewer';

const mockMeasurements = {
  height: 175,
  shoulderWidth: 45,
  chestWidth: 40,
  waistWidth: 35,
  confidence: 0.85,
  landmarks_detected: 33
};

export default function Test3DPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">3D Viewer Test</h1>
        <Uniform3DViewer measurements={mockMeasurements} />
      </div>
    </div>
  );
}
