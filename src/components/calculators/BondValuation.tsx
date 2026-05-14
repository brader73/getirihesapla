"use client";

import React, { useState } from "react";
import { Card, InputGroup, ResultBox, formatCurrency } from "./shared";

export default function BondValuation() {
  const [bond, setBond] = useState({ face: 1000, coupon: 10, yieldRate: 12 });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const c = bond.coupon / 100;
    const y = bond.yieldRate / 100;
    const price = (bond.face * c) * ((1 - Math.pow(1 + y, -5)) / y) + bond.face / Math.pow(1 + y, 5);
    setResult(price);
  };

  return (
    <Card title="Tahvil / Eurobond">
      <InputGroup label="Nominal Değer" value={bond.face} onChange={(e: any) => setBond({ ...bond, face: +e.target.value })} />
      <InputGroup label="Kupon Faizi (%)" value={bond.coupon} onChange={(e: any) => setBond({ ...bond, coupon: +e.target.value })} />
      <InputGroup label="Piyasa Faizi (%)" value={bond.yieldRate} onChange={(e: any) => setBond({ ...bond, yieldRate: +e.target.value })} />
      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Tahvil Değerle</button>
      <ResultBox show={result !== null} title="Tahvil Fiyatı" value={result !== null ? formatCurrency(result) : ""} note="5 yıllık kuponlu tahvil varsayılmıştır." />
    </Card>
  );
}
