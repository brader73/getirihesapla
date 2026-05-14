"use client";

import React, { useEffect, useRef } from "react";

export default function TVTicker() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear existing script if any
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
          { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq 100" },
          { "description": "BIST 100", "proName": "BIST:XU100" },
          { "description": "USD/TRY", "proName": "FX_IDC:USDTRY" },
          { "description": "EUR/TRY", "proName": "FX_IDC:EURTRY" },
          { "description": "Gram Altın", "proName": "FX_IDC:XAUTRYG" },
          { "description": "Bitcoin", "proName": "BINANCE:BTCUSDT" }
        ],
        "showSymbolLogo": true,
        "isTransparent": false,
        "displayMode": "adaptive",
        "colorTheme": "dark",
        "locale": "tr"
      }
    `;
    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container h-[46px]" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
