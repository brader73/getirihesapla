"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip);

interface MacroIndicator {
  id: string;
  name: string;
  category: "rate" | "market" | "crypto";
  symbol: string;
  value: number | null;
  change: number | null;
  changePercent: number | null;
  unit: string;
  desc: string;
  source: string;
  isLive: boolean;
}

const STATIC_INDICATORS = {
  "FED": { value: 5.25, change: 0, changePercent: 0, unit: "%", name: "FED Politika Faizi", desc: "ABD Merkez Bankası (FED) üst bant faiz oranı.", source: "Federal Reserve" },
  "TCMB": { value: 50.00, change: 0, changePercent: 0, unit: "%", name: "TCMB Politika Faizi", desc: "TCMB 1 Hafta Vadeli Repo İhale Faiz Oranı.", source: "TCMB" },
  "US_INF": { value: 3.4, change: -0.1, changePercent: -2.85, unit: "%", name: "ABD Enflasyonu (TÜFE)", desc: "ABD Yıllık Tüketici Fiyat Endeksi.", source: "BLS" },
  "TR_INF": { value: 69.80, change: 1.3, changePercent: 1.89, unit: "%", name: "Türkiye Enflasyonu (TÜFE)", desc: "TÜİK Yıllık Tüketici Fiyat Endeksi.", source: "TÜİK" },
  "BTC_DOM": { value: 54.2, change: 0.5, changePercent: 0.93, unit: "%", name: "Bitcoin Dominance", desc: "Kripto para piyasasında Bitcoin'in pazar payı.", source: "CoinMarketCap" },
};

const LIVE_SYMBOLS = [
  { id: "DXY", symbol: "DX-Y.NYB", name: "Dolar Endeksi (DXY)", unit: "pts", desc: "ABD Doları'nın 6 majör para birimine karşı değeri.", source: "ICE" },
  { id: "VIX", symbol: "^VIX", name: "VIX Korku Endeksi", unit: "pts", desc: "S&P 500 opsiyon volatilitesi (Korku Endeksi).", source: "CBOE" },
  { id: "US10Y", symbol: "^TNX", name: "ABD 10 Yıllık Tahvil", unit: "%", desc: "ABD 10 Yıllık Hazine Tahvili Getirisi.", source: "US Treasury" },
  { id: "GOLD", symbol: "GC=F", name: "Ons Altın", unit: "$", desc: "Comex Altın Vadeli İşlem Fiyatı.", source: "COMEX" },
  { id: "OIL", symbol: "CL=F", name: "Ham Petrol (WTI)", unit: "$", desc: "WTI Ham Petrol Vadeli İşlem Fiyatı.", source: "NYMEX" },
];

