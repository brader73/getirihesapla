"use client";

import React, { useRef, useEffect } from "react";
import { useMarketData, ASSETS } from "@/context/MarketContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function MarketDashboard() {
  const { dataMap } = useMarketData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {ASSETS.map((asset) => {
        const data = dataMap[asset.id];
        if (!data) {
          return (
            <div key={asset.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[200px] flex items-center justify-center">
              <span className="text-slate-400">Yükleniyor...</span>
            </div>
          );
        }

        const isPositive = data.change >= 0;
        let priceFormatted =
          asset.type === "yahoo"
            ? asset.symbol === "XU100.IS"
              ? data.price.toFixed(2)
              : data.price.toFixed(4)
            : data.price.toLocaleString("en-US", { style: "currency", currency: "USD" });

        if (asset.symbol === "USDTTRY") priceFormatted = "₺" + data.price.toFixed(4);
        if (asset.symbol === "GC=F") priceFormatted = "$" + data.price.toFixed(2);
        if (asset.symbol === "XU100.IS") priceFormatted = data.price.toFixed(2);

        const chartData = {
          labels: data.labels,
          datasets: [
            {
              data: data.history,
              borderColor: isPositive ? "#4ade80" : "#f87171",
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
          animation: {
            duration: 0,
          },
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
        };

        return (
          <div key={asset.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[200px] transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-2">
              <div className="font-serif font-bold text-xl text-slate-800 dark:text-slate-100">{asset.name}</div>
              <div className={`text-sm font-semibold px-2 py-1 rounded-md ${isPositive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {isPositive ? "+" : ""}{Math.abs(data.change).toFixed(2)}%
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {priceFormatted}
            </div>
            <div className="h-20 w-full relative mt-4">
              <Line data={chartData} options={chartOptions as any} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
