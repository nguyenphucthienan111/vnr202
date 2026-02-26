// 50 câu hỏi về phong trào Đông Dương Đại hội 1936-1939
// Đáp án được xáo trộn ngẫu nhiên mỗi lần load

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Raw questions với đáp án đúng luôn ở index 0
const RAW_QUESTIONS: Array<{ q: string; o: string[]; e?: string; d: 'easy' | 'medium' | 'hard' }> = [
  // EASY (20 câu)
  { q: 'Hội nghị Ban Chấp hành Trung ương Đảng lần thứ 7 diễn ra vào thời gian nào?', o: ['Tháng 7/1936', 'Tháng 5/1936', 'Tháng 9/1936', 'Tháng 12/1936'], e: 'Hội nghị diễn ra tháng 7/1936 do đồng chí Lê Hồng Phong chủ trì.', d: 'easy' },
  { q: 'Cuộc mít tinh lớn tại Khu Đấu xảo Hà Nội diễn ra vào ngày nào?', o: ['1/5/1938', '1/1/1938', '19/5/1938', '2/9/1938'], e: 'Ngày Quốc tế Lao động 1/5/1938, hơn 2 vạn người tham gia.', d: 'easy' },
  { q: 'Mặt trận Nhân dân Pháp lên cầm quyền vào năm nào?', o: ['1936', '1935', '1937', '1938'], d: 'easy' },
  { q: 'Đảng quyết định chuyển từ đấu tranh bí mật sang hình thức nào?', o: ['Công khai, hợp pháp', 'Vũ trang', 'Ngoại giao', 'Kinh tế'], d: 'easy' },
  { q: 'Tổ chức nào được thành lập để đoàn kết các tầng lớp nhân dân?', o: ['Mặt trận Dân chủ Đông Dương', 'Mặt trận Dân tộc', 'Hội Liên hiệp', 'Đoàn Thanh niên'], d: 'easy' },
  { q: 'Giai cấp nào đóng vai trò nòng cốt trong phong trào công nhân?', o: ['Công nhân', 'Nông dân', 'Tiểu thương', 'Trí thức'], d: 'easy' },
  { q: 'Hình thức đấu tranh nào công nhân thường sử dụng?', o: ['Đình công, bãi công', 'Biểu tình', 'Viết báo', 'Kiến nghị'], d: 'easy' },
  { q: 'Tiểu thương hỗ trợ phong trào chủ yếu bằng gì?', o: ['Tài chính, tiền bạc', 'Lực lượng', 'Vũ khí', 'Thông tin'], d: 'easy' },
  { q: 'Chủ nghĩa nào đang đe dọa hòa bình thế giới thời kỳ này?', o: ['Chủ nghĩa phát xít', 'Chủ nghĩa tư bản', 'Chủ nghĩa đế quốc', 'Chủ nghĩa thực dân'], d: 'easy' },
  { q: 'Phong trào Đông Dương Đại hội diễn ra trong giai đoạn nào?', o: ['1936-1939', '1930-1935', '1940-1945', '1925-1930'], d: 'easy' },
  { q: 'Ai là người chủ trì Hội nghị Ban Chấp hành Trung ương lần thứ 7?', o: ['Lê Hồng Phong', 'Hồ Chí Minh', 'Trường Chinh', 'Phạm Văn Đồng'], d: 'easy' },
  { q: 'Báo nào là báo công khai của phong trào?', o: ['Tiền Phong', 'Nhân Dân', 'Quân Đội', 'Công An'], d: 'easy' },
  { q: 'Mục tiêu trước mắt của phong trào là gì?', o: ['Chống phát xít, đòi dân chủ', 'Giành chính quyền', 'Cải cách ruộng đất', 'Xây dựng quân đội'], d: 'easy' },
  { q: 'Số người tham gia mít tinh 1/5/1938 là bao nhiêu?', o: ['Hơn 20.000 người', 'Khoảng 5.000 người', 'Khoảng 10.000 người', 'Hơn 50.000 người'], d: 'easy' },
  { q: 'Trí thức đóng góp vào phong trào bằng cách nào?', o: ['Tuyên truyền, viết báo', 'Lãnh đạo vũ trang', 'Đàm phán với Pháp', 'Tổ chức quân đội'], d: 'easy' },
  { q: 'Nông dân đóng góp vào phong trào bằng cách nào?', o: ['Tham gia biểu tình, ký tên dân nguyện', 'Cung cấp lương thực', 'Đóng góp tiền', 'Tổ chức vũ trang'], d: 'easy' },
  { q: 'Hình thức đấu tranh chủ yếu giai đoạn 1936-1939 là gì?', o: ['Đấu tranh chính trị công khai', 'Vũ trang khởi nghĩa', 'Chiến tranh du kích', 'Ngoại giao quốc tế'], d: 'easy' },
  { q: 'Đảng tạm gác khẩu hiệu nào trong giai đoạn này?', o: ['"Độc lập dân tộc"', '"Hòa bình, Dân chủ"', '"Đoàn kết toàn dân"', '"Chống đế quốc"'], d: 'easy' },
  { q: 'Báo Dân Chúng là báo gì?', o: ['Báo công khai của phong trào', 'Báo bí mật', 'Báo của thực dân', 'Báo quốc tế'], d: 'easy' },
  { q: 'Khu Đấu xảo ở thành phố nào?', o: ['Hà Nội', 'Sài Gòn', 'Huế', 'Đà Nẵng'], d: 'easy' },
  
  // MEDIUM (20 câu)
  { q: 'Tại sao Đảng quyết định tạm gác khẩu hiệu "Độc lập dân tộc"?', o: ['Để tập trung chống phát xít và tranh thủ quyền dân chủ', 'Vì lực lượng còn yếu', 'Vì áp lực từ Pháp', 'Để hợp tác với thực dân'], e: 'Tập trung chống phát xít, tranh thủ quyền dân chủ trong bối cảnh quốc tế mới.', d: 'medium' },
  { q: 'Ý nghĩa quan trọng nhất của phong trào Đông Dương Đại hội là gì?', o: ['Đảng chuyển từ bí mật ra công khai, mở rộng ảnh hưởng', 'Lật đổ thực dân Pháp', 'Thành lập chính phủ mới', 'Giành độc lập hoàn toàn'], d: 'medium' },
  { q: 'Phong trào Đông Dương Đại hội tạo điều kiện cho sự kiện nào sau này?', o: ['Cách mạng Tháng Tám 1945', 'Khởi nghĩa Nam Kỳ 1940', 'Chiến dịch Điện Biên Phủ', 'Hiệp định Genève'], d: 'medium' },
  { q: 'Mặt trận Nhân dân Pháp có chính sách gì với Đông Dương?', o: ['Nới lỏng chính sách, thả tù chính trị', 'Đàn áp mạnh hơn', 'Cho độc lập hoàn toàn', 'Không thay đổi gì'], d: 'medium' },
  { q: 'Báo Tin Tức có vai trò gì trong phong trào?', o: ['Tuyên truyền công khai cho phong trào', 'Báo bí mật của Đảng', 'Báo của thực dân Pháp', 'Báo quốc tế'], d: 'medium' },
  { q: 'Đặc điểm nổi bật của phong trào Đông Dương Đại hội là gì?', o: ['Kết hợp đấu tranh công khai và bí mật', 'Chỉ đấu tranh vũ trang', 'Chỉ đấu tranh ngoại giao', 'Chỉ đấu tranh kinh tế'], d: 'medium' },
  { q: 'Vai trò của báo chí trong phong trào là gì?', o: ['Tuyên truyền, vận động quần chúng', 'Chỉ đạo vũ trang', 'Đàm phán với Pháp', 'Thu thập tình báo'], d: 'medium' },
  { q: 'Tầng lớp nào tham gia đông đảo nhất vào phong trào?', o: ['Công nhân và nông dân', 'Chỉ trí thức', 'Chỉ tiểu thương', 'Chỉ địa chủ'], d: 'medium' },
  { q: 'Phong trào đòi quyền lợi gì trước mắt?', o: ['Tự do, dân chủ, cơm áo', 'Độc lập ngay lập tức', 'Cải cách ruộng đất', 'Xây dựng quân đội'], d: 'medium' },
  { q: 'Hội nghị TW 7 quyết định chiến lược nào?', o: ['Chuyển hướng từ vũ trang sang dân chủ', 'Tiếp tục khởi nghĩa vũ trang', 'Đàm phán với Pháp', 'Rút lui về căn cứ'], d: 'medium' },
  { q: 'Mặt trận Dân chủ Đông Dương gồm những ai?', o: ['Các tầng lớp nhân dân yêu nước', 'Chỉ có Đảng viên', 'Chỉ có công nhân', 'Chỉ có trí thức'], d: 'medium' },
  { q: 'Cuộc mít tinh 1/5/1938 chứng tỏ điều gì?', o: ['Sức mạnh đoàn kết của nhân dân', 'Đảng đã giành chính quyền', 'Pháp đã rút lui', 'Chiến tranh đã kết thúc'], d: 'medium' },
  { q: 'Đảng sử dụng hình thức đấu tranh nào?', o: ['Kết hợp nhiều hình thức', 'Chỉ vũ trang', 'Chỉ chính trị', 'Chỉ ngoại giao'], d: 'medium' },
  { q: 'Phong trào có ý nghĩa gì với Đảng?', o: ['Mở rộng ảnh hưởng, tăng cường lực lượng', 'Giành chính quyền ngay', 'Thành lập chính phủ', 'Ký hiệp định với Pháp'], d: 'medium' },
  { q: 'Bối cảnh quốc tế nào ảnh hưởng đến phong trào?', o: ['Mặt trận Nhân dân Pháp lên cầm quyền', 'Chiến tranh thế giới bùng nổ', 'Liên Xô sụp đổ', 'Mỹ tham chiến'], d: 'medium' },
  { q: 'Đảng tận dụng điều gì để hoạt động công khai?', o: ['Chính sách nới lỏng của Mặt trận Nhân dân Pháp', 'Sự yếu kém của thực dân', 'Sự giúp đỡ của nước ngoài', 'Vũ khí hiện đại'], d: 'medium' },
  { q: 'Phong trào kết thúc vào năm nào?', o: ['1939', '1940', '1945', '1938'], d: 'medium' },
  { q: 'Sau phong trào, Đảng chuyển sang giai đoạn nào?', o: ['Chuẩn bị tổng khởi nghĩa', 'Tiếp tục đấu tranh hòa bình', 'Giải tán tổ chức', 'Đàm phán với Pháp'], d: 'medium' },
  { q: 'Đảng rút ra bài học gì từ phong trào?', o: ['Kết hợp đấu tranh hợp pháp và bất hợp pháp', 'Chỉ nên đấu tranh vũ trang', 'Không nên hoạt động công khai', 'Nên đàm phán với thực dân'], d: 'medium' },
  { q: 'Phong trào có ảnh hưởng gì đến quần chúng?', o: ['Nâng cao nhận thức chính trị', 'Không có ảnh hưởng gì', 'Làm quần chúng sợ hãi', 'Chia rẽ quần chúng'], d: 'medium' },
  
  // HARD (10 câu)
  { q: 'Phong trào Đông Dương Đại hội có mối liên hệ gì với bối cảnh thế giới?', o: ['Phản ánh xu thế chống phát xít toàn cầu', 'Không liên quan đến thế giới', 'Chỉ là vấn đề nội bộ', 'Do áp lực từ Mỹ'], d: 'hard' },
  { q: 'Đảng vận dụng chiến thuật nào trong phong trào?', o: ['Linh hoạt kết hợp nhiều hình thức đấu tranh', 'Chỉ dùng bạo lực', 'Chỉ dùng hòa bình', 'Không có chiến thuật'], d: 'hard' },
  { q: 'Ý nghĩa lịch sử sâu xa của phong trào là gì?', o: ['Đánh dấu sự trưởng thành của Đảng và phong trào cách mạng', 'Chỉ là một phong trào nhỏ', 'Không có ý nghĩa gì', 'Chỉ là thất bại'], d: 'hard' },
  { q: 'Phong trào đã chuẩn bị gì cho Cách mạng Tháng Tám?', o: ['Lực lượng chính trị và tổ chức quần chúng', 'Vũ khí và quân đội', 'Tiền bạc và tài chính', 'Không chuẩn bị gì'], d: 'hard' },
  { q: 'Đảng đã khắc phục khó khăn nào trong phong trào?', o: ['Cân bằng giữa hợp pháp và bí mật', 'Không có khó khăn', 'Chỉ gặp khó khăn về tài chính', 'Chỉ gặp khó khăn về nhân sự'], d: 'hard' },
  { q: 'Phong trào thể hiện đường lối nào của Đảng?', o: ['Linh hoạt, sáng tạo trong từng giai đoạn', 'Cứng nhắc, giáo điều', 'Không có đường lối', 'Chỉ theo lệnh nước ngoài'], d: 'hard' },
  { q: 'Đảng đã xây dựng được gì qua phong trào?', o: ['Mặt trận dân tộc thống nhất rộng rãi', 'Chỉ có tổ chức Đảng', 'Không xây dựng được gì', 'Chỉ có quân đội'], d: 'hard' },
  { q: 'Phong trào có ảnh hưởng gì đến thực dân Pháp?', o: ['Buộc Pháp phải nhượng bộ một số quyền lợi', 'Không ảnh hưởng gì', 'Làm Pháp mạnh hơn', 'Pháp rút lui hoàn toàn'], d: 'hard' },
  { q: 'Bài học chiến lược nào từ phong trào?', o: ['Biết nắm bắt thời cơ và linh hoạt chiến thuật', 'Chỉ nên dùng vũ lực', 'Không nên đấu tranh', 'Nên đầu hàng'], d: 'hard' },
  { q: 'Phong trào góp phần gì vào lịch sử dân tộc?', o: ['Khẳng định vai trò lãnh đạo của Đảng', 'Không góp phần gì', 'Làm suy yếu phong trào', 'Chia rẽ dân tộc'], d: 'hard' }
];

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Convert raw to Question with shuffled options
function createQuestion(raw: { q: string; o: string[]; e?: string; d: 'easy' | 'medium' | 'hard' }, index: number): Question {
  const correctOption = raw.o[0]; // Đáp án đúng luôn ở index 0
  const shuffledOptions = shuffleArray(raw.o);
  const newCorrectIndex = shuffledOptions.indexOf(correctOption);
  
  return {
    id: `q${index + 1}`,
    question: raw.q,
    options: shuffledOptions,
    correctAnswer: newCorrectIndex,
    explanation: raw.e,
    difficulty: raw.d
  };
}

// Generate all questions with shuffled options
export const QUESTIONS: Question[] = RAW_QUESTIONS.map((raw, idx) => createQuestion(raw, idx));

// Get random questions
export function getRandomQuestions(count: number, difficulty?: 'easy' | 'medium' | 'hard'): Question[] {
  let pool = difficulty ? QUESTIONS.filter(q => q.difficulty === difficulty) : QUESTIONS;
  return shuffleArray(pool).slice(0, count);
}

// Get a single random question
export function getRandomQuestion(): Question {
  return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
}
