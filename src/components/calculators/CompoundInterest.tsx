"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Card, InputGroup, ResultBox, formatCurrency } from "./shared";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CompoundInterest() {
  const [compound, setCompound] = useState({ capital: 10000, monthly: 1500, rate: 25, years: 10 });
  const [result, setResult] = useState<{ total: number; totalPrincipal: number; totalInterest: number; chartData: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    if (compound.capital < 0 || compound.monthly < 0 || compound.rate < 0 || compound.years <= 0) {
      setError("Lütfen geçerli pozitif değerler giriniz.");
      setResult(null);
      return;
    }

    const { capital, monthly, rate, years } = compound;
    const r = rate / 100 / 12;
    const n = years * 12;
    
    // Yıllık getiri (Aylık bileşiklenen) formülü
    const total = capital * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
    const totalPrincipal = capital + (monthly * n);
    const totalInterest = total - totalPrincipal;

    const labels = [];
    const principalValues = [];
    const interestValues = [];
    
    for (let i = 1; i <= years; i++) {
      labels.push(i + ". Yıl");
      const currentPrincipal = capital + (monthly * i * 12);
      const currentTotal = capital * Math.pow(1 + r, i * 12) + monthly * ((Math.pow(1 + r, i * 12) - 1) / r);
      
      principalValues.push(currentPrincipal);
      interestValues.push(currentTotal - currentPrincipal);
    }

    setResult({
      total,
      totalPrincipal,
      totalInterest,
      chartData: {
        labels,
        datasets: [
          { 
            label: "Kümülatif Ana Para (Sermaye)", 
            data: principalValues, 
            backgroundColor: "#3b82f6", 
            stack: 'Stack 0' 
          },
          { 
            label: "Kazanılan Bileşik Faiz", 
            data: interestValues, 
            backgroundColor: "#b45309", 
            stack: 'Stack 0' 
          }
        ],
      },
    });
  };

  return (
    <Card title="Bileşik Faiz & Birikim">
      {error && <div className="mb-4 text-sm text-red-500 font-semibold bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</div>}
      <InputGroup label="Başlangıç Sermayesi" value={compound.capital} onChange={(e: any) => setCompound({ ...compound, capital: +e.target.value })} />
      <InputGroup label="Aylık Ekleme" value={compound.monthly} onChange={(e: any) => setCompound({ ...compound, monthly: +e.target.value })} />
      <InputGroup label="Beklenen Yıllık Getiri (%)" value={compound.rate} onChange={(e: any) => setCompound({ ...compound, rate: +e.target.value })} />
      <InputGroup label="Yatırım Süresi (Yıl)" value={compound.years} onChange={(e: any) => setCompound({ ...compound, years: +e.target.value })} />
      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Büyümeyi Hesapla</button>
      
      {result && (
        <div className="mt-6">
          <ResultBox show={true} title="Toplam Portföy Büyüklüğü" value={formatCurrency(result.total)} note={`${compound.years} yıl sonunda ulaşacağınız tahmini tutar.`} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Sizin Yatırdığınız (Ana Para)</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(result.totalPrincipal)}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Kazanılan Net Faiz</div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-500">{formatCurrency(result.totalInterest)}</div>
            </div>
          </div>
          <div className="mt-6 h-64">
            <Bar 
              data={result.chartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false, 
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } },
                scales: {
                  x: { stacked: true, grid: { color: '#334155', display: false } },
                  y: { stacked: true, grid: { color: '#334155' } }
                }
              }} 
            />
          </div>
        </div>
      )}
    </Card>
  );
}
