import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'مرحباً بك أيها المهندس. أنا مساعدك الرقمي في منصة هندسة السايبر. هل لديك استفسار حول أحد الدروس التقنية أو تحتاج لشرح مفهوم معين؟' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat({ role: 'user', content: userMessage }).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "أنت مساعد ذكي في منصة 'هندسة السايبر' (Cyber Engineering). " +
            "مهمتك هي مساعدة الطلاب العرب في فهم مفاهيم الأمن السيبراني العميقة. " +
            "تحدث بلغة عربية تقنية راقية ولكن مفهومة. " +
            "ركز على مبدأ 'العلم قبل الأدوات'. " +
            "إذا سألك الطالب عن ثغرات قانونية أو طلب منك اختراق شيء، ذكر بأخلاقيات المهنة ووجهه للتعلم الأخلاقي. " +
            "اجعل إجاباتك مختصرة ومركزة.",
        }
      });

      const reply = response.text || "عذراً، واجهت مشكلة في معالجة طلبك.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "عذراً، حدث خطأ في الاتصال بالنظام العصبي الاصطناعي." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-16 left-8 z-[60]" dir="rtl">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-cyber-accent text-cyber-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-110 transition-transform cursor-pointer"
          >
            <Bot size={28} />
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className={`glass-panel rounded-none shadow-2xl flex flex-col transition-all duration-300 relative overflow-hidden ${isMinimized ? 'h-14 w-64' : 'h-[550px] w-80 md:w-96'}`}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-accent animate-pulse" />
            
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-cyber-accent/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-cyber-accent/10 border border-cyber-accent/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyber-accent/10 animate-pulse" />
                  <Bot size={16} className="text-cyber-accent relative z-10" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider hologram-glow">المستشار التقني</h3>
                  {!isMinimized && <span className="text-[8px] text-cyber-emerald uppercase font-mono animate-pulse opacity-80">CONNECTION_STABLE</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded transition-colors text-cyber-muted">
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded transition-colors text-cyber-muted">
                  <X size={14} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-cyber-accent/20">
                  {messages.map((m, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[90%] p-4 rounded-none text-[11px] font-medium leading-relaxed relative ${
                        m.role === 'user' 
                          ? 'bg-white/5 border border-white/10 text-white rounded-tr-xl' 
                          : 'bg-cyber-accent/5 border border-cyber-accent/20 text-cyber-text rounded-tl-xl shadow-[0_0_15px_rgba(0,242,255,0.05)]'
                      }`}>
                         <div className={`absolute top-0 ${m.role === 'user' ? 'right-0 border-r border-t' : 'left-0 border-l border-t'} border-cyber-accent w-2 h-2 opacity-50`} />
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-end items-center gap-2 text-[9px] text-cyber-accent font-mono animate-pulse">
                      <Loader2 size={10} className="animate-spin" />
                      ANALYZING_CORE_DATA...
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-5 border-t border-white/5 bg-black/40">
                  <div className="relative group">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="أدخل استعلامك التقني..."
                      className="w-full bg-black/60 border border-white/10 rounded-none py-3 pr-4 pl-12 text-[11px] focus:outline-none focus:border-cyber-accent transition-all text-white placeholder:text-slate-600 font-medium"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-cyber-muted hover:text-cyber-accent disabled:opacity-30 transition-all border border-transparent hover:border-cyber-accent/30 bg-white/5"
                    >
                      {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="rotate-180" />}
                    </button>
                  </div>
                  <div className="mt-3 text-[7px] text-slate-700 text-center uppercase tracking-[0.4em] font-mono">
                    NEURAL_LINK_ACTIVE // GEMINI_OS_L4_SECURE
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
