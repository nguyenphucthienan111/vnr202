import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const milestones = [
  {
    id: 1,
    title: "Đám mây đen Phát xít và Ánh sáng từ nước Pháp",
    content: "Chủ nghĩa phát xít đe dọa hòa bình thế giới. Tại Pháp, Mặt trận Nhân dân Pháp lên cầm quyền, ban bố các quyền tự do dân chủ, nới lỏng chính sách cai trị tại Đông Dương, thả một số tù chính trị.",
    year: "Đầu năm 1936",
    image: "/dam_may_den.png"
  },
  {
    id: 2,
    title: "Hội nghị Ban Chấp hành Trung ương Đảng",
    content: "Do đồng chí Lê Hồng Phong chủ trì. Đảng quyết định chuyển hướng chiến lược: Tạm gác khẩu hiệu 'Độc lập dân tộc' và 'Cách mạng ruộng đất'. Mục tiêu trước mắt là: Chống phát xít, chống phản động thuộc địa, đòi tự do, dân chủ, cơm áo và hòa bình.",
    year: "Tháng 7/1936",
    image: "/hoi_nghi.png"
  },
  {
    id: 3,
    title: "Từ bí mật vươn ra ánh sáng",
    content: "Thành lập 'Mặt trận Dân chủ Đông Dương'. Chuyển từ đấu tranh bí mật sang kết hợp công khai, hợp pháp, nửa hợp pháp. Tận dụng triệt để diễn đàn báo chí công khai (các báo Tiền Phong, Dân Chúng, Tin Tức) và đấu tranh nghị trường.",
    year: "1937 - 1938",
    image: "/tu_bi_mat_vuon_ra_as.png"
  },
  {
    id: 4,
    title: "Cuộc biểu dương lực lượng khổng lồ",
    content: "Ngày Quốc tế Lao động 1/5/1938, một cuộc mít tinh công khai với hơn 2 vạn người tham gia đã diễn ra tại Khu Đấu xảo Hà Nội, đánh dấu sự trưởng thành vượt bậc của sức mạnh quần chúng.",
    year: "1/5/1938",
    image: "/bieu_duong.png"
  }
];

