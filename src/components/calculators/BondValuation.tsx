"use client";

import React, { useState } from "react";
import { Card, InputGroup, ResultBox, AIAnalysisDashboard, formatCurrency } from "./shared";
import { useSaveCalculation } from "@/lib/useSaveCalculation";

export default function BondValuation() {
  const [bond, setBond] = useState({ faceValue: 1000, couponRate: 5, marketRate: 6, years: 5 });
  const [result, setResult] = useState<{ value: number; totalCoupons: number; presentValueOfCoupons: number; presentValueOfFace: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { saveCalculation, isSaving, user } = useSaveCalculation();

  const calculate = () => {
    setError(null);
    if (bond.faceValue <= 0 || bond.years <= 0 || bond.marketRate <= 0) {
      setError("Lütfen geçerli değerler giriniz (Sıfırdan büyük).");
      setResult(null);
      return;
    }

    const { faceValue, couponRate, marketRate, years } = bond;
    const c = couponRate / 100;
    const r = marketRate / 100;

    const couponPayment = faceValue * c;
    
    // Kuponların bugünkü değeri
    const presentValueOfCoupons = couponPayment * ((1 - Math.pow(1 + r, -years)) / r);
    // Vade sonu anaparanın bugünkü değeri
    const presentValueOfFace = faceValue / Math.pow(1 + r, years);
    
    const value = presentValueOfCoupons + presentValueOfFace;

    setResult({ 
      value, 
      totalCoupons: couponPayment * years,
      presentValueOfCoupons,
      presentValueOfFace
    });
  };

  const handleSave = () => {
    if (result) {
      saveCalculation("Tahvil Değerleme", `Adil Değer: ${formatCurrency(result.value)}`);
    }
  };

  return (
    <Card title="Tahvil / Bono Değerleme">
      {error && <div className="mb-4 text-sm text-red-500 font-semibold bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</div>}
      
      <InputGroup label="Nominal Değer (Vade Sonu Ödenecek)" value={bond.faceValue} onChange={(e: any) => setBond({ ...bond, faceValue: +e.target.value })} />
      <InputGroup label="Yıllık Kupon Faizi (%)" value={bond.couponRate} onChange={(e: any) => setBond({ ...bond, couponRate: +e.target.value })} />
      <InputGroup label="Piyasa Faiz Oranı (İskonto) (%)" value={bond.marketRate} onChange={(e: any) => setBond({ ...bond, marketRate: +e.target.value })} />
      <InputGroup label="Kalan Vade (Yıl)" value={bond.years} onChange={(e: any) => setBond({ ...bond, years: +e.target.value })} />
      
      <div className="mb-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
        Tahvilin adil değeri, gelecekteki tüm kupon ödemelerinin ve vade sonu ana para ödemesinin bugünkü piyasa faiziyle (iskonto) bugüne çekilmiş halidir.
      </div>

      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition-all duration-300">Tahvil Değerini Hesapla</button>
      
      {result && (
        <div className="mt-6">
          <ResultBox 
            show={true} 
            title="Tahvilin Adil (İçsel) Değeri" 
            value={formatCurrency(result.value)} 
            note={result.value < bond.faceValue ? "Tahvil iskontolu (başlangıç değerinin altında) fiyatlanıyor." : "Tahvil primli (başlangıç değerinin üstünde) fiyatlanıyor."} 
            onSave={user ? handleSave : undefined}
            isSaving={isSaving}
          />
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Kuponların Bugünkü Değeri</div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-500">{formatCurrency(result.presentValueOfCoupons)}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Ana Paranın Bugünkü Değeri</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(result.presentValueOfFace)}</div>
            </div>
          </div>

          <AIAnalysisDashboard 
            score={bond.couponRate > bond.marketRate ? 85 : bond.couponRate === bond.marketRate ? 50 : 35}
            riskLevel={bond.years > 10 ? 'Yüksek' : bond.years > 3 ? 'Orta' : 'Düşük'}
            growthPotential='Sınırlı (Sabit Getirili)'
            inflationImpact={bond.marketRate < 15 ? 'Yüksek Risk' : 'Nötr'}
            longTermView={
              bond.couponRate > bond.marketRate
                ? "Tahvil piyasa faizlerinden daha yüksek getiri sunuyor, bu nedenle 'primli' fiyatlanıyor. Piyasada güvenli bir getiri limanı arayanlar için güçlü nakit akışı sağlar."
                : bond.couponRate < bond.marketRate
                ? "Tahvilin faizi piyasanın altında kaldığı için 'iskontolu' fiyatlanıyor. Kısa vadeli al-sat stratejilerinden ziyade, sadece vade sonunu bekleyecek defansif yatırımcılar için uygundur."
                : "Tahvil başa baş noktasında (Nominal = Adil Değer). Piyasa ile tam bir denge halinde."
            }
            pros={[
              "Tahvil yatırımları hisse senetlerine kıyasla anapara garantisi (temerrüt olmaması şartıyla) sunar.",
              `Düzenli periyodik kupon ödemeleri (Yıllık ${formatCurrency(bond.faceValue * (bond.couponRate / 100))}) nakit akışı yaratır.`
            ]}
            cons={[
              bond.years > 5 ? "Uzun vadeli tahviller enflasyon ve faiz artışı riskine karşı oldukça hassastır (Durasyon riski)." : "Kısa vade yeniden yatırım (reinvestment) riski taşır.",
              "Sabit getirili menkul kıymetler boğa piyasalarında hisse senetlerinin gerisinde kalır."
            ]}
          />
        </div>
      )}
    </Card>
  );
}
