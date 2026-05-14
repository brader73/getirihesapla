"use client";

import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Card, InputGroup, ResultBox, formatCurrency } from "./shared";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LoanCalculator() {
  const [loan, setLoan] = useState({ amount: 250000, rate: 3.5, term: 36 });
  const [result, setResult] = useState<{ payment: number; total: number; totalInterest: number; chartData: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    setError(null);
    if (loan.amount <= 0 || loan.term <= 0 || loan.rate <= 0) {
      setError("Lütfen geçerli (sıfırdan büyük) değerler giriniz.");
      setResult(null);
      return;
    }

    const r = loan.rate / 100;
    const payment = loan.amount * (r * Math.pow(1 + r, loan.term)) / (Math.pow(1 + r, loan.term) - 1);
    const total = payment * loan.term;
    const totalInterest = total - loan.amount;

    setResult({
      payment,
      total,
      totalInterest,
      chartData: {
        labels: ["Ana Para", "Toplam Faiz"],
        datasets: [
          {
            data: [loan.amount, totalInterest],
            backgroundColor: ["#3b82f6", "#b45309"],
            borderColor: ["#2563eb", "#92400e"],
            borderWidth: 1,
          },
        ],
      },
    });
  };

  return (
    <Card title="Kredi / Anüite Hesaplama">
      {error && <div className="mb-4 text-sm text-red-500 font-semibold bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</div>}
      <InputGroup label="Kredi Tutarı (Ana Para)" value={loan.amount} onChange={(e: any) => setLoan({ ...loan, amount: +e.target.value })} />
      <InputGroup label="Aylık Faiz Oranı (%)" value={loan.rate} onChange={(e: any) => setLoan({ ...loan, rate: +e.target.value })} />
      <InputGroup label="Vade (Ay)" value={loan.term} onChange={(e: any) => setLoan({ ...loan, term: +e.target.value })} />
      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Ödeme Planını Hesapla</button>
      
      {result && (
        <div className="mt-6">
          <ResultBox show={true} title="Aylık Taksit Tutarınız" value={formatCurrency(result.payment)} note={`Vade boyunca ödenecek toplam tutar: ${formatCurrency(result.total)}`} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Toplam Ana Para</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(loan.amount)}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Toplam Faiz Yükü</div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-500">{formatCurrency(result.totalInterest)}</div>
            </div>
          </div>
          <div className="mt-6 flex justify-center h-48">
            <Pie data={result.chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }} />
          </div>
        </div>
      )}
    </Card>
  );
}
