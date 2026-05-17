"use client";

import React from 'react';
import DynamicMarketPanel from '@/components/tradingview/DynamicMarketPanel';

export default function ProGrafikPage() {
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
      <div className="flex-1 w-full relative p-2 md:p-6 bg-gradient-to-b from-[#020617] to-slate-950 overflow-hidden">
        <DynamicMarketPanel fullHeight={true} />
      </div>
      
    </div>
  );
}
