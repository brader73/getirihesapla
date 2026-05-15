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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

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
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      <div className="border-b border-slate-800 px-4 pt-4 flex gap-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-500'
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
            const color = isPositive ? '#4ade80' : '#f87171'; // Tailwind emerald-400 / rose-400

            const chartData = {
              labels: data.labels,
              datasets: [
                {
                  data: data.history,
                  borderColor: color,
                  borderWidth: 2,
                  pointRadius: 0,
                  fill: false,
                  tension: 0.1,
                },
              ],
            };

            const chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { enabled: false } },
              scales: { x: { display: false }, y: { display: false } },
              animation: { duration: 0 },
            };

            // Format price
            let priceFormatted = data.price.toFixed(2);
            if (asset.type === 'yahoo' && asset.id !== 'XU100' && asset.id !== 'GOLD') {
               priceFormatted = `₺${data.price.toFixed(2)}`;
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
              <div key={asset.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-amber-500/30 transition-all group">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">{asset.name}</div>
                  <div className={`text-sm font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-100 mb-4 tracking-tight">
                  {priceFormatted}
                </div>
                <div className="h-16 w-full">
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
