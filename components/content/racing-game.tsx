"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface RacingGameState {
  speed: number;
  score: number;
  gameOver: boolean;
}

// Added Loading State
interface LoadingState {
  progress: number;
  isComplete: boolean;
}

export function RacingGame() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carRef = useRef<THREE.Mesh | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number | null>(null);
  // Add refs for track elements and obstacles
  const trackSegmentsRef = useRef<THREE.Mesh[]>([]);
  const obstaclesRef = useRef<THREE.Mesh[]>([]);
  const lastTrackZRef = useRef<number>(0);

  const [gameState, setGameState] = useState<RacingGameState>({
    speed: 0.1,
    score: 0,
    gameOver: false,
  });
  // Added Loading State Management
  const [loadingState, setLoadingState] = useState<LoadingState>({
    progress: 0,
    isComplete: false,
  });

  // Simulate Loading Effect
  useEffect(() => {
    if (loadingState.isComplete) return;

    const interval = setInterval(() => {
      setLoadingState(prev => {
        const newProgress = prev.progress + 10; // Increment progress
        if (newProgress >= 100) {
          clearInterval(interval);
          return { progress: 100, isComplete: true };
        }
        return { ...prev, progress: newProgress };
      });
    }, 200); // Update every 200ms

    return () => clearInterval(interval);
  }, [loadingState.isComplete]);

