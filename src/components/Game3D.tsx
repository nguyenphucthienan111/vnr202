import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Room } from './Room';
import { CollectibleItem } from './CollectibleItem';
import { FlickeringLight } from './FlickeringLight';
import { COLLECTIBLE_ITEMS, useGameStore } from '../stores/gameStore';

export function Game3D() {
  const { gameState, decrementTime } = useGameStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Đếm ngược thời gian
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        decrementTime();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, decrementTime]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <Canvas
        shadows
        camera={{
          position: [0, 2, 5],
          fov: 70,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Ánh sáng */}
        <FlickeringLight />

        {/* Căn phòng */}
        <Room />

        {/* Các vật phẩm cần thu thập */}
        {COLLECTIBLE_ITEMS.map((item) => (
          <CollectibleItem key={item.id} item={item} />
        ))}

        {/* Camera Controls - Giới hạn góc quay */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 8}
          target={[0, 1.5, -1]}
        />
      </Canvas>
    </div>
  );
}
