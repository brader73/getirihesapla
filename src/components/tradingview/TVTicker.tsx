"use client";

import React, { useEffect, useRef } from "react";

export default function TVTicker() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Temizle
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;

    // Ayarlar
    script.innerHTML = JSON.stringify({
      "symbols": [
        {
          "proName": "FX_IDC:USDTRY",
          "title": "USD/TRY"
        },
        {
          "proName": "FX_IDC:EURTRY",
          "title": "EUR/TRY"
        },
        {
          "proName": "OANDA:XAUUSD",
          "title": "Ons Altın"
        },
        {
          "proName": "BINANCE:BTCUSDT",
          "title": "Bitcoin"
        },
        {
          "proName": "BINANCE:ETHUSDT",
          "title": "Ethereum"
        },
        {
          "proName": "BIST:THYAO",
          "title": "THYAO"
        },
        {
          "proName": "FOREXCOM:SPXUSD",
          "title": "S&P 500"
        },
        {
          "proName": "FOREXCOM:NSXUSD",
          "title": "Nasdaq"
        }
      ],
      "showSymbolLogo": true,
      "isTransparent": true,
      "displayMode": "adaptive",
      "colorTheme": "dark",
      "locale": "tr"
    });
    
    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full h-[46px] bg-[#0A192F] border-b-2 border-[#D4AF37] flex items-center overflow-hidden relative z-50 shadow-md">
      {/* TradingView Ticker Tape Container */}
      <div className="tradingview-widget-container w-full h-full" ref={container}>
        <div className="tradingview-widget-container__widget w-full h-full"></div>
      </div>
    </div>
  );
}