export default function MacroPanel() {
  const [indicators, setIndicators] = useState<MacroIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLiveData = async () => {
    try {
      setError(null);
      
      // Init static data
      const data: MacroIndicator[] = [
        { id: "FED", category: "rate", symbol: "", isLive: false, ...STATIC_INDICATORS["FED"] },
        { id: "TCMB", category: "rate", symbol: "", isLive: false, ...STATIC_INDICATORS["TCMB"] },
        { id: "US_INF", category: "rate", symbol: "", isLive: false, ...STATIC_INDICATORS["US_INF"] },
        { id: "TR_INF", category: "rate", symbol: "", isLive: false, ...STATIC_INDICATORS["TR_INF"] },
      ];

      // Fetch Live data
      const queryStr = LIVE_SYMBOLS.map(s => s.symbol).join(",");
      const res = await fetch(`/api/finance/quote?symbols=${encodeURIComponent(queryStr)}`);
      
      if (!res.ok) throw new Error("Canlı veri sunucusuna ulaşılamadı.");
      const liveData = await res.json();
      
      const liveMap = new Map();
      liveData.forEach((item: any) => liveMap.set(item.symbol, item));

      LIVE_SYMBOLS.forEach(ls => {
        const d = liveMap.get(ls.symbol);
        if (d) {
          data.push({
            id: ls.id,
            name: ls.name,
            category: "market",
            symbol: ls.symbol,
            value: d.price,
            change: d.change,
            changePercent: d.changePercent,
            unit: ls.unit,
            desc: ls.desc,
            source: ls.source,
            isLive: true,
          });
        }
      });

      // BTC Dominance
      data.push({ id: "BTC_DOM", category: "crypto", symbol: "", isLive: false, ...STATIC_INDICATORS["BTC_DOM"] });

      setIndicators(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Veriler alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (changePct: number | null, inverse = false) => {
    if (!changePct) return "text-slate-400";
    // For things like Inflation or VIX, going up is "bad" (red), going down is "good" (green)
    // If inverse is true, positive = red, negative = green.
    if (changePct > 0) return inverse ? "text-red-500" : "text-emerald-500";
    if (changePct < 0) return inverse ? "text-emerald-500" : "text-red-500";
    return "text-slate-400";
  };

  const generateMockChartData = (currentVal: number | null) => {
    if (!currentVal) return [10, 10, 10, 10, 10, 10, 10];
    const trend = (Math.random() - 0.5) * (currentVal * 0.05);
    return Array.from({length: 7}, (_, i) => currentVal + trend * (i - 3) + (Math.random() - 0.5) * (currentVal * 0.01));
  };

  const MiniChart = ({ value, colorStr }: { value: number | null, colorStr: string }) => {
    const data = {
      labels: ["1", "2", "3", "4", "5", "6", "7"],
      datasets: [
        {
          data: generateMockChartData(value),
          borderColor: colorStr.includes("emerald") ? "#10b981" : colorStr.includes("red") ? "#ef4444" : "#94a3b8",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
        }
      ]
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } }
    };
    return <Line data={data} options={options} />;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-8 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
              Makro Ekonomi Paneli
            </h1>
            <p className="text-slate-400 mt-2 text-sm max-w-2xl">
              Küresel piyasaları yönlendiren ana göstergelerin anlık takibi. Profesyonel analizleriniz için Bloomberg terminali standartlarında hazırlanmıştır.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Son Güncelleme</span>
              <span className="text-sm text-slate-300 font-mono">
                {loading ? "Yükleniyor..." : lastUpdated?.toLocaleTimeString('tr-TR', { hour12: false }) || "-"}
              </span>
            </div>
            <button 
              onClick={() => { setLoading(true); fetchLiveData(); }}
              className="p-2 rounded-lg bg-blue-600/20 text-blue-500 hover:bg-blue-600/40 transition-colors"
              title="Yenile"
            >
              <svg className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && indicators.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Merkez Bankaları ve Enflasyon */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                🏦 Para Politikası ve Enflasyon
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {indicators.filter(i => i.category === "rate").map(ind => {
                  const inverseColor = ind.id.includes("INF"); // Enflasyon artışı kötüdür (kırmızı)
                  const colorStr = getStatusColor(ind.changePercent, inverseColor);
                  return (
                    <div key={ind.id} className="relative group bg-gradient-to-b from-slate-900 to-[#0a0f1d] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-slate-200">{ind.name}</h3>
                          <span className="text-[10px] text-slate-500">{ind.source}</span>
                        </div>
                        {ind.isLive && (
                          <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Canlı
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-3xl font-mono font-bold text-white flex items-baseline gap-1">
                            {ind.value?.toFixed(2)} <span className="text-sm text-slate-500 font-sans">{ind.unit}</span>
                          </div>
                          <div className={`text-sm mt-1 flex items-center gap-1 font-medium ${colorStr}`}>
                            {ind.changePercent && ind.changePercent > 0 ? "▲" : ind.changePercent && ind.changePercent < 0 ? "▼" : "▬"}
                            {ind.changePercent ? Math.abs(ind.changePercent).toFixed(2) : "0.00"}% 
                            <span className="text-slate-600 text-xs ml-1">({ind.change && ind.change > 0 ? "+" : ""}{ind.change?.toFixed(2)})</span>
                          </div>
                        </div>
                        <div className="w-16 h-10 opacity-50 group-hover:opacity-100 transition-opacity">
                           <MiniChart value={ind.value} colorStr={colorStr} />
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs text-slate-300 p-3 rounded-lg border border-slate-700 w-[110%] -left-[5%] -top-12 pointer-events-none z-10 shadow-xl backdrop-blur-xl">
                        {ind.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Küresel Piyasalar ve Emtia */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                🌍 Küresel Göstergeler ve Emtia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {indicators.filter(i => i.category === "market").map(ind => {
                  const inverseColor = ind.id === "VIX"; // VIX (Korku endeksi) artışı kötüdür (kırmızı)
                  const colorStr = getStatusColor(ind.changePercent, inverseColor);
                  return (
                    <div key={ind.id} className="relative group bg-gradient-to-b from-slate-900 to-[#0a0f1d] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-slate-200">{ind.name}</h3>
                          <span className="text-[10px] text-slate-500">{ind.symbol} • {ind.source}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between flex-col">
                        <div className="w-full">
                          <div className="text-2xl font-mono font-bold text-white flex items-baseline gap-1">
                            {ind.value?.toFixed(2) || "---"} <span className="text-xs text-slate-500 font-sans">{ind.unit}</span>
                          </div>
                          <div className={`text-xs mt-1 flex items-center gap-1 font-medium ${colorStr}`}>
                            {ind.changePercent && ind.changePercent > 0 ? "▲" : ind.changePercent && ind.changePercent < 0 ? "▼" : "▬"}
                            {ind.changePercent ? Math.abs(ind.changePercent).toFixed(2) : "0.00"}%
                          </div>
                        </div>
                        <div className="w-full h-8 mt-3 opacity-60">
                           <MiniChart value={ind.value} colorStr={colorStr} />
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs text-slate-300 p-3 rounded-lg border border-slate-700 w-[110%] -left-[5%] -top-12 pointer-events-none z-10 shadow-xl backdrop-blur-xl">
                        {ind.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kripto ve Diğerleri */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                ₿ Kripto Ekonomi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {indicators.filter(i => i.category === "crypto").map(ind => {
                  const colorStr = getStatusColor(ind.changePercent);
                  return (
                    <div key={ind.id} className="relative group bg-gradient-to-b from-slate-900 to-[#0a0f1d] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-slate-200">{ind.name}</h3>
                          <span className="text-[10px] text-slate-500">{ind.source}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-3xl font-mono font-bold text-white flex items-baseline gap-1">
                            {ind.value?.toFixed(2)} <span className="text-sm text-slate-500 font-sans">{ind.unit}</span>
                          </div>
                          <div className={`text-sm mt-1 flex items-center gap-1 font-medium ${colorStr}`}>
                            {ind.changePercent && ind.changePercent > 0 ? "▲" : ind.changePercent && ind.changePercent < 0 ? "▼" : "▬"}
                            {ind.changePercent ? Math.abs(ind.changePercent).toFixed(2) : "0.00"}%
                          </div>
                        </div>
                        <div className="w-16 h-10 opacity-50 group-hover:opacity-100 transition-opacity">
                           <MiniChart value={ind.value} colorStr={colorStr} />
                        </div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-xs text-slate-300 p-3 rounded-lg border border-slate-700 w-[110%] -left-[5%] -top-12 pointer-events-none z-10 shadow-xl backdrop-blur-xl">
                        {ind.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
