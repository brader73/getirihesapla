"use client";

import React, { useState } from "react";
import { Card, InputGroup, ResultBox, formatCurrency } from "./shared";

export default function MacroStressTest() {
  const [data, setData] = useState({
    mevcutBirikim: 100000,
    aylikEkleme: 5000,
    hedefSureYil: 10,
    senaryo: "denge"
  });
  
  const [result, setResult] = useState<{ realValue: number; note: string } | null>(null);

  const calculate = () => {
    let nominal = 0;
    let inflation = 0;
    let note = "";

    switch (data.senaryo) {
      case "ralli":
        nominal = 0.45; // %45 nominal getiri
        inflation = 0.15; // %15 enflasyon
        note = "İyimser piyasa koşullarında reel büyüme hızı çok yüksek, ancak bu dönemin kalıcı olmayabileceğini unutmayın. Fisher denklemine göre yüksek pozitif reel getiri varsayılmıştır.";
        break;
      case "denge":
        nominal = 0.35; // %35 nominal getiri
        inflation = 0.30; // %30 enflasyon
        note = "Gerçekçi beklentilerle birikimlerinizin alım gücü istikrarlı bir şekilde korunuyor ve makul seviyede büyüyor. Fisher denklemine göre piyasa ortalaması varsayılmıştır.";
        break;
      case "stagflasyon":
        nominal = 0.25; // %25 nominal getiri
        inflation = 0.50; // %50 enflasyon
        note = "Kriz senaryosunda birikimleriniz enflasyon karşısında erime riski taşıyor, portföy çeşitlendirmesi yapmalısınız. Fisher denklemine göre negatif reel getiri şoku varsayılmıştır.";
        break;
    }

    // Fisher Denklemi ile reel getiri hesabı
    const r = ((1 + nominal) / (1 + inflation)) - 1;
    const y = data.hedefSureYil;
    
    // Mevcut birikimin gelecekteki reel değeri
    const fvCurrent = data.mevcutBirikim * Math.pow(1 + r, y);
    
    // Aylık eklemelerin yıllıklandırılmış reel değeri (Yıl sonu yatırıldığı varsayımıyla basit anüite)
    const annualContribution = data.aylikEkleme * 12;
    let fvContributions = 0;
    
    if (r === 0) {
      fvContributions = annualContribution * y;
    } else {
      fvContributions = annualContribution * ((Math.pow(1 + r, y) - 1) / r);
    }
    
    const totalRealValue = fvCurrent + fvContributions;

    setResult({
      realValue: totalRealValue > 0 ? totalRealValue : 0, // Negatif çıkma ihtimaline karşı 0 alt sınırı
      note: note
    });
  };

  return (
    <Card title="Makro Ekonomik Stres Testi & Senaryo Analizi">
      <InputGroup 
        label="Mevcut Birikim (TL)" 
        value={data.mevcutBirikim} 
        onChange={(e: any) => setData({ ...data, mevcutBirikim: +e.target.value })} 
      />
      <InputGroup 
        label="Aylık Ekleme (TL)" 
        value={data.aylikEkleme} 
        onChange={(e: any) => setData({ ...data, aylikEkleme: +e.target.value })} 
      />
      <InputGroup 
        label="Hedef Süre (Yıl)" 
        value={data.hedefSureYil} 
        onChange={(e: any) => setData({ ...data, hedefSureYil: +e.target.value })} 
      />
      
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-sm text-slate-800 dark:text-slate-300">Ekonomik Senaryo</label>
        <select
          value={data.senaryo}
          onChange={(e: any) => setData({ ...data, senaryo: e.target.value })}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-amber-600 dark:focus:border-amber-600 transition-colors"
        >
          <option value="ralli" className="text-slate-900 dark:text-slate-900">Ralli / İyimser Dönem</option>
          <option value="denge" className="text-slate-900 dark:text-slate-900">Denge / Gerçekçi Beklenti</option>
          <option value="stagflasyon" className="text-slate-900 dark:text-slate-900">Stagflasyon / Kriz Senaryosu</option>
        </select>
      </div>

      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">
        Stres Testini Çalıştır
      </button>

      {result && (
        <ResultBox 
          show={true} 
          title="Vade Sonundaki Reel Alım Gücü" 
          value={formatCurrency(result.realValue)} 
          note={result.note} 
        />
      )}
    </Card>
  );
}
