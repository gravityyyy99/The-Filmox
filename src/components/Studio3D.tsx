'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function CinemaLens() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Animate the rotation over time
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer lens body */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[1.5, 1.8, 1.2, 32]} />
        <meshStandardMaterial 
          color="#1A1412" 
          roughness={0.2} 
          metalness={0.8} 
          wireframe
        />
      </mesh>
      
      {/* Golden accent ring */}
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[1.55, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#C9A05C" 
          roughness={0.1} 
          metalness={0.9} 
        />
      </mesh>

      {/* Internal lens reflection element */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#E8C77E" 
          roughness={0.0} 
          metalness={1.0} 
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Base mount */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.1, 32]} />
        <meshStandardMaterial 
          color="#C9A05C" 
          roughness={0.3} 
          metalness={0.7} 
        />
      </mesh>
    </group>
  );
}

export default function Studio3D() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px' }}>
      <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, -10, 10]} angle={0.3} penumbra={1} intensity={1} color="#3D0F0F" />
        <CinemaLens />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
