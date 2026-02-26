import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CollectibleItemData, useGameStore } from '../stores/gameStore';

interface CollectibleItemProps {
  item: CollectibleItemData;
}

function ModelMesh({ item, hovered, setHovered, handleClick, meshRef }: any) {
  const gltf = useGLTF(item.modelPath as string) as any;
  const clonedScene = gltf.scene.clone();

  return (
    <group
      ref={meshRef}
      position={item.position}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      scale={item.modelScale || [1, 1, 1]}
    >
      <primitive object={clonedScene} castShadow receiveShadow />
      {/* Ánh sáng khi hover */}
      {hovered && (
        <pointLight
          position={[0, 0.5, 0]}
          intensity={1}
          distance={2}
          color="#ffff00"
        />
      )}
    </group>
  );
}

export function CollectibleItem({ item }: CollectibleItemProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const collectItem = useGameStore((state) => state.collectItem);
  const collectedItems = useGameStore((state) => state.collectedItems);

  // Animation nhấp nháy và xoay nhẹ
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  // Nếu vật phẩm đã được thu thập, không render
  if (collectedItems.includes(item.id)) {
    return null;
  }

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Phát âm thanh (nếu có)
    try {
      const audio = new Audio('/collect.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio errors
      });
    } catch (e) {
      // Ignore if audio file doesn't exist
    }

    // Thu thập vật phẩm
    collectItem(item.id, item.historicalMessage);
  };

  const getGeometry = () => {
    switch (item.shape) {
      case 'sphere':
        return <sphereGeometry args={[item.size[0], 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[item.size[0], item.size[0], item.size[1], 32]} />;
      case 'box':
      default:
        return <boxGeometry args={item.size} />;
    }
  };

  // Nếu có model GLB, render model
  if (item.modelPath) {
    return <ModelMesh item={item} hovered={hovered} setHovered={setHovered} handleClick={handleClick} meshRef={meshRef} />;
  }

  // Fallback: Render geometry cơ bản nếu không có model
  return (
    <mesh
      ref={meshRef as any}
      position={item.position}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      castShadow
    >
      {getGeometry()}
      <meshStandardMaterial
        color={item.color}
        emissive={hovered ? item.color : '#000000'}
        emissiveIntensity={hovered ? 0.5 : 0}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

// Preload models
useGLTF.preload('/models/folded_newspaper.glb');
useGLTF.preload('/models/old_leather_red_book.glb');
useGLTF.preload('/models/old_victorian_rubber_stamp.glb');
useGLTF.preload('/models/money_bag_-_penningsbors.glb');
useGLTF.preload('/models/old_blue_book.glb');
