"use client";

import React, { useState } from "react";
import { Card, InputGroup, ResultBox, formatCurrency } from "./shared";

export default function BesSimulation() {
  const [bes, setBes] = useState({ monthly: 2000, rate: 30, years: 20 });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const r = bes.rate / 100 / 12;
    const n = bes.years * 12;
    const state = bes.monthly * 0.30;
    const total = (bes.monthly + state) * ((Math.pow(1 + r, n) - 1) / r);
    setResult(total);
  };

  return (
    <Card title="BES Birikim Simülasyonu">
      <InputGroup label="Aylık Katkı" value={bes.monthly} onChange={(e: any) => setBes({ ...bes, monthly: +e.target.value })} />
      <InputGroup label="Yıllık Getiri (%)" value={bes.rate} onChange={(e: any) => setBes({ ...bes, rate: +e.target.value })} />
      <InputGroup label="Süre (Yıl)" value={bes.years} onChange={(e: any) => setBes({ ...bes, years: +e.target.value })} />
      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">BES Hesapla</button>
      <ResultBox show={result !== null} title="Toplam BES Birikimi" value={result !== null ? formatCurrency(result) : ""} note="%30 devlet katkısı dahil yaklaşık hesaplama." />
    </Card>
  );
}
