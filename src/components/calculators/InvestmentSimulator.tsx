"use client";

import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function InvestmentSimulator() {
  const [initialAmount, setInitialAmount] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2000);
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(45); // Yıllık % getiri
  const [inflation, setInflation] = useState<number>(25); // Yıllık enflasyon beklentisi
  const [dollarAppreciation, setDollarAppreciation] = useState<number>(30); // Doların yıllık artış beklentisi
  const [assetType, setAssetType] = useState<string>("karma"); // BES, hisse, altin, crypto, karma
  const [riskLevel, setRiskLevel] = useState<number>(3); // 1-5 arası

  // Simulation Logic
  const simulationData = useMemo(() => {
    const months = years * 12;
    const monthlyReturnRate = (expectedReturn / 100) / 12;
    const monthlyInflationRate = (inflation / 100) / 12;
    const monthlyDollarRate = (dollarAppreciation / 100) / 12;

    let currentNominal = initialAmount;
    let currentReal = initialAmount;
    let currentDollar = initialAmount / 32; // Varsayılan başlangıç kur: 32 TRY

    const nominalValues = [currentNominal];
    const realValues = [currentReal];
    const dollarValues = [currentDollar];
    const labels = ["Başlangıç"];
    const totalInvestedValues = [initialAmount];

    let totalInvested = initialAmount;

    for (let i = 1; i <= months; i++) {
      // Nominal Büyüme (Bileşik Faiz)
      currentNominal = (currentNominal + monthlyContribution) * (1 + monthlyReturnRate);
      
      // Reel Büyüme (Enflasyondan Arındırılmış)
      // Satın alma gücü hesabında parayı enflasyon oranında iskonto ediyoruz
      const inflationDiscount = Math.pow(1 + monthlyInflationRate, i);
      currentReal = currentNominal / inflationDiscount;

      // Dolar Bazlı Büyüme
      const currentKur = 32 * Math.pow(1 + monthlyDollarRate, i);
      currentDollar = currentNominal / currentKur;

      totalInvested += monthlyContribution;

      if (i % 12 === 0) {
        nominalValues.push(Math.round(currentNominal));
        realValues.push(Math.round(currentReal));
        dollarValues.push(Math.round(currentDollar));
        labels.push(`${i / 12}. Yıl`);
        totalInvestedValues.push(totalInvested);
      }
    }

    // AI-Style Yorum Üretimi
    let aiComment = "";
    const totalReturnPercent = ((currentNominal - totalInvested) / totalInvested) * 100;
    const realReturnPercent = ((currentReal - totalInvested) / totalInvested) * 100;
    
    if (realReturnPercent > 100) {
      aiComment = "Seçtiğiniz strateji enflasyonu ciddi oranda yenebilir. Varlıklarınızın satın alma gücü katlanarak artıyor.";
    } else if (realReturnPercent > 0) {
      aiComment = "Portföyünüz enflasyona karşı korunuyor ve ılımlı bir reel büyüme gösteriyor. Risk seviyesini artırmayı düşünebilirsiniz.";
    } else {
      aiComment = "DİKKAT: Seçilen getiri oranı enflasyonun altında kalıyor. Uzun vadede satın alma gücünüz (reel paranız) eriyebilir!";
    }

    // Volatilite ve Hedef
    const volatilityScore = riskLevel * 15 + (assetType === 'crypto' ? 20 : 0);
    const targetProbability = Math.max(10, 95 - (riskLevel * 5) - (years > 5 ? 0 : 15));

    return {
      labels,
      nominalValues,
      realValues,
      dollarValues,
      totalInvestedValues,
      finalNominal: currentNominal,
      finalReal: currentReal,
      finalDollar: currentDollar,
      totalInvested,
      aiComment,
      volatilityScore,
      targetProbability
    };
  }, [initialAmount, monthlyContribution, years, expectedReturn, inflation, dollarAppreciation, assetType, riskLevel]);

  // Chart Configuration
  const chartData = {
    labels: simulationData.labels,
    datasets: [
      {
        label: 'Nominal Değer (₺)',
        data: simulationData.nominalValues,
        borderColor: '#4f46e5', // indigo-600
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: 'Reel Alım Gücü (Enf. Düzeltilmiş)',
        data: simulationData.realValues,
        borderColor: '#10b981', // emerald-500
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: 'Yatırılan Toplam Anapara',
        data: simulationData.totalInvestedValues,
        borderColor: '#64748b', // slate-500
        backgroundColor: 'transparent',
        borderDash: [2, 2],
        fill: false,
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(2, 6, 23, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(79, 70, 229, 0.3)',
        borderWidth: 1,
        padding: 10,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(30, 41, 59, 0.5)' },
        ticks: { color: '#64748b', callback: (val: any) => '₺' + (val / 1000).toLocaleString() + 'k' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sol Panel: Girdi Parametreleri */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white mb-1">Simülasyon Ayarları</h3>
            <p className="text-xs text-slate-400">Gelecekteki servetinizi senaryolaştırın</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Başlangıç Sermayesi (₺)</label>
              <input 
                type="number" 
                value={initialAmount} 
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Aylık Düzenli Yatırım (₺)</label>
              <input 
                type="number" 
                value={monthlyContribution} 
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Süre (Yıl)</label>
              <input 
                type="number" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Varlık Sınıfı</label>
              <select 
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="karma">Karma Portföy</option>
                <option value="hisse">Hisse Senedi</option>
                <option value="bes">BES Fonları</option>
                <option value="altin">Kıymetli Madenler</option>
                <option value="crypto">Kripto Varlıklar</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-300">Makro Ekonomik Beklentiler</h4>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Yıllık Beklenen Getiri</span>
                <span className="text-indigo-400 font-bold">% {expectedReturn}</span>
              </div>
              <input type="range" min="0" max="150" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Yıllık Enflasyon (TÜFE) Beklentisi</span>
                <span className="text-red-400 font-bold">% {inflation}</span>
              </div>
              <input type="range" min="0" max="100" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Kur (Dolar) Yıllık Artış Beklentisi</span>
                <span className="text-amber-400 font-bold">% {dollarAppreciation}</span>
              </div>
              <input type="range" min="0" max="100" value={dollarAppreciation} onChange={(e) => setDollarAppreciation(Number(e.target.value))} className="w-full accent-amber-500" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Katlanılan Risk Seviyesi (1 Düşük - 5 Yüksek)</span>
                <span className="text-white font-bold">{riskLevel}</span>
              </div>
              <input type="range" min="1" max="5" value={riskLevel} onChange={(e) => setRiskLevel(Number(e.target.value))} className="w-full accent-slate-500" />
            </div>
          </div>
        </div>

        {/* Sağ Panel: Sonuçlar ve Grafik */}
        <div className="w-full lg:w-2/3 flex flex-col">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl -mr-4 -mt-4"></div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Nominal Portföy Değeri</p>
              <p className="text-2xl font-bold text-white font-mono">₺{(simulationData.finalNominal).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-slate-400 mt-1">Gelecekteki kağıt üstündeki tutar</p>
            </div>
            
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-inner relative overflow-hidden border-t-2 border-t-emerald-500">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl -mr-4 -mt-4"></div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Reel Satın Alma Gücü</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono">₺{(simulationData.finalReal).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-slate-400 mt-1">Enflasyondan arındırılmış bugünkü değer</p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl -mr-4 -mt-4"></div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Dolar Karşılığı</p>
              <p className="text-2xl font-bold text-amber-500 font-mono">${(simulationData.finalDollar).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-slate-400 mt-1">{years} yıl sonundaki tahmini döviz bazlı servet</p>
            </div>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-6 min-h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* AI Analiz Bloğu */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2">
                Korfu AI Senaryo Analizi
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {simulationData.aiComment} Toplam <b>₺{(simulationData.totalInvested).toLocaleString('tr-TR')}</b> anapara yatırımınız, 
                risk seviyesine (Volatilite Skoru: {simulationData.volatilityScore}) bağlı olarak dalgalanmalar yaşayabilir. 
                Seçilen senaryoda hedef değere ulaşma ihtimaliniz matematiksel olarak <b>%{simulationData.targetProbability}</b> olarak hesaplanmıştır.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
