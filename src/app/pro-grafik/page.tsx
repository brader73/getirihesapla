"use client";

import React, { useEffect, useRef, useState } from 'react';

// Declaration to let TypeScript know about the TradingView property on the window object
declare global {
  interface Window {
    TradingView: any;
  }
}

export default function ProGrafikPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load script once
    if (document.getElementById('tradingview-widget-script')) {
      setIsLoaded(true);
      setTimeout(initWidget, 100); // Küçük bir gecikme ile DOM'un hazır olmasını bekle
      return;
    }

    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      initWidget();
      setIsLoaded(true);
    };
    
    document.body.appendChild(script);

    return () => {
      // Clean up script if unmounted before loading
      // (Usually we keep the script in the document for fast re-renders)
    };
  }, []);

  const initWidget = () => {
    if (typeof window.TradingView !== 'undefined' && containerRef.current) {
      new window.TradingView.widget({
        autosize: true,
        symbol: "BIST:THYAO", // Varsayılan BIST 100 verisi widget'ta sorunlu olabiliyor, en hacimli hisse THYAO seçildi
        interval: "D",
        timezone: "Europe/Istanbul",
        theme: "dark",
        style: "1", // Mum grafiği
        locale: "tr",
        enable_publishing: false,
        backgroundColor: "rgba(2, 6, 23, 1)", // Tailwind #020617 (slate-950/background)
        gridColor: "rgba(30, 41, 59, 0.4)", // İnce slate-800 grid
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: true,
        container_id: containerRef.current.id,
        toolbar_bg: "#0f172a", // slate-900
        studies: [
          "RSI@tv-basicstudies", // Göreceli Güç Endeksi
          "MACD@tv-basicstudies", // Hareketli Ortalama Yakınsama/Iraksama
          "MASimple@tv-basicstudies" // Basit Hareketli Ortalama
        ],
        disabled_features: [
          "header_symbol_search", // Kendi sembol aramamızı entegre etmemek için TradingView'inkini kullanabiliriz, ama şimdilik kendi UI'ı kalsın
        ],
        enabled_features: [
          "study_templates",
          "use_localstorage_for_settings"
        ]
      });
    }
  };

  return (
    <div className="bg-[#020617] h-[calc(100vh-46px)] md:h-screen w-full flex flex-col relative overflow-hidden font-sans">
      
      {/* Premium Header */}
      <header className="h-16 shrink-0 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-amber-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.2)]">
            <span className="text-xl">📈</span>
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide">Pro Grafik <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase tracking-widest ml-2 align-middle">Beta</span></h1>
            <p className="text-xs text-slate-400">TradingView altyapısı ile gelişmiş teknik analiz terminali</p>
          </div>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Gerçek Zamanlı Veri Akışı
          </div>
        </div>
      </header>

      {/* Main Chart Area */}
      <div className="flex-1 w-full relative p-2 md:p-4 bg-gradient-to-b from-[#020617] to-slate-950">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-20 rounded-2xl">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-400 font-bold animate-pulse">Grafik Terminali Yükleniyor...</p>
            <p className="text-slate-500 text-sm mt-2">Hisse, Kripto, Endeks ve Emtia verileri hazırlanıyor</p>
          </div>
        )}
        
        {/* TradingView Container */}
        <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative bg-[#020617]">
          <div 
            id="korfu-tradingview-widget" 
            ref={containerRef} 
            className="w-full h-full absolute inset-0"
          />
        </div>
      </div>
      
    </div>
  );
}
