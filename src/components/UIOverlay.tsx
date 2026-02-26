import { useGameStore } from '../stores/gameStore';

export function UIOverlay() {
  const { gameState, timeLeft, collectedItems, toastMessage, showToast, startGame, resetGame } = useGameStore();

  // Màn hình Intro
  if (gameState === 'idle') {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-80 pointer-events-auto">
        <div className="max-w-2xl p-8 text-center bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg shadow-2xl border-4 border-amber-600">
          <h1 className="text-5xl font-bold text-amber-100 mb-6 tracking-wider">
            60 GIÂY TẨU TÁN TÀI LIỆU
          </h1>
          
          <div className="text-amber-200 text-lg mb-8 leading-relaxed space-y-4">
            <p className="font-semibold text-xl text-red-400">
              Tòa soạn báo Dân Chúng - Năm 1938
            </p>
            <p>
              Mật thám Pháp đang chuẩn bị phá cửa ập vào!
            </p>
            <p>
              Bạn chỉ còn <span className="text-red-400 font-bold">60 giây</span> để tìm và giấu 
              <span className="text-yellow-400 font-bold"> 5 tài liệu lịch sử</span> quan trọng 
              rải rác trong phòng.
            </p>
            <p className="text-sm text-amber-300 italic">
              Click chuột vào các vật phẩm để giấu chúng trước khi quá muộn!
            </p>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-4 text-2xl font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg cursor-pointer"
          >
            BẮT ĐẦU
          </button>
        </div>
      </div>
    );
  }

  // Màn hình Game Over (Thua)
  if (gameState === 'lost') {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-red-900 bg-opacity-70 pointer-events-auto">
        <div className="max-w-xl p-8 text-center bg-red-950 rounded-lg shadow-2xl border-4 border-red-600">
          <h2 className="text-4xl font-bold text-red-200 mb-4">
            MẬT THÁM ĐÃ TRÀN VÀO!
          </h2>
          <p className="text-xl text-red-300 mb-6">
            Cơ sở bị lộ. Bạn chỉ kịp giấu được {collectedItems.length}/5 tài liệu.
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-3 text-xl font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-all transform hover:scale-105 cursor-pointer"
          >
            CHƠI LẠI
          </button>
        </div>
      </div>
    );
  }

  // Màn hình Victory (Thắng)
  if (gameState === 'won') {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-green-900 bg-opacity-70 pointer-events-auto">
        <div className="max-w-xl p-8 text-center bg-green-950 rounded-lg shadow-2xl border-4 border-green-600">
          <h2 className="text-4xl font-bold text-green-200 mb-4">
            AN TOÀN!
          </h2>
          <p className="text-xl text-green-300 mb-6">
            Đồng chí đã bảo vệ thành công cơ sở cách mạng!
          </p>
          <p className="text-lg text-green-400 mb-6">
            Hoàn thành trong {60 - timeLeft} giây
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-3 text-xl font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-all transform hover:scale-105 cursor-pointer"
          >
            CHƠI LẠI
          </button>
        </div>
      </div>
    );
  }

  // HUD khi đang chơi - pointer-events-none để không chặn chuột
  return (
    <>
      {/* Đồng hồ đếm ngược */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <div className={`text-6xl font-bold px-8 py-4 rounded-lg shadow-2xl ${
          timeLeft <= 10 
            ? 'bg-red-600 text-white animate-pulse' 
            : 'bg-amber-900 text-amber-100'
        }`}>
          {timeLeft}s
        </div>
      </div>

      {/* Bộ đếm vật phẩm */}
      <div className="fixed top-8 right-8 z-10 pointer-events-none">
        <div className="bg-amber-900 text-amber-100 px-6 py-4 rounded-lg shadow-xl border-2 border-amber-600">
          <div className="text-sm text-amber-300 mb-1">Tài liệu an toàn</div>
          <div className="text-3xl font-bold">
            {collectedItems.length}/5
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-slide-up pointer-events-none">
          <div className="bg-green-800 text-green-100 px-6 py-4 rounded-lg shadow-2xl border-2 border-green-500 max-w-md">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-lg font-medium">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hướng dẫn điều khiển */}
      <div className="fixed bottom-8 left-8 z-10 pointer-events-none">
        <div className="bg-black bg-opacity-60 text-white px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">Điều khiển:</p>
          <p>🖱️ Kéo chuột: Xoay camera</p>
          <p>🖱️ Click: Thu thập vật phẩm</p>
        </div>
      </div>
    </>
  );
}