function MilestoneCard({ m, index }: { m: any, index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["0 1", "1.2 1"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [45, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 20 : -20, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ 
        rotateX, 
        rotateY, 
        opacity, 
        scale,
        y,
        transformPerspective: 1200
      }}
      className={`mb-32 bg-[#f5ede0] border-[6px] border-double border-[#1a1714] shadow-[12px_12px_0px_rgba(26,23,20,0.4)] relative`}
    >
      {/* Decorative corner ornaments */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#1a1714] flex items-center justify-center text-[#f5ede0] font-bold text-xs">
        {m.id}
      </div>
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#1a1714] flex items-center justify-center text-[#f5ede0]">★</div>

      <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0`}>
        {/* Text content */}
        <div className="flex-1 p-10 border-r-[3px] border-[#1a1714] relative">
          {/* Year badge */}
          <div className="inline-block mb-6 px-6 py-2 bg-[#1a1714] text-[#f5ede0] typewriter-text text-xs font-bold tracking-[0.3em] uppercase border-2 border-[#1a1714] shadow-[4px_4px_0px_rgba(26,23,20,0.3)]">
            {m.year}
          </div>
          
          {/* Title with decorative elements */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-[3px] bg-[#1a1714]"></div>
              <span className="text-2xl">✦</span>
            </div>
            <h2 className="newspaper-title text-4xl md:text-5xl font-black mb-3 leading-tight uppercase">
              {m.title}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✦</span>
              <div className="flex-1 h-[3px] bg-[#1a1714]"></div>
            </div>
          </div>
          
          {/* Content with drop cap */}
          <div className="newspaper-text text-lg md:text-xl leading-relaxed columns-1 md:columns-2 gap-8 text-justify">
            <p className="drop-cap">{m.content}</p>
          </div>

          {/* Bottom ornament */}
          <div className="mt-8 flex items-center gap-2 opacity-30">
            <div className="flex-1 h-[1px] bg-[#1a1714]"></div>
            <span className="text-xl">❦</span>
            <div className="flex-1 h-[1px] bg-[#1a1714]"></div>
          </div>
        </div>

        {/* Image section */}
        <div className="flex-1 p-6 bg-[#e8dfc7] relative">
          <div className="relative border-[4px] border-[#1a1714] p-3 bg-[#f5ede0] shadow-[6px_6px_0px_rgba(26,23,20,0.3)] transform hover:rotate-0 transition-transform duration-500" style={{ transform: index % 2 === 0 ? 'rotate(2deg)' : 'rotate(-2deg)' }}>
            {/* Photo corners */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-[3px] border-l-[3px] border-[#1a1714]"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-[3px] border-r-[3px] border-[#1a1714]"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-[3px] border-l-[3px] border-[#1a1714]"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-[3px] border-r-[3px] border-[#1a1714]"></div>
            
            <img 
              src={m.image} 
              alt={m.title}
              className="w-full h-auto object-cover"
            />
            
            {/* Caption */}
            <div className="mt-3 text-center typewriter-text text-xs uppercase tracking-wider opacity-70">
              Tư liệu lịch sử - {m.year}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen selection:bg-[#1a1714] selection:text-[#e8dfc7] overflow-x-hidden">
      {/* Decorative border frame */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 border-[12px] border-double border-[#1a1714]"></div>
        <div className="absolute inset-3 border-[3px] border-[#1a1714]"></div>
        <div className="absolute inset-6 border border-[#1a1714] opacity-50"></div>
      </div>

      {/* Header */}
      <header className="min-h-screen flex flex-col items-center justify-center px-8 text-center border-b-[6px] border-double border-[#1a1714] relative bg-[#f5ede0]">
        {/* Top banner with ornaments */}
        <div className="absolute top-12 left-0 right-0 px-12">
          <div className="flex justify-between items-center typewriter-text text-xs uppercase tracking-[0.3em] border-y-[3px] border-double border-[#1a1714] py-3 bg-[#e8dfc7]">
            <span className="flex items-center gap-2">
              <span className="text-2xl">✦</span>
              Số Đặc Biệt
            </span>
            <span className="font-bold text-sm">ĐÔNG DƯƠNG, 1936-1939</span>
            <span className="flex items-center gap-2">
              Giá: 5 Xu
              <span className="text-2xl">✦</span>
            </span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="max-w-5xl mx-auto mt-24 relative"
        >
          {/* Ornamental corners */}
          <div className="absolute -top-8 -left-8 text-6xl opacity-20 select-none">❦</div>
          <div className="absolute -top-8 -right-8 text-6xl opacity-20 select-none">❦</div>
          
          <h1 className="newspaper-title text-8xl md:text-[10rem] font-black uppercase tracking-[-0.05em] mb-4 leading-[0.9] text-[#8b1a1a] relative drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            <span className="block">TIẾNG GỌI</span>
            <span className="block">DÂN CHỦ</span>
          </h1>
          
          {/* Decorative lines */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex-1 h-[2px] bg-[#1a1714]"></div>
            <span className="text-3xl">✦</span>
            <div className="flex-1 h-[2px] bg-[#1a1714]"></div>
          </div>
          <div className="w-full h-[6px] bg-[#1a1714] mb-2"></div>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex-1 h-[2px] bg-[#1a1714]"></div>
            <span className="text-3xl">✦</span>
            <div className="flex-1 h-[2px] bg-[#1a1714]"></div>
          </div>
          
          <div className="max-w-3xl mx-auto border-4 border-double border-[#1a1714] p-6 bg-[#f5ede0] shadow-[8px_8px_0px_rgba(26,23,20,0.3)]">
            <p className="newspaper-text text-xl md:text-2xl italic font-bold leading-relaxed">
              "<span className="text-[#8b1a1a]">Đảng Cộng sản Đông Dương</span>: Bước chuyển hướng lịch sử vĩ đại từ <span className="text-[#8b1a1a]">đấu tranh bí mật</span> ra <span className="text-[#8b1a1a]">ánh sáng công khai</span>."
            </p>
            <div className="mt-4 text-sm typewriter-text uppercase tracking-widest opacity-70">
              Cuộn để đọc tiếp
            </div>
          </div>

          {/* Stamp decoration */}
          <div className="absolute -bottom-12 -right-12 stamp w-32 h-32 bg-[#8b1a1a] text-[#f5ede0] flex items-center justify-center transform rotate-12 opacity-90">
            <div className="text-center">
              <div className="text-xs font-bold">CƠ QUAN</div>
              <div className="text-2xl font-black">★</div>
              <div className="text-xs font-bold">CHÍNH THỨC</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-16 animate-bounce"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">⇣</span>
            <div className="w-[2px] h-16 bg-[#1a1714]"></div>
          </div>
        </motion.div>
      </header>

      {/* Timeline with 3D Scroll */}
      <main className="max-w-7xl mx-auto py-24 px-8 perspective-[1200px]">
        {milestones.map((m, idx) => (
          <MilestoneCard key={m.id} m={m} index={idx} />
        ))}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-24 border-t-[6px] border-double border-[#1a1714] mt-32 bg-[#f5ede0] relative"
        >
          {/* Decorative corners */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-[#1a1714]"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-[#1a1714]"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-[#1a1714]"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-[#1a1714]"></div>

          <div className="text-6xl mb-6 text-[#8b1a1a]">★</div>
          <h2 className="newspaper-title text-6xl md:text-8xl font-black mb-8 uppercase tracking-tight text-[#8b1a1a] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">Thời Khắc Đã Điểm</h2>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-32 h-[3px] bg-[#1a1714]"></div>
            <span className="text-2xl">✦</span>
            <div className="w-32 h-[3px] bg-[#1a1714]"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
            <button 
              onClick={() => navigate('/play')}
              className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-black uppercase tracking-[0.2em] text-[#f5ede0] bg-[#8b1a1a] border-4 border-[#1a1714] overflow-hidden transition-all hover:scale-105 hover:bg-[#a52020] active:scale-95 shadow-[8px_8px_0px_rgba(26,23,20,0.5)] cursor-pointer"
            >
              <span className="relative typewriter-text flex items-center gap-3">
                <span className="text-2xl">★</span>
                Hóa thân vào Lịch sử
                <span className="text-2xl">★</span>
              </span>
            </button>

            <button 
              onClick={() => navigate('/game3d')}
              className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-black uppercase tracking-[0.2em] text-[#1a1714] bg-[#fbbf24] border-4 border-[#1a1714] overflow-hidden transition-all hover:scale-105 hover:bg-[#f59e0b] active:scale-95 shadow-[8px_8px_0px_rgba(26,23,20,0.5)] cursor-pointer"
            >
              <span className="relative typewriter-text flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                60 Giây Tẩu Tán
                <span className="text-2xl">🎮</span>
              </span>
            </button>
          </div>
          
          <div className="mt-12 typewriter-text text-sm opacity-80 border-t-2 border-dashed border-[#1a1714] pt-8 max-w-md mx-auto">
            <p>Đồng chí là người điều phối?</p>
            <button 
              onClick={() => navigate('/host')} 
              className="underline hover:text-[#8b1a1a] font-bold mt-2 text-base text-[#8b1a1a] cursor-pointer"
            >
              → Tạo phong trào (Host) ←
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
