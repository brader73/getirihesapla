"use client";

import React, { useState } from "react";
import { Card, InputGroup, ResultBox, AIAnalysisDashboard, formatCurrency } from "./shared";

export default function GordonGrowth() {
  const [gordon, setGordon] = useState({ currentPrice: 100, currentDividend: 10, growthRate: 5, discountRate: 15 });
  const [result, setResult] = useState<{ value: number; nextDividend: number; marginOfSafety: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    const { currentPrice, currentDividend, growthRate, discountRate } = gordon;

    if (currentDividend <= 0) {
      setError("Mevcut Temettü sıfırdan büyük olmalıdır.");
      setResult(null);
      return;
    }

    if (growthRate >= discountRate) {
      setError("Matematiksel hata: Büyüme Hızı (g), İskonto Oranından (r) küçük olmalıdır. Aksi halde sonuç sonsuz veya negatif çıkar.");
      setResult(null);
      return;
    }

    const g = growthRate / 100;
    const r = discountRate / 100;

    // D1 = D0 * (1 + g)
    const nextDividend = currentDividend * (1 + g);
    // P0 = D1 / (r - g)
    const value = nextDividend / (r - g);
    const marginOfSafety = ((value - currentPrice) / value) * 100;

    setResult({ value, nextDividend, marginOfSafety });
  };

  return (
    <Card title="Gordon Büyüme Modeli (Hisse Değerleme)">
      {error && <div className="mb-4 text-sm text-red-500 font-semibold bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</div>}
      
      <InputGroup label="Hissenin Güncel Piyasa Fiyatı" value={gordon.currentPrice} onChange={(e: any) => setGordon({ ...gordon, currentPrice: +e.target.value })} />
      <InputGroup label="Son Ödenen Temettü (Hisse Başına)" value={gordon.currentDividend} onChange={(e: any) => setGordon({ ...gordon, currentDividend: +e.target.value })} />
      <InputGroup label="Beklenen Temettü Büyüme Hızı (%) [g]" value={gordon.growthRate} onChange={(e: any) => setGordon({ ...gordon, growthRate: +e.target.value })} />
      <InputGroup label="İstenen Getiri / İskonto Oranı (%) [r]" value={gordon.discountRate} onChange={(e: any) => setGordon({ ...gordon, discountRate: +e.target.value })} />
      
      <div className="mb-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg font-mono">
        Formül: P0 = D1 / (r - g)<br/>
        P0: Hissenin Gerçek Değeri<br/>
        D1: Gelecek Yıl Beklenen Temettü<br/>
        r: İskonto Oranı, g: Büyüme Hızı
      </div>

      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Hisse Değerini Hesapla</button>
      
      {result && (
        <div className="mt-6">
          <ResultBox show={true} title="Hissenin Bulunması Gereken İçsel Değeri" value={formatCurrency(result.value)} note={`Gelecek yıl beklenen tahmini temettü: ${formatCurrency(result.nextDividend)}`} />
          
          <AIAnalysisDashboard 
            score={result.marginOfSafety > 20 ? 95 : result.marginOfSafety > 0 ? 75 : result.marginOfSafety > -10 ? 45 : 20}
            riskLevel={result.marginOfSafety > 15 ? 'Düşük' : result.marginOfSafety > -5 ? 'Orta' : 'Yüksek'}
            growthPotential={gordon.growthRate >= 10 ? 'Yüksek' : gordon.growthRate >= 5 ? 'Orta' : 'Düşük'}
            inflationImpact={gordon.growthRate > 5 ? 'Pozitif' : 'Negatif'}
            longTermView={
              result.marginOfSafety > 15 
                ? "Gordon Büyüme Modeli'ne göre hisse şu anda piyasada ucuz fiyatlanıyor. Yüksek güvenlik marjı, uzun vadeli ve temettü odaklı yatırımcılar için büyük bir fırsat sunuyor."
                : result.marginOfSafety > -5
                ? "Hisse senedi şu anki fiyatıyla yaklaşık olarak adil değerinde (fair value) işlem görüyor. Büyüme hızındaki ufak değişiklikler risk profilini etkileyebilir. Piyasayı izlemeye devam edin."
                : "Hisse şu anda hesaplanan içsel değerinin üzerinde işlem görüyor (Pahalı). Piyasa beklentileri yüksek veya aşırı alım bölgesinde olabilir. Uzun vadede düzeltme riski taşıyor."
            }
            pros={[
              `Beklenen büyüme hızı (%${gordon.growthRate}) temettü verimliliğini artırıyor.`,
              result.marginOfSafety > 0 ? `İçsel değer (${formatCurrency(result.value)}) güncel fiyattan yüksek, bu durum iskontolu bir fırsat yaratıyor.` : `Düzenli temettü ödemesi (${formatCurrency(gordon.currentDividend)}) nakit akışı sağlar.`
            ]}
            cons={[
              gordon.discountRate > 15 ? `İskonto oranının yüksek olması (%${gordon.discountRate}) makroekonomik risklerin fiyatlandığını gösteriyor.` : `Büyüme tahminleri piyasa dalgalanmalarına karşı hassastır.`,
              result.marginOfSafety <= 0 ? `Şu anki piyasa fiyatı (${formatCurrency(gordon.currentPrice)}) adil değerinin üzerinde, primli işlem görüyor.` : `Hisse senedi yatırımları genel piyasa riskine açıktır.`
            ]}
          />
        </div>
      )}
    </Card>
  );
}
