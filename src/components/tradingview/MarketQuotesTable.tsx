"use client";

import React, { useState } from "react";
import { useMarketData, ASSETS } from "@/context/MarketContext";

export default function MarketQuotesTable() {
  const { dataMap } = useMarketData();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const TABS = [
    { id: "all", label: "Tümü" },
    { id: "yahoo", label: "BIST & Global" },
    { id: "crypto", label: "Kripto & Döviz" }
  ];

  const filteredAssets = ASSETS.filter(asset => {
    // 1. Tab Filtresi
    if (activeTab !== "all" && asset.type !== activeTab) return false;
    
    // 2. Arama Filtresi
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return asset.name.toLowerCase().includes(q) || asset.symbol.toLowerCase().includes(q) || asset.id.toLowerCase().includes(q);
    }
    
    return true;
  });

  return (
    <div className="w-full bg-[#0a0e17] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans relative">
      
      {/* Üst Arama Barı ve Sekmeler */}
      <div className="p-4 md:p-6 border-b border-slate-800 bg-[#0d1321] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 bg-[#151b2b] p-1 rounded-lg">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2235]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96">
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Hisse, Kripto, Döviz, Emtia Ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#151b2b] border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-[#0d1321] text-slate-500 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-semibold">İsim</th>
              <th className="px-6 py-4 font-semibold text-right">Son Fiyat</th>
              <th className="px-6 py-4 font-semibold text-right">Fark %</th>
              <th className="px-6 py-4 font-semibold text-right hidden sm:table-cell">Yüksek</th>
              <th className="px-6 py-4 font-semibold text-right hidden sm:table-cell">Düşük</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map(asset => {
                const data = dataMap[asset.id];
                if (!data) return null;

                const isPositive = data.change >= 0;
                
                // Format price
                let priceFormatted = data.price.toFixed(2);
                if (asset.id === 'USDTRY') priceFormatted = data.price.toFixed(4);
                if (asset.id === 'BTCUSDT' || asset.id === 'ETHUSDT' || asset.id === 'GOLD') priceFormatted = data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                return (
                  <tr 
                    key={asset.id} 
                    className="border-b border-slate-800/50 hover:bg-[#151b2b] transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{asset.name}</span>
                        <span className="text-xs text-slate-500">{asset.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-white">
                      {asset.id === 'GOLD' || asset.type === 'crypto' ? '$' : '₺'}{priceFormatted}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? '+' : ''}{data.change.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                      {data.high ? data.high.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                      {data.low ? data.low.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) : '-'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  Sonuç bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
