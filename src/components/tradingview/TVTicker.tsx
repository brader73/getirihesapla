"use client";

import React, { useMemo } from "react";
import { useMarketData } from "@/context/MarketContext";

export default function TVTicker() {
  const { dataMap } = useMarketData();

  const tickerData = useMemo(() => {
    const symbols = [
      { id: "GOLD", title: "Ons Altın", type: "yahoo" },
      { id: "BTCUSDT", title: "Bitcoin", type: "crypto" },
      { id: "ETHUSDT", title: "Ethereum", type: "crypto" },
      { id: "THYAO", title: "THYAO", type: "yahoo" },
      { id: "USDTRY", title: "USD/TRY", type: "crypto" }
    ];

    const results = [];

    for (const item of symbols) {
      const data = dataMap[item.id];
      if (data) {
        let formattedPrice = "";
        
        // Fiyat formatlama
        if (item.id === "BTCUSDT" || item.id === "ETHUSDT" || item.id === "GOLD") {
          formattedPrice = `$${data.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (item.id === "THYAO") {
          formattedPrice = `${data.price.toFixed(2)} ₺`;
        } else if (item.id === "USDTRY") {
          formattedPrice = data.price.toFixed(4);
        } else {
          formattedPrice = data.price.toFixed(2);
        }

        results.push({
          symbol: item.id,
          title: item.title,
          price: formattedPrice,
          changePercent: data.change.toFixed(2),
          isPositive: data.change >= 0
        });
      }
    }

    return results;
  }, [dataMap]);

  if (tickerData.length === 0) {
    return (
      <div className="w-full h-[54px] bg-[#0A192F] border-b-2 border-[#D4AF37] flex items-center justify-center overflow-hidden relative z-50 shadow-md">
        <span className="text-[#D4AF37] text-[15px] font-semibold tracking-wider">Piyasa Verileri Yükleniyor...</span>
      </div>
    );
  }

  // Sonsuz döngü hissi vermek için verileri kopyala
  const tickerItems = [...tickerData, ...tickerData, ...tickerData, ...tickerData, ...tickerData, ...tickerData];

  return (
    <div className="w-full h-[54px] bg-[#0A192F] border-b-2 border-[#D4AF37] flex items-center overflow-hidden relative z-50 shadow-md">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker-marquee 40s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
      
      <div className="animate-ticker whitespace-nowrap">
        {tickerItems.map((item, index) => (
          <div key={`${item.symbol}-${index}`} className="flex items-center mx-12 gap-5 text-[15px] font-semibold tracking-wide">
            <span className="text-slate-200 flex items-center gap-2">
              {item.title === "Ons Altın" && <span className="text-amber-400 text-lg">🥇</span>}
              {item.title === "Bitcoin" && <span className="text-orange-400 text-lg">₿</span>}
              {item.title === "Ethereum" && <span className="text-indigo-400 text-lg">⟠</span>}
              {item.title === "THYAO" && <span className="text-slate-300 bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center text-[12px] border border-slate-600">T</span>}
              <span>{item.title}</span>
            </span>
            <span className="text-white font-semibold">{item.price}</span>
            <span className={item.isPositive ? "text-emerald-500" : "text-red-500"}>
              {item.isPositive ? "+" : ""}{item.changePercent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
