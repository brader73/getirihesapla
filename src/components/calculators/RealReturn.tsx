"use client";

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Card, InputGroup, ResultBox, AIAnalysisDashboard } from "./shared";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useSaveCalculation } from "@/lib/useSaveCalculation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RealReturn() {
  const [data, setData] = useState({ nominal: 45, inflation: 60 });
  const [result, setResult] = useState<{ realReturn: number; chartData: any } | null>(null);
  const { saveCalculation, isSaving, user } = useSaveCalculation();

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

  const handleSave = () => {
    if (result) {
      saveCalculation("Reel Getiri", `Reel Getiri: %${result.realReturn.toFixed(2)}`);
    }
  };

  return (
    <Card title="Reel Getiri Hesaplama (Fisher Denklemi)">
      <InputGroup label="Nominal Getiri Oranınız (%)" value={data.nominal} onChange={(e: any) => setData({ ...data, nominal: +e.target.value })} />
      <InputGroup label="Beklenen/Gerçekleşen Enflasyon (%)" value={data.inflation} onChange={(e: any) => setData({ ...data, inflation: +e.target.value })} />
      
      <div className="mb-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
        * Gerçek alım gücünüzdeki değişimi bulmak için uluslararası standart olan <strong>Fisher Denklemi</strong> <code>((1+N)/(1+E))-1</code> kullanılmaktadır. Basit çıkarma işlemi (N-E) yanıltıcıdır.
      </div>

      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition-all duration-300">Reel Getiriyi Hesapla</button>
      
      {result && (
        <div className="mt-6">
          <ResultBox 
            show={true} 
            title="Enflasyondan Arındırılmış Gerçek Getiriniz" 
            value={`%${result.realReturn.toFixed(2)}`} 
            note={result.realReturn < 0 ? "Dikkat: Alım gücünüz düşmüş (Zarardasınız)." : "Tebrikler: Enflasyonu yendiniz!"} 
            onSave={user ? handleSave : undefined}
            isSaving={isSaving}
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

          <AIAnalysisDashboard 
            score={result.realReturn > 10 ? 98 : result.realReturn > 5 ? 85 : result.realReturn > 0 ? 65 : 30}
            riskLevel={result.realReturn < 0 ? 'Yüksek' : data.inflation > 40 ? 'Orta' : 'Düşük'}
            growthPotential={result.realReturn > 5 ? 'Yüksek' : result.realReturn > 0 ? 'Orta' : 'Düşük'}
            inflationImpact={result.realReturn > 0 ? 'Dirençli (Nötr)' : 'Negatif'}
            longTermView={
              result.realReturn > 5 
                ? "Mevcut stratejiniz enflasyon karşısında çok dirençli. Bu reel getiri oranı uzun vadede servetinizi katlayarak büyütecek güçlü bir kaldıraç sağlıyor."
                : result.realReturn > 0
                ? "Yatırımınız enflasyona karşı korunuyor ancak reel büyüme hızı yavaş. Uzun vadede hedeflerinize ulaşmak için risk/getiri profili daha yüksek varlıklar eklenebilir."
                : "Negatif reel getiri, alım gücünüzün günden güne erimesine neden oluyor. Uzun vadeli finansal hedefler için enflasyon korumalı varlıklara (hisse senedi, değerli maden, gayrimenkul) geçiş değerlendirilmeli."
            }
            pros={[
              result.realReturn > 0 ? `Enflasyon oranının (%${data.inflation}) üzerinde getiri sağlanıyor.` : "Nominal olarak sermaye artışı görülüyor.",
              result.realReturn > 5 ? "Alım gücünde agresif artış ivmesi yakalanmış durumda." : "Sermaye piyasalarında kalmak nakitte kalmaktan daha iyidir."
            ]}
            cons={[
              result.realReturn <= 0 ? `Portföyünüzün alım gücü %${Math.abs(result.realReturn).toFixed(2)} eriyor.` : "Yüksek enflasyon dönemlerinde vergisel yükler reel getiriyi daha da düşürebilir.",
              data.inflation > 40 ? "Yüksek enflasyon ortamı makroekonomik istikrarsızlık riskleri taşır." : "Sadece risksiz getirilerle uzun vadeli servet yaratımı zordur."
            ]}
          />
        </div>
      )}
    </Card>
  );
}
