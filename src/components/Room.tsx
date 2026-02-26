import * as THREE from 'three';

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

      {/* Bàn làm việc cơ bản */}
      <group position={[0, 0, -2.5]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[2, 0.08, 1]} />
          <meshStandardMaterial color="#3e2723" roughness={0.7} />
        </mesh>
        <mesh position={[-0.9, 0.45, -0.4]} castShadow>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
        <mesh position={[0.9, 0.45, -0.4]} castShadow>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
        <mesh position={[-0.9, 0.45, 0.4]} castShadow>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
        <mesh position={[0.9, 0.45, 0.4]} castShadow>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color="#3e2723" />
        </mesh>
      </group>

      {/* Kệ sách bên trái */}
      <group position={[-4, 0, 2]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.6, 3, 0.8]} />
          <meshStandardMaterial color="#4a3728" roughness={0.8} />
        </mesh>
      </group>

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
