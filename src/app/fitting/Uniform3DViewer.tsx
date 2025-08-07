"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Measurements {
  height: number;
  shoulderWidth: number;
  chestWidth: number;
  waistWidth: number;
  confidence: number;
  landmarks_detected: number;
}

interface Uniform3DViewerProps {
  measurements: Measurements;
}

export default function Uniform3DViewer({ measurements }: Uniform3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentView, setCurrentView] = useState<'front' | 'side' | 'back'>('front');
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const uniformGroupRef = useRef<any>(null);

  useEffect(() => {
    console.log('Uniform3DViewer mounted with measurements:', measurements);
    initializeThreeJS();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    console.log('Measurements updated:', measurements);
    if (uniformGroupRef.current) {
      updateUniformScale();
    }
  }, [measurements]);

  const initializeThreeJS = async () => {
    try {
      // Dynamically import Three.js to avoid SSR issues
      const THREE = await import('three');
      
      if (!mountRef.current) {
        console.error('Mount ref not available');
        return;
      }

      console.log('Initializing Three.js...');
      console.log('Mount dimensions:', mountRef.current.clientWidth, mountRef.current.clientHeight);

      // Ensure we have valid dimensions
      const width = mountRef.current.clientWidth || 400;
      const height = mountRef.current.clientHeight || 400;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f5f5);
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 5);
      cameraRef.current = camera;

      // Renderer setup with fallback options
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0xf5f5f5, 1);
      rendererRef.current = renderer;

      // Clear any existing canvas
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      
      mountRef.current.appendChild(renderer.domElement);
      console.log('Canvas appended to DOM');

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Add a point light for better illumination
      const pointLight = new THREE.PointLight(0xffffff, 0.5);
      pointLight.position.set(-10, 10, 10);
      scene.add(pointLight);

      // Create uniform representation
      createUniformModel(THREE, scene);

      // Test render
      renderer.render(scene, camera);
      console.log('Initial render completed');

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (uniformGroupRef.current) {
          uniformGroupRef.current.rotation.y += 0.005;
        }
        
        renderer.render(scene, camera);
      };
      animate();

      setIsLoading(false);
      console.log('Three.js initialization completed successfully');
    } catch (err) {
      console.error('Error initializing Three.js:', err);
      setError(`Failed to load 3D viewer: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const createUniformModel = (THREE: any, scene: any) => {
    console.log('Creating uniform model...');
    const uniformGroup = new THREE.Group();
    uniformGroupRef.current = uniformGroup;

    // Create materials with better visibility
    const shirtMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4a90e2,
      shininess: 30,
      transparent: false
    });
    const pantsMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2c3e50,
      shininess: 30,
      transparent: false
    });
    const blazerMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a1a1a,
      shininess: 30,
      transparent: false
    });

    // Create shirt (torso)
    const shirtGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.3);
    const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
    shirt.position.y = 0.5;
    shirt.castShadow = true;
    shirt.receiveShadow = true;
    uniformGroup.add(shirt);
    console.log('Shirt added');

    // Create pants (legs)
    const pantsGeometry = new THREE.BoxGeometry(1.1, 1.8, 0.25);
    const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
    pants.position.y = -1.2;
    pants.castShadow = true;
    pants.receiveShadow = true;
    uniformGroup.add(pants);
    console.log('Pants added');

    // Create blazer (outer layer)
    const blazerGeometry = new THREE.BoxGeometry(1.3, 1.6, 0.32);
    const blazer = new THREE.Mesh(blazerGeometry, blazerMaterial);
    blazer.position.y = 0.5;
    blazer.position.z = 0.01;
    blazer.castShadow = true;
    blazer.receiveShadow = true;
    uniformGroup.add(blazer);
    console.log('Blazer added');

    // Add collar details
    const collarGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.05);
    const collarMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const collar = new THREE.Mesh(collarGeometry, collarMaterial);
    collar.position.y = 1.1;
    collar.position.z = 0.2;
    collar.castShadow = true;
    collar.receiveShadow = true;
    uniformGroup.add(collar);

    // Add buttons
    for (let i = 0; i < 4; i++) {
      const buttonGeometry = new THREE.SphereGeometry(0.03, 8, 8);
      const buttonMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
      const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
      button.position.set(0, 1.0 - i * 0.3, 0.17);
      button.castShadow = true;
      uniformGroup.add(button);
    }

    // Add a simple ground plane for reference
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xcccccc, 
      transparent: true, 
      opacity: 0.3 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.5;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(uniformGroup);
    console.log('Uniform group added to scene');
    console.log('Uniform group children count:', uniformGroup.children.length);
    
    updateUniformScale();
  };

  const updateUniformScale = () => {
    if (!uniformGroupRef.current) return;

    // Scale based on measurements
    const heightScale = measurements.height / 170; // Normalize to average height
    const widthScale = measurements.shoulderWidth / 45; // Normalize to average shoulder width

    uniformGroupRef.current.scale.set(
      widthScale,
      heightScale,
      1
    );
  };

  const changeView = (view: 'front' | 'side' | 'back') => {
    if (!cameraRef.current || !uniformGroupRef.current) return;

    setCurrentView(view);
    
    const camera = cameraRef.current;
    const duration = 1000; // Animation duration in ms
    const startPosition = { ...camera.position };
    const startRotation = { ...uniformGroupRef.current.rotation };
    
    let targetPosition;
    let targetRotation;

    switch (view) {
      case 'front':
        targetPosition = { x: 0, y: 0, z: 5 };
        targetRotation = { x: 0, y: 0, z: 0 };
        break;
      case 'side':
        targetPosition = { x: 5, y: 0, z: 0 };
        targetRotation = { x: 0, y: Math.PI / 2, z: 0 };
        break;
      case 'back':
        targetPosition = { x: 0, y: 0, z: -5 };
        targetRotation = { x: 0, y: Math.PI, z: 0 };
        break;
    }

    // Simple animation
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
      camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
      camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress;
      
      uniformGroupRef.current.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * easeProgress;
      
      camera.lookAt(0, 0, 0);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const cleanup = () => {
    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3D Uniform Preview</CardTitle>
          <CardDescription>Unable to load 3D viewer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="bg-gray-100 p-6 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Your Measurements Summary:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Height: {measurements.height} cm</div>
                <div>Shoulder: {measurements.shoulderWidth} cm</div>
                <div>Chest: {measurements.chestWidth} cm</div>
                <div>Waist: {measurements.waistWidth} cm</div>
              </div>
            </div>
            <Button onClick={initializeThreeJS} className="mt-4">
              Retry 3D Viewer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          3D Uniform Preview
          <Badge variant="outline">
            Scaled to your measurements
          </Badge>
        </CardTitle>
        <CardDescription>
          Interactive 3D model showing how the uniform will fit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* View Controls */}
          <div className="flex justify-center space-x-2">
            <Button
              variant={currentView === 'front' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeView('front')}
            >
              Front View
            </Button>
            <Button
              variant={currentView === 'side' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeView('side')}
            >
              Side View
            </Button>
            <Button
              variant={currentView === 'back' ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeView('back')}
            >
              Back View
            </Button>
          </div>

          {/* 3D Viewer */}
          <div className="relative">
            <div
              ref={mountRef}
              className="w-full h-96 border rounded-lg bg-gray-50"
              style={{ minHeight: '400px' }}
            />
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading 3D model...</p>
                </div>
              </div>
            )}
          </div>

          {/* Measurement Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Height Scale:</span>
                <span className="font-medium">{(measurements.height / 170 * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Width Scale:</span>
                <span className="font-medium">{(measurements.shoulderWidth / 45 * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Model Height:</span>
                <span className="font-medium">{measurements.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shoulder Width:</span>
                <span className="font-medium">{measurements.shoulderWidth} cm</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 text-center">
            The model automatically rotates. Use the view buttons to see different angles.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
