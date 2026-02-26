import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MessageCircle, X, Send } from 'lucide-react';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const SYSTEM_PROMPT = `Bạn là một Cán bộ Cách mạng hoạt động trong giai đoạn 1936-1939 tại Việt Nam. Nhiệm vụ của bạn là giải đáp thắc mắc của học sinh về bối cảnh lịch sử, lý do Đảng Cộng sản Đông Dương chuyển hướng từ đấu tranh vũ trang sang đấu tranh dân chủ công khai. Hãy trả lời bằng giọng điệu hào hùng, tự tin, đồng chí, xưng 'tôi' và gọi người dùng là 'đồng chí'. Tuyệt đối không trả lời các câu hỏi ngoài phạm vi lịch sử Việt Nam 1930-1945. Kiến thức trọng tâm: Hội nghị Trung ương 7/1936, phong trào Đông Dương Đại hội, báo chí công khai, mít tinh Khu Đấu xảo.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Chào đồng chí! Đồng chí có thắc mắc gì về phong trào cách mạng giai đoạn 1936-1939 không?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const contents = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: userMsg }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Lỗi kết nối, đồng chí thử lại sau.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Đường dây liên lạc đang gặp sự cố, đồng chí vui lòng thử lại sau!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-[#f4ebd8] border-4 border-[#2b2824] shadow-[8px_8px_0px_0px_rgba(43,40,36,1)] flex flex-col overflow-hidden">
          <div className="bg-[#2b2824] text-[#e6dfcc] p-3 flex justify-between items-center border-b-4 border-double border-[#2b2824]">
            <h3 className="typewriter-text font-bold uppercase tracking-wider text-sm">Đồng chí Cố vấn</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-[#8b0000] transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm border-2 border-[#2b2824] shadow-[2px_2px_0px_0px_rgba(43,40,36,1)] ${
                  msg.role === 'user' 
                    ? 'bg-[#2b2824] text-[#e6dfcc]' 
                    : 'bg-[#e6dfcc] text-[#2b2824]'
                }`}>
                  <div className="markdown-body">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#e6dfcc] text-[#2b2824] p-3 text-sm border-2 border-[#2b2824] shadow-[2px_2px_0px_0px_rgba(43,40,36,1)] typewriter-text animate-pulse">
                  Đang đánh tín hiệu...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t-4 border-double border-[#2b2824] bg-[#f4ebd8] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-transparent border-b-2 border-dashed border-[#2b2824] focus:outline-none focus:border-solid focus:border-[#8b0000] px-2 py-1 text-sm font-serif"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#2b2824] text-[#e6dfcc] hover:bg-[#8b0000] disabled:opacity-50 transition-colors border-2 border-transparent"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#2b2824] text-[#e6dfcc] rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(43,40,36,1)] hover:scale-110 transition-transform border-2 border-[#e6dfcc]"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
