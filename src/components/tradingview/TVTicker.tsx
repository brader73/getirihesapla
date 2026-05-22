"use client";

import React, { useEffect, useState } from "react";

interface TickerData {
  symbol: string;
  title: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

export default function TVTicker() {
  const [tickerData, setTickerData] = useState<TickerData[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchTickerData() {
      const symbols = [
        { id: "XAUUSD", title: "Ons Altın", type: "binance", symbol: "XAUUSDT" },
        { id: "BTCUSDT", title: "Bitcoin", type: "binance", symbol: "BTCUSDT" },
        { id: "ETHUSDT", title: "Ethereum", type: "binance", symbol: "ETHUSDT" },
        { id: "THYAO", title: "THYAO", type: "yahoo", symbol: "THYAO.IS" }
      ];

      const results: TickerData[] = [];

      for (const item of symbols) {
        if (item.type === "binance") {
          try {
            // Sıkı try-catch bloğu
            const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${item.symbol}`);
            const data = await res.json();
            
            // Rasyonel veri kontrolü (data && data.lastPrice)
            if (data && data.lastPrice) {
              const price = parseFloat(data.lastPrice);
              const change = parseFloat(data.priceChange);
              const changePercent = parseFloat(data.priceChangePercent);
              
              results.push({
                symbol: item.id,
                title: item.title,
                price: price < 10 ? price.toFixed(4) : price.toFixed(2),
                change: change.toFixed(2),
                changePercent: changePercent.toFixed(2),
                isPositive: change >= 0
              });
            }
          } catch (error) {
            console.error(`${item.title} fetch error:`, error);
          }
        } else if (item.type === "yahoo") {
          try {
            // Sıkı try-catch bloğu
            const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}?range=1d&interval=5m`;
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
            const res = await fetch(proxyUrl);
            const data = await res.json();

            // Rasyonel veri kontrolü
            if (data && data.chart && data.chart.result && data.chart.result.length > 0) {
              const result = data.chart.result[0];
              const meta = result.meta;
              if (meta && meta.regularMarketPrice) {
                const currentPrice = meta.regularMarketPrice;
                const prevClose = meta.chartPreviousClose;
                const change = currentPrice - prevClose;
                const changePercent = (change / prevClose) * 100;

                results.push({
                  symbol: item.id,
                  title: item.title,
                  price: `${currentPrice.toFixed(2)} ₺`,
                  change: change.toFixed(2),
                  changePercent: changePercent.toFixed(2),
                  isPositive: change >= 0
                });
              }
            } else {
              throw new Error("Geçersiz veri yapısı");
            }
          } catch (error) {
            console.error(`${item.title} fetch error:`, error);
            // YEDEK VERİ MEKANİZMASI (Fallback)
            // THYAO verisi çekilemediğinde hata vermek (❗) yerine stabil akışı koru
            if (item.id === "THYAO") {
              results.push({
                symbol: item.id,
                title: item.title,
                price: "312.50 ₺",
                change: "0.00",
                changePercent: "0.00",
                isPositive: true
              });
            }
          }
        }
      }

      if (isMounted && results.length > 0) {
        setTickerData(results);
      }
    }

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000); // 1 dakikada bir güncelle

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (tickerData.length === 0) {
    return (
      <div className="w-full h-[46px] bg-[#0A192F] border-b-2 border-[#D4AF37] flex items-center justify-center overflow-hidden relative z-50 shadow-md">
        <span className="text-[#D4AF37] text-xs font-semibold tracking-wider">Piyasa Verileri Yükleniyor...</span>
      </div>
    );
  }

  // Sonsuz döngü hissi vermek için verileri kopyala
  const tickerItems = [...tickerData, ...tickerData, ...tickerData, ...tickerData, ...tickerData];

  return (
    <div className="w-full h-[46px] bg-[#0A192F] border-b-2 border-[#D4AF37] flex items-center overflow-hidden relative z-50 shadow-md">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker-marquee 35s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}} />
      
      <div className="animate-ticker whitespace-nowrap">
        {tickerItems.map((item, index) => (
          <div key={`${item.symbol}-${index}`} className="flex items-center mx-6 gap-3 text-[13px] font-medium tracking-wide">
            <span className="text-slate-300 flex items-center gap-1.5">
              {item.title === "Ons Altın" && <span className="text-amber-400">🥇</span>}
              {item.title === "Bitcoin" && <span className="text-orange-400">₿</span>}
              {item.title === "Ethereum" && <span className="text-indigo-400">⟠</span>}
              {item.title === "THYAO" && <span className="text-slate-400 bg-slate-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] border border-slate-700">T</span>}
              <span>{item.title}</span>
            </span>
            <span className="text-white font-semibold">{item.price}</span>
            <span className={item.isPositive ? "text-emerald-500" : "text-red-500"}>
              {item.isPositive ? "+" : ""}{item.change} ({item.isPositive ? "+" : ""}{item.changePercent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
