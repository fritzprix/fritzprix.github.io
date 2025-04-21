import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WebGLBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  particleColor?: string;
}

function Particles({ 
  count = 5000, 
  size = 0.015,
  color = '#ffffff' 
}: { 
  count?: number; 
  size?: number; 
  color?: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions only once
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      // Distribute particles within a volume (e.g., a sphere or cube)
      pos[i] = (Math.random() - 0.5) * 10; // Example: cube distribution from -5 to 5
    }
    return pos;
  }, [count]);

  // Animate the particles
  useFrame((_, delta) => {
    if (pointsRef.current) {
      // Simple rotation for effect
      pointsRef.current.rotation.x += delta * 0.02;
      pointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        attach="material" 
        size={size} 
        color={color} 
        sizeAttenuation // Optional: makes points smaller further away
        transparent
        opacity={0.7} // Slight transparency
        depthWrite={false} // Prevents particles obscuring each other unnaturally
      />
    </points>
  );
}

const WebGLBackground: React.FC<WebGLBackgroundProps> = ({
  particleCount,
  particleSize,
  particleColor
}) => {
  return (
    <div style={{
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: -1, 
      pointerEvents: 'none'
    }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Particles count={particleCount} size={particleSize} color={particleColor} />
      </Canvas>
    </div>
  );
};

export default WebGLBackground; 