"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Card, InputGroup, ResultBox, AdvisorInsight } from "./shared";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RealReturn() {
  const [data, setData] = useState({ nominal: 45, inflation: 60 });
  const [result, setResult] = useState<{ realReturn: number; chartData: any } | null>(null);

  const calculate = () => {
    const n = data.nominal / 100;
    const i = data.inflation / 100;
    
    // Fisher Denklemi: (1 + Nominal Getiri) / (1 + Enflasyon) - 1
    const realReturn = ((1 + n) / (1 + i)) - 1;
    const realReturnPct = realReturn * 100;

    setResult({
      realReturn: realReturnPct,
      chartData: {
        labels: ["Nominal Getiri", "Enflasyon", "Gerçek (Reel) Getiri"],
        datasets: [
          {
            label: "Oran (%)",
            data: [data.nominal, data.inflation, realReturnPct],
            backgroundColor: [
              "#3b82f6", // Nominal (Blue)
              "#ef4444", // Inflation (Red)
              realReturnPct >= 0 ? "#10b981" : "#b91c1c" // Real (Green if pos, Dark Red if neg)
            ],
            borderRadius: 6,
          },
        ],
      },
    });
  };

  return (
    <Card title="Reel Getiri Hesaplama (Fisher Denklemi)">
      <InputGroup label="Nominal Getiri Oranınız (%)" value={data.nominal} onChange={(e: any) => setData({ ...data, nominal: +e.target.value })} />
      <InputGroup label="Beklenen/Gerçekleşen Enflasyon (%)" value={data.inflation} onChange={(e: any) => setData({ ...data, inflation: +e.target.value })} />
      
      <div className="mb-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
        * Gerçek alım gücünüzdeki değişimi bulmak için uluslararası standart olan <strong>Fisher Denklemi</strong> <code>((1+N)/(1+E))-1</code> kullanılmaktadır. Basit çıkarma işlemi (N-E) yanıltıcıdır.
      </div>

      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Reel Getiriyi Hesapla</button>
      
      {result && (
        <div className="mt-6">
          <ResultBox 
            show={true} 
            title="Enflasyondan Arındırılmış Gerçek Getiriniz" 
            value={`%${result.realReturn.toFixed(2)}`} 
            note={result.realReturn < 0 ? "Dikkat: Alım gücünüz düşmüş (Zarardasınız)." : "Tebrikler: Enflasyonu yendiniz!"} 
          />
          <div className="mt-6 h-48">
            <Bar 
              data={result.chartData} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: '#334155' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>

          <AdvisorInsight 
            type={result.realReturn > 5 ? 'success' : result.realReturn > 0 ? 'info' : 'danger'}
            message={
              result.realReturn > 5 
                ? "Harika! Portföyünüz enflasyonun üzerinde, çok güçlü bir reel büyüme sergiliyor. Alım gücünüz istikrarlı bir şekilde artıyor."
                : result.realReturn > 0
                ? "Yatırımınız enflasyonu ucu ucuna yeniyor. Alım gücünüz korunuyor ancak reel büyüme sınırlı. Getiri potansiyeli daha yüksek alternatifler değerlendirilebilir."
                : "Riskli Bölge: Yatırımınızın getirisi enflasyonun altında kalmış. Portföyünüz sayısal olarak artsa bile, reel alım gücünüz maalesef eriyor."
            }
            riskLevel={result.realReturn > 5 ? 'Düşük' : result.realReturn > 0 ? 'Orta' : 'Yüksek'}
            metrics={[
              { label: 'Reel Büyüme Oranı', value: `%${result.realReturn.toFixed(2)}` },
              { label: 'Enflasyon Etkisi', value: `%${((1 - (1/(1+(data.inflation/100)))) * 100).toFixed(2)} erime` }
            ]}
          />
        </div>
      )}
    </Card>
  );
}
