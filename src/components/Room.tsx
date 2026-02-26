import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

function DeskModel() {
  const gltf = useGLTF('/models/old_desk_04-freepoly.org.glb') as any;
  const clonedScene = gltf.scene.clone();
  return (
    <primitive 
      object={clonedScene} 
      position={[0, 0, -2.5]} 
      scale={[0.008, 0.008, 0.008]} 
      castShadow 
      receiveShadow 
    />
  );
}

function BookshelfModel() {
  const gltf = useGLTF('/models/dusty_old_bookshelf_free.glb') as any;
  const clonedScene = gltf.scene.clone();
  return (
    <primitive 
      object={clonedScene} 
      position={[-4.5, 0, 1]} 
      scale={[0.01, 0.01, 0.01]} 
      rotation={[0, Math.PI / 2, 0]}
      castShadow 
      receiveShadow 
    />
  );
}

function ChairModel() {
  const gltf = useGLTF('/models/old_chair.glb') as any;
  const clonedScene = gltf.scene.clone();
  return (
    <primitive 
      object={clonedScene} 
      position={[0, 0, -1.2]} 
      scale={[0.008, 0.008, 0.008]} 
      rotation={[0, Math.PI, 0]}
      castShadow 
      receiveShadow 
    />
  );
}

function TypewriterModel() {
  const gltf = useGLTF('/models/typewriter.glb') as any;
  const clonedScene = gltf.scene.clone();
  return (
    <primitive 
      object={clonedScene} 
      position={[0, 0.65, -2.5]} 
      scale={[0.005, 0.005, 0.005]} 
      rotation={[0, 0, 0]}
      castShadow 
      receiveShadow 
    />
  );
}

function LanternModel() {
  const gltf = useGLTF('/models/lantern.glb') as any;
  const clonedScene = gltf.scene.clone();
  return (
    <primitive 
      object={clonedScene} 
      position={[-0.8, 0.65, -2.6]} 
      scale={[0.01, 0.01, 0.01]} 
      castShadow 
      receiveShadow 
    />
  );
}

export function Room() {
  return (
    <group>
      {/* Sàn nhà - gỗ cũ sáng hơn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial 
          color="#8b6f47" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Tường sau - sáng hơn */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          color="#c9b18a" 
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tường trái - sáng hơn */}
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          color="#c9b18a" 
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tường phải - sáng hơn */}
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          color="#c9b18a" 
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Các Models */}
      <DeskModel />
      <BookshelfModel />
      <ChairModel />
      <TypewriterModel />
      <LanternModel />

      {/* Thùng gỗ bên phải */}
      <mesh position={[3.5, 0.4, -3]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>

      {/* Cửa sổ nhỏ trên tường sau - có ánh sáng từ bên ngoài */}
      <mesh position={[2, 3, -4.9]}>
        <planeGeometry args={[1.2, 1]} />
        <meshStandardMaterial 
          color="#87ceeb" 
          emissive="#4a90c0"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Ánh sáng từ cửa sổ */}
      <spotLight
        position={[2, 3, -4.5]}
        angle={0.5}
        penumbra={0.5}
        intensity={2}
        color="#e6f2ff"
        castShadow
        target-position={[0, 1, 0]}
      />
    </group>
  );
}

useGLTF.preload('/models/old_desk_04-freepoly.org.glb');
useGLTF.preload('/models/dusty_old_bookshelf_free.glb');
useGLTF.preload('/models/old_chair.glb');
useGLTF.preload('/models/typewriter.glb');
useGLTF.preload('/models/lantern.glb');
