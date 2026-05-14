"use client";

import React, { useState } from "react";
import { Card, InputGroup, ResultBox, formatCurrency } from "./shared";

export default function GordonGrowth() {
  const [gordon, setGordon] = useState({ dividend: 5, growth: 6, required: 12, marketPrice: 70 });
  const [result, setResult] = useState<{ intrinsic: number; status: string } | null>(null);

  const calculate = () => {
    const g = gordon.growth / 100;
    const k = gordon.required / 100;
    if (k <= g) return alert("Beklenen getiri büyümeden büyük olmalıdır");
    const intrinsic = gordon.dividend / (k - g);
    let status = "Nötr";
    if (gordon.marketPrice < intrinsic * 0.8) status = "Potansiyel Ucuz";
    else if (gordon.marketPrice > intrinsic * 1.2) status = "Aşırı Değerli";
    setResult({ intrinsic, status });
  };

  return (
    <Card title="Gordon Hisse Değerleme">
      <InputGroup label="Beklenen Temettü" value={gordon.dividend} onChange={(e: any) => setGordon({ ...gordon, dividend: +e.target.value })} />
      <InputGroup label="Büyüme Oranı (%)" value={gordon.growth} onChange={(e: any) => setGordon({ ...gordon, growth: +e.target.value })} />
      <InputGroup label="Beklenen Getiri (%)" value={gordon.required} onChange={(e: any) => setGordon({ ...gordon, required: +e.target.value })} />
      <InputGroup label="Mevcut Piyasa Fiyatı" value={gordon.marketPrice} onChange={(e: any) => setGordon({ ...gordon, marketPrice: +e.target.value })} />
      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">İçsel Değer Hesapla</button>
      <ResultBox show={!!result} title="İçsel Hisse Değeri" value={result ? formatCurrency(result.intrinsic) : ""} note={result ? `Durum: ${result.status}` : ""} />
    </Card>
  );
}
