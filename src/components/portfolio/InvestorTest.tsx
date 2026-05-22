"use client";

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";

const QUESTIONS = [
  {
    id: 1,
    text: "Piyasa %10 düştüğünde ne yaparsınız?",
    options: [
      { text: "Daha fazla alım yaparım (Dipten topla)", type: "A" },
      { text: "Ucuzlamış temettü hissesi eklerim", type: "B" },
      { text: "Makro raporları ve fonları incelerim", type: "C" },
      { text: "Nakite geçer veya altın alırım", type: "D" },
    ]
  },
  {
    id: 2,
    text: "Yatırım vadeniz ortalama nedir?",
    options: [
      { text: "1 Yıldan az / Günlük-Aylık işlemler", type: "A" },
      { text: "Ömür boyu (Sürekli nakit akışı)", type: "B" },
      { text: "5 - 10 Yıl arası uzun vade", type: "C" },
      { text: "Vadem yok, anaparamı korumak istiyorum", type: "D" },
    ]
  },
  {
    id: 3,
    text: "Portföyünüzün ana varlığı hangisidir?",
    options: [
      { text: "Teknoloji Hisseleri & Kripto Paralar", type: "A" },
      { text: "Güçlü Sanayi ve Enerji Hisseleri", type: "B" },
      { text: "Karma Fonlar ve Küresel Endeksler", type: "C" },
      { text: "Altın, Döviz ve Mevduat Faizi", type: "D" },
    ]
  },
  {
    id: 4,
    text: "Yatırımdaki ana başarı ölçütünüz nedir?",
    options: [
      { text: "Endeksi %50 yenmek ve hızlı servet", type: "A" },
      { text: "Düzenli aylık/yıllık pasif gelir elde etmek", type: "B" },
      { text: "Enflasyon üstünde istikrarlı, risksiz getiri", type: "C" },
      { text: "Hiç para kaybetmemek ve güvende hissetmek", type: "D" },
    ]
  },
  {
    id: 5,
    text: "Piyasaları ne sıklıkla takip edersiniz?",
    options: [
      { text: "Her saniye, ekran ve grafik başındayım", type: "A" },
      { text: "Temettü tarihlerinde ve bilanço dönemlerinde", type: "B" },
      { text: "Haftalık veya aylık makro veri açıklandığında", type: "C" },
      { text: "Nadiren, sadece büyük bir kriz varsa", type: "D" },
    ]
  }
];

const PROFILES: Record<string, { title: string; desc: string; icon: string }> = {
  "A": {
    title: "Agresif Boğa",
    desc: "Yüksek risk iştahına sahip, kripto ve büyüme odaklı teknoloji hisselerini seven korkusuz bir yatırımcısın.",
    icon: "🐂"
  },
  "B": {
    title: "Temettü Avcısı",
    desc: "Düzenli pasif gelir ve nakit akışı odaklı, şirketlerin karlılığına ortak olan sadık bir yatırımcısın.",
    icon: "💸"
  },
  "C": {
    title: "Dengeli Filozof",
    desc: "Makro ekonomiyi takip eden, sabırlı ve risklerini sepet mantığıyla dağıtan stratejik bir yatırımcısın.",
    icon: "⚖️"
  },
  "D": {
    title: "Defansif Kale",
    desc: "Önceliği anaparayı korumak olan; altın, döviz ve mevduat odaklı garantici, sarsılmaz bir yatırımcısın.",
    icon: "🏰"
  }
};

