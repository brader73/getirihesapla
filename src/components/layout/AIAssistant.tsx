"use client";

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isTyping?: boolean;
};

const SUGGESTIONS = [
  "Aylık 10.000 TL nasıl değerlendirilir?",
  "BES mi fon mu?",
  "Portföyüm riskli mi?"
];

// Basit bir kural tabanlı yanıt motoru (Mock AI)
const getAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("10.000 tl") || lowerQuery.includes("nasıl değerlendirilir")) {
    return "Aylık 10.000 TL gibi düzenli bir yatırımla uzun vadede ciddi bir servet yaratabilirsiniz. Eğer risk toleransınız yüksekse %50 hisse senedi fonu, %30 altın/döviz tabanlı fonlar ve %20 BES/Mevduat gibi dengeli bir portföy kurabilirsiniz. Bu sayede maliyet ortalaması yapmış olursunuz.";
  }
  
  if (lowerQuery.includes("bes") && lowerQuery.includes("fon")) {
    return "BES (Bireysel Emeklilik) ve Fonlar birbirinin rakibi değil, tamamlayıcısıdır. BES %20 devlet katkısı ile muazzam bir garanti getiri sunarken (10 yıl kalma şartıyla), yatırım fonları daha likit ve agresif getiri potansiyeli sağlar. İkisini bir arada kullanmak en iyi stratejidir.";
  }
  
  if (lowerQuery.includes("riskli mi") || lowerQuery.includes("risk")) {
    return "Portföy riskinizi anlamak için varlık dağılımınıza bakmalıyız. Eğer tüm paranız kripto ve tekil hisse senetlerindeyse 'Yüksek Risk' altındasınız. Paramın tamamı mevduatta diyorsanız, paranızın enflasyon karşısında erime (alım gücü kaybı) riski vardır. Çeşitlendirme (Diversifikasyon) en iyi savunmadır.";
  }

  return "Bu harika bir soru. Korfu Finance algoritmaları bu konuyu değerlendiriyor. Genel bir kural olarak, yatırımlarınızı çeşitlendirmeyi ve vadenizi uzun tutmayı unutmayın. Daha spesifik bir hesaplama için menüdeki hesaplama araçlarımızı kullanabilirsiniz.";
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Merhaba! Ben Korfu AI Asistanı. Size nasıl yatırım stratejileri önerebilirim?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Add typing indicator
    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: typingId, sender: 'ai', text: '', isTyping: true }]);

    // Simulate network latency (1-2 seconds)
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== typingId)); // Remove typing
      const response = getAIResponse(text);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: response }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div 
        className={`transition-all duration-300 transform origin-bottom-right mb-4 overflow-hidden pointer-events-auto
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        style={{ width: '360px', height: '500px', maxWidth: 'calc(100vw - 48px)', maxHeight: 'calc(100vh - 120px)' }}
      >
        <div className="w-full h-full bg-slate-900/95 backdrop-blur-3xl border border-slate-700/50 shadow-2xl shadow-indigo-500/10 rounded-3xl flex flex-col overflow-hidden relative">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-slate-700/50 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center relative">
                <span className="text-xl relative z-10">🤖</span>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Korfu AI Asistan</h3>
                <p className="text-[10px] text-emerald-400 font-medium">Çevrimiçi</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition p-1">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-700">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20' 
                    : 'bg-slate-800 border border-slate-700/50 text-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.isTyping ? (
                     <div className="flex items-center gap-1.5 h-5 px-1">
                       <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                  ) : (
                    <p className="leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1.5 hover:bg-amber-500/20 transition text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-slate-800/50 border-t border-slate-700/50">
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                placeholder="Yatırım sorunuzu yazın..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
              />
              <button 
                onClick={() => handleSend(inputValue)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 relative group pointer-events-auto"
      >
        <span className="text-2xl">🤖</span>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-indigo-400 rounded-full blur animate-ping opacity-20"></div>
      </button>
    </div>
  );
}

