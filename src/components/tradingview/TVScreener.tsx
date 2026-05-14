"use client";

import React, { useEffect, useRef, useState } from "react";

type ScreenerMarket = "turkey" | "america" | "crypto" | "forex";

export default function TVScreener() {
  const container = useRef<HTMLDivElement>(null);
  const [activeMarket, setActiveMarket] = useState<ScreenerMarket>("turkey");

  useEffect(() => {
    if (!container.current) return;
    
    // Temizle
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;

    // Ayarlar
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "defaultColumn": "overview",
        "defaultScreen": "general",
        "market": "${activeMarket}",
        "showToolbar": true,
        "colorTheme": "dark",
        "locale": "tr",
        "isTransparent": true
      }
    `;
    container.current.appendChild(script);
  }, [activeMarket]);

  return (
    <div className="flex flex-col h-[600px] w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
      <div className="flex flex-wrap border-b border-slate-800 bg-slate-950">
        <button
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeMarket === "turkey"
              ? "text-amber-500 border-b-2 border-amber-500 bg-slate-900"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          onClick={() => setActiveMarket("turkey")}
        >
          Hisse Senedi (BIST)
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeMarket === "america"
              ? "text-amber-500 border-b-2 border-amber-500 bg-slate-900"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          onClick={() => setActiveMarket("america")}
        >
          Global Hisse (ABD)
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeMarket === "crypto"
              ? "text-amber-500 border-b-2 border-amber-500 bg-slate-900"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          onClick={() => setActiveMarket("crypto")}
        >
          Kripto Paralar
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeMarket === "forex"
              ? "text-amber-500 border-b-2 border-amber-500 bg-slate-900"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          onClick={() => setActiveMarket("forex")}
        >
          Döviz (Forex)
        </button>
      </div>

      {/* Widget Container */}
      <div className="flex-1 relative w-full h-full p-2">
        <div className="tradingview-widget-container h-full w-full" ref={container}>
          <div className="tradingview-widget-container__widget h-full w-full"></div>
        </div>
      </div>
    </div>
  );
}
