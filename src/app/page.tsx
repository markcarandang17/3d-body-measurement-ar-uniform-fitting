import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
          3D Body Measurement & AR Uniform Fitting
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary AI-powered technology that measures your body in 3D and helps you find the perfect school uniform fit from the comfort of your home.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              </div>
              <CardTitle>AI Body Measurement</CardTitle>
              <CardDescription>
                Advanced computer vision technology analyzes your body measurements with high precision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• MediaPipe pose detection</li>
                <li>• Real-time measurement calculation</li>
                <li>• High accuracy results</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full"></div>
              </div>
              <CardTitle>3D Uniform Preview</CardTitle>
              <CardDescription>
                See how your school uniform will look and fit with our interactive 3D model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Three.js 3D rendering</li>
                <li>• Scaled to your measurements</li>
                <li>• Multiple viewing angles</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              </div>
              <CardTitle>Smart Sizing</CardTitle>
              <CardDescription>
                Get personalized size recommendations for shirts, pants, and blazers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Intelligent size mapping</li>
                <li>• Confidence scoring</li>
                <li>• Individual item sizing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Position Yourself</h3>
              <p className="text-sm text-gray-600">
                Stand in front of your camera following our positioning guidelines
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Capture Image</h3>
              <p className="text-sm text-gray-600">
                Take a photo that our AI will analyze for body measurements
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                Advanced algorithms calculate your precise body measurements
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-sm text-gray-600">
                View your measurements, 3D preview, and size recommendations
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Get your perfect school uniform fit in just a few minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  <strong>What you'll need:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• A device with a camera (phone, tablet, or computer)</li>
                  <li>• Good lighting and a plain background</li>
                  <li>• 6-8 feet of space in front of your camera</li>
                  <li>• Fitted clothing for accurate measurements</li>
                </ul>
              </div>
              
              <Link href="/fitting">
                <Button size="lg" className="w-full py-6 text-lg">
                  Start 3D Body Measurement
                </Button>
              </Link>
              
              <p className="text-xs text-gray-500">
                Your privacy is protected. Images are processed securely and not stored.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            Powered by MediaPipe, Three.js, and FastAPI • Built with Next.js and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
