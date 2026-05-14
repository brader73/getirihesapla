"use client";

import React, { useState } from "react";
import { Card, InputGroup, ResultBox, formatCurrency } from "./shared";

export default function LoanCalculator() {
  const [loan, setLoan] = useState({ amount: 250000, rate: 3, term: 36 });
  const [result, setResult] = useState<{ payment: number; total: number } | null>(null);

  const calculate = () => {
    const r = loan.rate / 100;
    const payment = loan.amount * (r * Math.pow(1 + r, loan.term)) / (Math.pow(1 + r, loan.term) - 1);
    setResult({ payment, total: payment * loan.term });
  };

  return (
    <Card title="Kredi / Anüite Hesaplama">
      <InputGroup label="Kredi Tutarı" value={loan.amount} onChange={(e: any) => setLoan({ ...loan, amount: +e.target.value })} />
      <InputGroup label="Aylık Faiz (%)" value={loan.rate} onChange={(e: any) => setLoan({ ...loan, rate: +e.target.value })} />
      <InputGroup label="Vade (Ay)" value={loan.term} onChange={(e: any) => setLoan({ ...loan, term: +e.target.value })} />
      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Ödeme Planı</button>
      <ResultBox show={!!result} title="Aylık Taksit" value={result ? formatCurrency(result.payment) : ""} note={result ? `Toplam geri ödeme: ${formatCurrency(result.total)}` : ""} />
    </Card>
  );
}