// --- Helper Functions --- 

    const addTrackSegment = (scene: THREE.Scene, width: number, length: number, zPos: number) => {
    const planeGeometry = new THREE.PlaneGeometry(width, length);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a, 
        roughness: 0.8, 
        metalness: 0.2 
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.position.z = zPos;
    plane.receiveShadow = true;
    scene.add(plane);
    trackSegmentsRef.current.push(plane);
    lastTrackZRef.current = zPos; // Update the Z position of the last added segment
  };
 
  const addObstacle = (scene: THREE.Scene, trackWidth: number, zPos: number) => {
    const obstacleGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, // Red obstacle
        emissive: 0x800000,
        emissiveIntensity: 0.6,
        roughness: 0.6
    });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(
        (Math.random() - 0.5) * (trackWidth - 2), // Random X within track bounds
        0.75, // Positioned on the track
        zPos
    );
    obstacle.castShadow = true;
    scene.add(obstacle);
    obstaclesRef.current.push(obstacle);
  };
 
  useEffect(() => {
    // Initialize game only after loading is complete
    if (!loadingState.isComplete || !mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505); // Dark background
    scene.fog = new THREE.Fog(0x050505, 50, 150);
    scene.fog = new THREE.Fog(0x050505, 70, 180); // Adjusted fog
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 10); // Positioned slightly above and behind the car
    camera.position.set(0, 6, 12); // Adjusted camera position
    camera.position.set(0, 6, 12); // Adjusted camera position
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Neon Lights (Point Lights)
    const neonColors = [0xff00ff, 0x00ffff, 0x00ff00, 0xffa500]; // Added Orange
    neonColors.forEach((color, index) => {
      const pointLight = new THREE.PointLight(color, 2, 50);
      pointLight.position.set(
        (Math.random() - 0.5) * 40,
        5,
        (Math.random() - 0.5) * 150 - 75 // Spread lights further
      );
      scene.add(pointLight);
    });

    // Ground Plane (Road)
    const planeGeometry = new THREE.PlaneGeometry(50, 200);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a, 
        roughness: 0.8, 
        metalness: 0.2 
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
 
    // Initial Track Segments
    const trackWidth = 15;
    const segmentLength = 50;
    const initialSegments = 5;
    for (let i = 0; i < initialSegments; i++) {
      addTrackSegment(scene, trackWidth, segmentLength, -i * segmentLength);
    }

    // Car (Simple Box for now)
    const carGeometry = new THREE.BoxGeometry(2, 1, 4);
    const carMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, // Neon Cyan
        emissive: 0x00ffff, // Make it glow slightly
        emissiveIntensity: 0.5,
        roughness: 0.5,
        metalness: 0.5
    });
    const car = new THREE.Mesh(carGeometry, carMaterial);
    car.position.y = 0.5; // Lift it slightly above the ground
    car.castShadow = true;
    scene.add(car);
    carRef.current = car;

    // --- Basic Controls --- 
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.key.toLowerCase()] = true;
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- Animation Loop --- 
    const clock = new THREE.Clock(); // Clock for delta time
 
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
 
      if (gameState.gameOver) return;
 
      const delta = clock.getDelta(); // Time since last frame
 
      // Car Movement
      const moveSpeed = 0.3;
      const baseSpeed = 15; // Units per second
      const turnSpeed = 2.0; // Radians per second
      let currentSpeed = 0;
 
      if (keysRef.current['w'] || keysRef.current['arrowup']) {
        car.position.z -= moveSpeed;
        currentSpeed = baseSpeed;
      }
      if (keysRef.current['s'] || keysRef.current['arrowdown']) {
        car.position.z += moveSpeed;
        currentSpeed = -baseSpeed * 0.5; // Slower reverse
      }
      if (keysRef.current['a'] || keysRef.current['arrowleft']) {
        car.position.x -= moveSpeed;
        // Optional: Add slight rotation for turning effect
        // car.rotation.y += turnSpeed; 
        car.position.x -= turnSpeed * delta * 10; // Adjust multiplier as needed
        // car.rotation.y += turnSpeed * delta; // Simple rotation
      }
      if (keysRef.current['d'] || keysRef.current['arrowright']) {
        car.position.x += moveSpeed;
        // Optional: Add slight rotation for turning effect
        // car.rotation.y -= turnSpeed; 
        car.position.x += turnSpeed * delta * 10; // Adjust multiplier as needed
        // car.rotation.y -= turnSpeed * delta; // Simple rotation
      }
 
      // Apply forward/backward movement based on speed and delta time
      car.position.z -= currentSpeed * delta;
       
      // Keep car within bounds (example)
      car.position.x = Math.max(-20, Math.min(20, car.position.x));
      car.position.x = Math.max(-trackWidth / 2 + 1, Math.min(trackWidth / 2 - 1, car.position.x));
 
 
      // --- Track Generation --- 
      // If the car is approaching the end of the current track, add a new segment
      if (car.position.z < lastTrackZRef.current + segmentLength * 2) {

          addTrackSegment(scene, trackWidth, segmentLength, lastTrackZRef.current - segmentLength);
          // Add obstacles randomly on new segments
          if (Math.random() < 0.3) { // 30% chance to add an obstacle
              addObstacle(scene, trackWidth, lastTrackZRef.current - segmentLength / 2);
          }
      }
 
      // Remove track segments and obstacles far behind the car
      trackSegmentsRef.current = trackSegmentsRef.current.filter(segment => {
          if (segment.position.z > car.position.z + segmentLength * 2) {
              scene.remove(segment);
              segment.geometry.dispose();
              (segment.material as THREE.Material).dispose();
              return false;
          }
          return true;
      });
      obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
          if (obstacle.position.z > car.position.z + segmentLength) { // Remove obstacles sooner
              scene.remove(obstacle);
              obstacle.geometry.dispose();
              (obstacle.material as THREE.Material).dispose();
              return false;
          }
          return true;
      });
 
 
      // --- Collision Detection --- 
      const carBox = new THREE.Box3().setFromObject(car);
      obstaclesRef.current.forEach(obstacle => {
          const obstacleBox = new THREE.Box3().setFromObject(obstacle);
          if (carBox.intersectsBox(obstacleBox)) {
              console.log("Collision!");
              setGameState(prev => ({ ...prev, gameOver: true }));
              // Simple game over effect - stop the car
              if (animationFrameRef.current) {
                  cancelAnimationFrame(animationFrameRef.current);
              }
          }
      });
 
      // Update Camera to follow car
      camera.position.x = car.position.x;
      camera.position.z = car.position.z + 10; // Keep camera behind the car
      camera.lookAt(car.position.x, car.position.y, car.position.z);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, car.position.x, 0.1); // Smooth follow
      camera.position.z = car.position.z + 12; // Keep camera behind the car
      camera.lookAt(car.position.x, car.position.y, car.position.z - 5); // Look slightly ahead
 
      // Update Score (Example: based on distance traveled)
      setGameState(prev => ({ ...prev, score: prev.score + 1 }));
      // Score increases faster with speed
      setGameState(prev => ({ ...prev, score: prev.score + Math.max(0, Math.floor(currentSpeed * delta * 5)) }));
 
      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
        if (!currentMount) return;
        const newWidth = currentMount.clientWidth;
        const newHeight = currentMount.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
         // Check if the renderer's DOM element is still a child before removing
         if (currentMount && rendererRef.current.domElement.parentNode === currentMount) {
            currentMount.removeChild(rendererRef.current.domElement);
         }
      }
      // Dispose Three.js objects
      scene.traverse(object => {
          if (object instanceof THREE.Mesh) {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                  if (Array.isArray(object.material)) {
                      object.material.forEach(material => material.dispose());
                  } else {
                      object.material.dispose();
                  }
              }
          }
      });
      renderer.dispose();
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      carRef.current = null;
    };
  }, [loadingState.isComplete]); // Add loadingState.isComplete dependency
 
   // --- Helper Functions --- 
 
  
   // Conditional Rendering based on loading state
   if (!loadingState.isComplete) {
    return (
      <div className="p-4 text-neon-cyan font-mono">
        <div>Loading Neon Racer... [{loadingState.progress}%]</div>
        <div className="w-full bg-gray-700 h-2 mt-2">
          <div
            className="bg-neon-cyan h-2 transition-width duration-150 ease-linear"
            style={{ width: `${loadingState.progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  // Render game canvas when loading is complete
  return (
    <div ref={mountRef} style={{ width: '100%', height: '400px', position: 'relative' }}>
      {/* Game canvas will be appended here by Three.js */}
      {gameState.gameOver && (
        <div style={overlayStyle}>
          GAME OVER! Score: {gameState.score}
        </div>
      )}
      {!gameState.gameOver && (
        <div style={scoreStyle}>
          Score: {gameState.score}
        </div>
      )}
    </div>
  );
}

// Basic styles (can be moved to CSS modules or Tailwind)
const overlayStyle: React.CSSProperties = {
   position: 'absolute',
   top: '10px',
   left: '10px',
   color: '#00ff00', // Neon Green
   fontFamily: 'monospace',
   fontSize: '1.5em',
   zIndex: 10,
     transform: 'translate(-50%, -50%)',
     textAlign: 'center',
     backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
     padding: '20px',
     borderRadius: '10px', 
 }
 
 const scoreStyle: React.CSSProperties = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   color: '#ff0000', // Neon Red
   fontFamily: 'monospace',
   fontSize: '3em',
   textAlign: 'center',
   zIndex: 10
 }