export default function InvestorTest() {
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultProfile, setResultProfile] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setStage("quiz");
    setCurrentQIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: string[]) => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    finalAnswers.forEach(ans => counts[ans]++);
    
    // Find the most frequent answer type
    let dominantType = "A";
    let max = counts["A"];
    Object.keys(counts).forEach(key => {
      if (counts[key] > max) {
        max = counts[key];
        dominantType = key;
      }
    });

    setResultProfile(dominantType);
    setStage("result");
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Yüksek kalite için
        backgroundColor: "#0f172a", // Derin lacivert
        useCORS: true,
        logging: false
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `KorfuFinance_Yatirimci_Kisiligim.png`;
      link.click();
      
      alert("Instagram/TikTok hikayelerinde paylaşmak için görseliniz indirildi! 🎯");
    } catch (err) {
      console.error("Görsel oluşturulurken hata:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const resetTest = () => {
    setStage("intro");
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl mt-12 mb-8">
      
      {stage === "intro" && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <span className="text-4xl">🎯</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Portföyünü simüle ettin, peki sen nasıl bir yatırımcısın?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Finansal hedeflerini, risk toleransını ve yatırım felsefeni analiz ederek sana en uygun piyasa karakterini belirliyoruz. Yatırımcı Kişiliğini Şimdi Öğren!
          </p>
          <button 
            onClick={handleStart}
            className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105"
          >
            Testi Başlat
          </button>
        </div>
      )}

      {stage === "quiz" && (
        <div className="max-w-2xl mx-auto py-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-amber-500 font-bold uppercase tracking-wider text-sm">Soru {currentQIndex + 1} / {QUESTIONS.length}</h3>
            <div className="flex gap-1">
              {QUESTIONS.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx <= currentQIndex ? 'w-8 bg-amber-500' : 'w-4 bg-slate-800'}`} />
              ))}
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-8 leading-tight">
            {QUESTIONS[currentQIndex].text}
          </h2>
          
          <div className="space-y-4">
            {QUESTIONS[currentQIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.type)}
                className="w-full text-left p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-amber-500/50 transition-all text-slate-200 font-medium group flex items-center justify-between"
              >
                <span>{opt.text}</span>
                <span className="w-6 h-6 rounded-full border border-slate-600 group-hover:border-amber-500 flex items-center justify-center opacity-50 group-hover:opacity-100">
                  <div className="w-3 h-3 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === "result" && resultProfile && (
        <div className="max-w-4xl mx-auto py-4 flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">Test Tamamlandı</h3>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Karakterin:<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {PROFILES[resultProfile].title}
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              {PROFILES[resultProfile].desc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={downloadImage}
                disabled={isExporting}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                Görseli İndir ve Paylaş
              </button>
              <button 
                onClick={resetTest}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-700"
              >
                Yeniden Çöz
              </button>
            </div>
          </div>

          <div className="flex-none">
            {/* Spotify Wrapped Style Card (9:16) */}
            <div 
              ref={cardRef}
              className="w-[300px] h-[533px] bg-[#0f172a] rounded-2xl overflow-hidden relative shadow-2xl border border-slate-800 flex flex-col items-center justify-between p-8"
              style={{ backgroundImage: "radial-gradient(circle at top right, rgba(245, 158, 11, 0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.05), transparent 50%)" }}
            >
              {/* Top Logo */}
              <div className="flex items-center gap-2 mt-4">
                <img src="/korfu_logo_transparent.svg" alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-white font-serif font-bold text-lg">KorfuFinance</span>
              </div>
              
              {/* Content */}
              <div className="text-center w-full my-auto flex flex-col items-center justify-center">
                <div className="text-amber-500 font-bold tracking-widest text-xs uppercase mb-6">Yatırımcı Profilim</div>
                <div className="text-7xl mb-6 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  {PROFILES[resultProfile].icon}
                </div>
                <div className="text-white font-serif font-bold text-3xl leading-tight mb-2">
                  Ben bir<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                    {PROFILES[resultProfile].title}im!
                  </span>
                </div>
              </div>
              
              {/* Footer */}
              <div className="w-full text-center mt-auto pb-4">
                <div className="w-12 h-1 bg-amber-500 mx-auto mb-4 rounded-full opacity-50" />
                <p className="text-slate-400 font-semibold text-xs tracking-wider">getirihesapla.vercel.app</p>
              </div>
            </div>
          </div>
          
        </div>
      )}
      
    </div>
  );
}
