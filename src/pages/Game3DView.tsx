import { Game3D } from '../components/Game3D';
import { UIOverlay } from '../components/UIOverlay';

export function Game3DView() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Canvas 3D - Nằm dưới cùng */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Game3D />
      </div>
      
      {/* UI Overlay - Nằm trên cùng, không chặn chuột */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <UIOverlay />
      </div>
    </div>
  );
}
