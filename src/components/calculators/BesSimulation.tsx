"use client";

import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Card, InputGroup, ResultBox, AdvisorInsight, formatCurrency } from "./shared";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BesSimulation() {
  const [bes, setBes] = useState({ contribution: 2000, expectedReturn: 40, years: 10 });
  const [result, setResult] = useState<{ total: number; stateTotal: number; principal: number; chartData: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    if (bes.contribution <= 0 || bes.expectedReturn <= 0 || bes.years <= 0) {
      setError("Lütfen geçerli (sıfırdan büyük) değerler giriniz.");
      setResult(null);
      return;
    }

    const { contribution, expectedReturn, years } = bes;
    const r = expectedReturn / 100 / 12;
    const n = years * 12;
    
    // Devlet katkısı aylık %20
    const stateContribution = contribution * 0.20;
    
    // Bileşik faiz ile yatırımın büyümesi
    const userTotal = contribution * ((Math.pow(1 + r, n) - 1) / r);
    // Devlet katkısının aynı fonda büyümesi
    const stateTotal = stateContribution * ((Math.pow(1 + r, n) - 1) / r);
    
    const total = userTotal + stateTotal;
    const principal = contribution * n;

    setResult({
      total,
      stateTotal,
      principal,
      chartData: {
        labels: ["Kendi Birikimim (+Getirisi)", "Devlet Katkısı (+Getirisi)"],
        datasets: [
          {
            data: [userTotal, stateTotal],
            backgroundColor: ["#3b82f6", "#10b981"], // Blue and Green
            borderColor: ["#2563eb", "#059669"],
            borderWidth: 1,
          },
        ],
      },
    });
  };

  return (
    <Card title="Bireysel Emeklilik (BES) Simülasyonu">
      {error && <div className="mb-4 text-sm text-red-500 font-semibold bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</div>}
      
      <InputGroup label="Aylık Katkı Payı" value={bes.contribution} onChange={(e: any) => setBes({ ...bes, contribution: +e.target.value })} />
      <InputGroup label="Beklenen Yıllık Fon Getirisi (%)" value={bes.expectedReturn} onChange={(e: any) => setBes({ ...bes, expectedReturn: +e.target.value })} />
      <InputGroup label="Sistemde Kalınacak Süre (Yıl)" value={bes.years} onChange={(e: any) => setBes({ ...bes, years: +e.target.value })} />
      
      <div className="mb-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
        * Hesaplamada <strong>%20 Devlet Katkısı</strong> avantajı varsayılan olarak fona dahil edilerek aynı oranda nemalandırılmıştır. Yıllık devlet katkısı limitleri hesaba katılmamıştır (Basit Simülasyon).
      </div>

      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">BES Getirisini Hesapla</button>
      
      {result && (
        <div className="mt-6">
          <ResultBox show={true} title="Tahmini Toplam BES Fon Değeri" value={formatCurrency(result.total)} note={`${bes.years} yıl sonunda oluşacak tahmini birikiminiz.`} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Ödediğiniz Toplam Katkı Payı</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(result.principal)}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Devlet Katkısı ve Getirisi</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{formatCurrency(result.stateTotal)}</div>
            </div>
          </div>
          <div className="mt-6 flex justify-center h-48">
            <Pie data={result.chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }} />
          </div>

          <AdvisorInsight 
            type={bes.years >= 10 ? 'success' : 'warning'}
            message={
              bes.years >= 10 
                ? "BES planınız 10 yılı aştığı için devlet katkısının tamamına (%100) hak kazanıyorsunuz. Bileşik getirinin ve %20 devlet desteğinin gücü uzun vadede muazzam bir kaldıraç yaratıyor. Bu plan uzun vadede çok güçlü görünüyor."
                : "Sistemde 10 yıldan kısa süre kaldığınız için devlet katkısının sadece bir kısmına (%15-%60 arası) hak kazanacaksınız. BES'in asıl gücü 10 yıl ve 56 yaş kriterleri karşılandığında ortaya çıkar."
            }
            riskLevel={bes.expectedReturn > 60 ? 'Yüksek (Agresif Fonlar)' : bes.expectedReturn > 30 ? 'Orta (Dengeli)' : 'Düşük (Para Piyasası)'}
            metrics={[
              { label: 'Ödenen Anapara', value: formatCurrency(result.principal) },
              { label: 'Bileşik Getiri Çarpanı', value: `${(result.total / result.principal).toFixed(2)}x` }
            ]}
          />
        </div>
      )}
    </Card>
  );
}
