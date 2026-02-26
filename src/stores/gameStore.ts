import { create } from 'zustand';

export type GameState = 'idle' | 'playing' | 'won' | 'lost';

export interface CollectibleItemData {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  shape: 'box' | 'sphere' | 'cylinder';
  size: [number, number, number];
  historicalMessage: string;
  modelPath?: string; // Đường dẫn đến file .glb (optional)
  modelScale?: [number, number, number]; // Scale của model (optional)
}

interface GameStore {
  gameState: GameState;
  timeLeft: number;
  collectedItems: string[];
  toastMessage: string;
  showToast: boolean;
  
  // Actions
  startGame: () => void;
  resetGame: () => void;
  collectItem: (itemId: string, message: string) => void;
  decrementTime: () => void;
  setGameState: (state: GameState) => void;
  hideToast: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'idle',
  timeLeft: 60,
  collectedItems: [],
  toastMessage: '',
  showToast: false,

  startGame: () => {
    set({
      gameState: 'playing',
      timeLeft: 60,
      collectedItems: [],
      toastMessage: '',
      showToast: false,
    });
  },

  resetGame: () => {
    set({
      gameState: 'idle',
      timeLeft: 60,
      collectedItems: [],
      toastMessage: '',
      showToast: false,
    });
  },

  collectItem: (itemId: string, message: string) => {
    const { collectedItems, gameState } = get();
    
    if (gameState !== 'playing') return;
    if (collectedItems.includes(itemId)) return;

    const newCollectedItems = [...collectedItems, itemId];
    
    set({
      collectedItems: newCollectedItems,
      toastMessage: message,
      showToast: true,
    });

    // Check win condition
    if (newCollectedItems.length >= 5) {
      set({ gameState: 'won' });
    }

    // Hide toast after 3 seconds
    setTimeout(() => {
      get().hideToast();
    }, 3000);
  },

  decrementTime: () => {
    const { timeLeft, gameState, collectedItems } = get();
    
    if (gameState !== 'playing') return;

    const newTimeLeft = timeLeft - 1;
    
    if (newTimeLeft <= 0) {
      set({ timeLeft: 0, gameState: 'lost' });
    } else {
      set({ timeLeft: newTimeLeft });
    }
  },

  setGameState: (state: GameState) => {
    set({ gameState: state });
  },

  hideToast: () => {
    set({ showToast: false });
  },
}));

// Danh sách 5 vật phẩm cần thu thập
// Chỉ tăng kích thước 3 vật phẩm đầu, 2 vật phẩm sau giữ nguyên bản
export const COLLECTIBLE_ITEMS: CollectibleItemData[] = [
  {
    id: 'manuscript',
    name: 'Bản thảo báo Dân Chúng',
    position: [-2, 0.2, -1], 
    color: '#f5f5f5',
    shape: 'box',
    size: [3.5, 0.3, 2.5], // Tăng mạnh vùng va chạm
    historicalMessage: 'Đã giấu Bản thảo báo - Vũ khí sắc bén của Mặt trận Dân chủ',
    modelPath: '/models/folded_newspaper.glb',
    modelScale: [0.35, 0.35, 0.35], // Kích thước cực đại
  },
  {
    id: 'memberlist',
    name: 'Danh sách Đảng viên',
    position: [-4.2, 0.9, 1],
    color: '#dc2626',
    shape: 'box',
    size: [2.0, 2.5, 1.5], 
    historicalMessage: 'An toàn! Bảo vệ cán bộ là ưu tiên hàng đầu',
    modelPath: '/models/old_leather_red_book.glb',
    modelScale: [0.35, 0.35, 0.35], // Kích thước cực đại
  },
  {
    id: 'seal',
    name: 'Con dấu',
    position: [0.6, 0.8, -2.4],
    color: '#7c2d12',
    shape: 'cylinder',
    size: [1.5, 1.5, 1.5], 
    historicalMessage: 'Đã cất giấu con dấu hợp pháp của Tòa soạn',
    modelPath: '/models/old_victorian_rubber_stamp.glb',
    modelScale: [0.3, 0.3, 0.3], // Kích thước cực đại
  },
  {
    id: 'fund',
    name: 'Quỹ ủng hộ bãi công',
    position: [3, 0.1, 2],
    color: '#fbbf24',
    shape: 'box',
    size: [0.4, 0.4, 0.4], // Giữ nguyên bản
    historicalMessage: 'Bảo toàn quỹ hỗ trợ phong trào công nhân thợ mỏ',
    modelPath: '/models/money_bag_-_penningsbors.glb',
    modelScale: [0.015, 0.015, 0.015], // Giữ nguyên bản
  },
  {
    id: 'book',
    name: 'Sách "Vấn đề dân cày"',
    position: [-4.2, 1.4, 1.2],
    color: '#2563eb',
    shape: 'box',
    size: [0.3, 0.4, 0.25], // Giữ nguyên bản
    historicalMessage: 'Đã giấu tài liệu quan trọng của đồng chí Qua Ninh và Vân Đình',
    modelPath: '/models/old_blue_book.glb',
    modelScale: [0.015, 0.015, 0.015], // Giữ nguyên bản
  },
];