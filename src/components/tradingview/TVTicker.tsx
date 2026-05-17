"use client";

import React, { useEffect, useState } from "react";

interface TickerData {
  id: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isCustom?: boolean;
}

const SYMBOLS = "USDTRY=X,EURTRY=X,GC=F,BTC-USD,ETH-USD,XU100.IS,^IXIC,^GSPC";

export default function TVTicker() {
  const [data, setData] = useState<TickerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch(`/api/finance/quote?symbols=${SYMBOLS}`);
        if (!response.ok) throw new Error("Veri çekilemedi");
        
        const quotes: any[] = await response.json();
        const formattedData: TickerData[] = [];
        
        // Yardımcı haritalama haritası
        const quoteMap = new Map(quotes.map(q => [q.symbol, q]));

        // 1. USD/TRY
        const usdQuote = quoteMap.get("USDTRY=X") || quoteMap.get("TRY=X");
        if (usdQuote) formattedData.push({ id: "USDTRY", name: "USD/TRY", price: usdQuote.price, change: usdQuote.change, changePercent: usdQuote.changePercent });

        // 2. EUR/TRY
        const eurQuote = quoteMap.get("EURTRY=X");
        if (eurQuote) formattedData.push({ id: "EURTRY", name: "EUR/TRY", price: eurQuote.price, change: eurQuote.change, changePercent: eurQuote.changePercent });

        // Ons Altın ve Gram Altın Hesaplama
        const onsQuote = quoteMap.get("GC=F");
        if (onsQuote) {
          // Ons
          formattedData.push({ id: "XAUUSD", name: "Ons Altın", price: onsQuote.price, change: onsQuote.change, changePercent: onsQuote.changePercent });
          
          // Gram (Hesaplanır: Ons / 31.1034768 * USD/TRY)
          if (usdQuote) {
            const gramPrice = (onsQuote.price / 31.1034768) * usdQuote.price;
            // Yüzde değişimi tahmini: (Ons Değişimi + USD Değişimi) / 2 veya direkt tahmini bir varyans.
            // En sağlıklısı ons ve usdtry değişim yüzdelerini toplamak (yaklaşık)
            const gramChangePercent = onsQuote.changePercent + usdQuote.changePercent;
            formattedData.push({ id: "XAUTRY", name: "Gram Altın", price: gramPrice, change: 0, changePercent: gramChangePercent, isCustom: true });
          }
        }

        // Kripto
        const btcQuote = quoteMap.get("BTC-USD");
        if (btcQuote) formattedData.push({ id: "BTC", name: "Bitcoin", price: btcQuote.price, change: btcQuote.change, changePercent: btcQuote.changePercent });
        
        const ethQuote = quoteMap.get("ETH-USD");
        if (ethQuote) formattedData.push({ id: "ETH", name: "Ethereum", price: ethQuote.price, change: ethQuote.change, changePercent: ethQuote.changePercent });

        // Endeksler
        const bistQuote = quoteMap.get("XU100.IS");
        if (bistQuote) formattedData.push({ id: "XU100", name: "BIST100", price: bistQuote.price, change: bistQuote.change, changePercent: bistQuote.changePercent });

        const nasdaqQuote = quoteMap.get("^IXIC");
        if (nasdaqQuote) formattedData.push({ id: "IXIC", name: "Nasdaq", price: nasdaqQuote.price, change: nasdaqQuote.change, changePercent: nasdaqQuote.changePercent });

        const spxQuote = quoteMap.get("^GSPC");
        if (spxQuote) formattedData.push({ id: "SPX", name: "S&P 500", price: spxQuote.price, change: spxQuote.change, changePercent: spxQuote.changePercent });

        setData(formattedData);
        setError(null);
      } catch (err: any) {
        console.error("Ticker fetch error:", err);
        setError(err.message || "Piyasa verileri alınamadı");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
    // 60 saniyede bir güncelle
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, name: string) => {
    if (name.includes("TRY") || name === "Gram Altın") {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(price);
    }
    if (name === "BIST100") {
      return price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(price);
  };

  return (
    <div className="w-full h-[46px] bg-[#0A192F] border-b-2 border-[#D4AF37] flex items-center overflow-hidden text-sm font-semibold select-none relative z-50 shadow-md">
      <style>{`
        @keyframes custom-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-custom-marquee {
          animation: custom-marquee 40s linear infinite;
        }
      `}</style>
      
      {isLoading ? (
        <div className="w-full flex justify-center items-center gap-4 text-slate-400 animate-pulse">
          <svg className="w-5 h-5 text-[#D4AF37] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Piyasalar Yükleniyor...
        </div>
      ) : error ? (
        <div className="w-full flex justify-center text-red-400 text-xs">{error}</div>
      ) : (
        <div className="flex w-max animate-custom-marquee group hover:[animation-play-state:paused]">
          {/* Çift render ederek sonsuz döngü (marquee) sağlıyoruz */}
          {[...data, ...data].map((item, index) => {
            const isPositive = item.changePercent >= 0;
            return (
              <div key={`${item.id}-${index}`} className="flex items-center gap-2 mx-8 transition-opacity duration-300 hover:opacity-80 cursor-default">
                <span className="text-[#D4AF37] tracking-wider">{item.name}</span>
                <span className="text-white font-bold">{formatPrice(item.price, item.name)}</span>
                <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {isPositive ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
