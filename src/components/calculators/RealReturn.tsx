"use client";

import React, { useState } from "react";
import { Card, InputGroup, ResultBox } from "./shared";

export default function RealReturn() {
  const [real, setReal] = useState({ nominal: 50, inflation: 40 });
  const [result, setResult] = useState<number | null>(null);
  
  const calculate = () => {
    const r = ((1 + real.nominal / 100) / (1 + real.inflation / 100)) - 1;
    setResult(r * 100);
  };

  return (
    <Card title="Reel Getiri Analizi">
      <InputGroup label="Nominal Getiri (%)" value={real.nominal} onChange={(e: any) => setReal({ ...real, nominal: +e.target.value })} />
      <InputGroup label="Enflasyon (%)" value={real.inflation} onChange={(e: any) => setReal({ ...real, inflation: +e.target.value })} />
      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Reel Getiri</button>
      <ResultBox show={result !== null} title="Gerçek Kazanç" value={result !== null ? `%${result.toFixed(2)}` : ""} note="Fisher denklemi kullanılmıştır." />
    </Card>
  );
}
