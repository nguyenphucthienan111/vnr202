import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FlickeringLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      // Tạo hiệu ứng nhấp nháy bằng hàm sin (nhẹ hơn)
      const flickerIntensity = 2.5 + Math.sin(state.clock.elapsedTime * 6) * 0.3;
      lightRef.current.intensity = flickerIntensity;
    }
  });

  return (
    <>
      {/* Ánh sáng môi trường - tăng lên để nhìn rõ hơn */}
      <ambientLight intensity={1.2} color="#fff5e1" />
      
      {/* Đèn nhấp nháy màu đỏ cam - tạo cảm giác khẩn cấp */}
      <pointLight
        ref={lightRef}
        position={[0, 4, 0]}
        color="#ff6347"
        intensity={2.5}
        distance={20}
        decay={1.5}
        castShadow
      />
      
      {/* Đèn phụ chiếu sáng góc trái */}
      <pointLight
        position={[-4, 3, 3]}
        color="#ffcc66"
        intensity={2}
        distance={15}
        castShadow
      />
      
      {/* Đèn phụ chiếu sáng góc phải */}
      <pointLight
        position={[4, 3, -3]}
        color="#ffcc66"
        intensity={2}
        distance={15}
        castShadow
      />
      
      {/* Đèn chiếu từ phía trước */}
      <pointLight
        position={[0, 2, 5]}
        color="#ffd700"
        intensity={1.5}
        distance={12}
      />
      
      {/* Directional light để tạo shadow rõ hơn */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        color="#fff8dc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}
