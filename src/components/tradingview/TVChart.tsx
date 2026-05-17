"use client";

import React, { useEffect, useRef, memo } from 'react';

function TVChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": "BIST:THYAO",
      "interval": "D",
      "timezone": "Europe/Istanbul",
      "theme": "dark",
      "style": "1",
      "locale": "tr",
      "enable_publishing": false,
      "backgroundColor": "rgba(2, 6, 23, 1)", 
      "gridColor": "rgba(30, 41, 59, 1)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full h-[500px] md:h-[600px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-sm">
      <div className="tradingview-widget-container w-full h-full" ref={container}>
        <div className="tradingview-widget-container__widget w-full h-full"></div>
      </div>
    </div>
  );
}

export default memo(TVChart);
