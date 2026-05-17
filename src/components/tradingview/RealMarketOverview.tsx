"use client";

import React, { useState } from 'react';
import { useMarketData, ASSETS } from '@/context/MarketContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const TABS = [
  { id: 'bist', label: 'Borsa İstanbul' },
  { id: 'crypto', label: 'Kripto & Döviz' },
];

export default function RealMarketOverview() {
  const { dataMap } = useMarketData();
  const [activeTab, setActiveTab] = useState('bist');

  const filteredAssets = ASSETS.filter(asset => {
    if (activeTab === 'bist') {
      return ['XU100', 'THYAO', 'TUPRS', 'KCHOL', 'AKBNK', 'ISCTR', 'EREGL'].includes(asset.id);
    } else {
      return ['BTCUSDT', 'ETHUSDT', 'USDTRY', 'GOLD'].includes(asset.id);
    }
  });

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-slate-700/50 shadow-2xl shadow-black/50 overflow-hidden">
      <div className="border-b border-slate-700/50 px-6 pt-5 flex gap-6 bg-slate-800/20">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-2 text-sm md:text-base font-bold tracking-wide transition-all border-b-2 relative ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => {
            const data = dataMap[asset.id];

            if (!data) {
              return (
                <div key={asset.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 animate-pulse h-32 flex flex-col justify-center items-center">
                  <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-2"></div>
                  <div className="text-slate-400 text-sm">Yükleniyor...</div>
                </div>
              );
            }

            const isPositive = data.change >= 0;
            const color = isPositive ? '#10b981' : '#f43f5e'; // emerald-500 / rose-500
            const bgColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)';
            const cardTint = isPositive ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-rose-950/20 border-rose-900/30';

            const chartData = {
              labels: data.labels,
              datasets: [
                {
                  data: data.history,
                  borderColor: color,
                  backgroundColor: bgColor,
                  borderWidth: 2,
                  pointRadius: 0,
                  fill: true,
                  tension: 0.4, // Smooth curve
                },
              ],
            };

            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
              scales: { x: { display: false }, y: { display: false } },
              animation: { duration: 0 },
              layout: { padding: 0 }
            };

            // Format price
            let priceFormatted = data.price.toFixed(2);
            if (asset.type === 'yahoo' && asset.id !== 'XU100' && asset.id !== 'GOLD') {
               priceFormatted = `₺${data.price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else if (asset.id === 'USDTRY') {
               priceFormatted = `₺${data.price.toFixed(4)}`;
            } else if (asset.type === 'crypto') {
               priceFormatted = `$${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            } else if (asset.id === 'GOLD') {
               priceFormatted = `$${data.price.toFixed(2)}`;
            } else if (asset.id === 'XU100') {
               priceFormatted = data.price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }

            return (
              <div 
                key={asset.id} 
                className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ease-out backdrop-blur-md border ${cardTint} hover:-translate-y-1 hover:shadow-xl ${isPositive ? 'hover:shadow-emerald-500/10 hover:border-emerald-500/50' : 'hover:shadow-rose-500/10 hover:border-rose-500/50'} group`}
              >
                {/* Heatmap Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full pointer-events-none transition-opacity group-hover:opacity-40 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-100 text-lg group-hover:text-amber-400 transition-colors drop-shadow-sm">{asset.name}</span>
                    <span className="text-xs text-slate-400 font-medium tracking-wider">{asset.symbol}</span>
                  </div>
                  <div className={`text-sm font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm border ${isPositive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)}%
                  </div>
                </div>
                
                <div className="text-3xl font-black text-white mb-4 tracking-tight relative z-10 drop-shadow-md">
                  {priceFormatted}
                </div>
                
                <div className="h-20 w-full relative z-10 -mx-1">
                  <Line data={chartData} options={chartOptions as any} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
