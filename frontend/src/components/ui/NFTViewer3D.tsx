'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Box, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface NFTAsset {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  type: 'Weapon' | 'Character' | 'Skin' | 'Consumable' | 'Vehicle' | 'Structure';
  level: number;
  description: string;
}

interface NFTViewer3DProps {
  asset: NFTAsset;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Rarity colors mapping
const RARITY_COLORS = {
  Common: '#9CA3AF',    // Gray
  Rare: '#3B82F6',      // Blue  
  Epic: '#8B5CF6',      // Purple
  Legendary: '#F59E0B'  // Gold
};

// Size configurations
const SIZE_CONFIG = {
  sm: { width: 200, height: 200 },
  md: { width: 300, height: 300 },
  lg: { width: 400, height: 400 },
  xl: { width: 500, height: 500 }
};

// Animated 3D model based on asset type
function AssetModel({ asset }: { asset: NFTAsset }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const rarityColor = RARITY_COLORS[asset.rarity];

  // Different shapes for different asset types
  const renderAssetShape = () => {
    switch (asset.type) {
      case 'Weapon':
        return (
          <Box 
            ref={meshRef}
            args={[0.2, 1.5, 0.2]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <meshStandardMaterial 
              color={rarityColor} 
              emissive={rarityColor}
              emissiveIntensity={0.2}
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
        );
      
      case 'Character':
        return (
          <Sphere 
            ref={meshRef}
            args={[0.8, 32, 32]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <meshStandardMaterial 
              color={rarityColor}
              emissive={rarityColor}
              emissiveIntensity={0.15}
              metalness={0.3}
              roughness={0.7}
            />
          </Sphere>
        );
      
      default:
        return (
          <Box 
            ref={meshRef}
            args={[1, 1, 1]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <meshStandardMaterial 
              color={rarityColor}
              emissive={rarityColor}
              emissiveIntensity={0.1}
            />
          </Box>
        );
    }
  };

  return (
    <group>
      {renderAssetShape()}
      
      {/* Floating level indicator */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color={rarityColor}
        anchorX="center"
        anchorY="middle"
      >
        LV.{asset.level}
      </Text>
      
      {/* Particle effects for legendary items */}
      {asset.rarity === 'Legendary' && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <Sphere key={i} args={[0.01]} position={[
              Math.random() * 4 - 2,
              Math.random() * 4 - 2, 
              Math.random() * 4 - 2
            ]}>
              <meshBasicMaterial color="#FFD700" />
            </Sphere>
          ))}
        </group>
      )}
    </group>
  );
}

// Loading fallback component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );
}

export function NFTViewer3D({ 
  asset, 
  interactive = true, 
  size = 'md' 
}: NFTViewer3DProps) {
  const config = SIZE_CONFIG[size];
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700"
      style={{ width: config.width, height: config.height }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: interactive ? 1.02 : 1 }}
    >
      {/* Asset info overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
          <h3 className="text-white font-bold text-sm">{asset.name}</h3>
          <p 
            className="text-xs font-medium"
            style={{ color: RARITY_COLORS[asset.rarity] }}
          >
            {asset.rarity} {asset.type}
          </p>
        </div>
      </div>

      {/* Rarity indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div 
          className="w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: RARITY_COLORS[asset.rarity] }}
        />
      </div>

      {/* 3D Canvas */}
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          onCreated={() => setIsLoading(false)}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight 
            position={[0, 10, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={0.5}
            color={RARITY_COLORS[asset.rarity]}
          />
          
          <AssetModel asset={asset} />
          
          {interactive && (
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={2}
            />
          )}
          
          <Environment preset="cyber" />
        </Canvas>
      </Suspense>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </motion.div>
  );
}

export default NFTViewer3D;