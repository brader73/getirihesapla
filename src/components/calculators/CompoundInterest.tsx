"use client";

import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Card, InputGroup, ResultBox, formatCurrency } from "./shared";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CompoundInterest() {
  const [compound, setCompound] = useState({ capital: 10000, monthly: 1000, rate: 25, years: 10 });
  const [result, setResult] = useState<{ total: number; chartData: any } | null>(null);

  const calculate = () => {
    const { capital, monthly, rate, years } = compound;
    const r = rate / 100 / 12;
    const n = years * 12;
    const total = capital * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);

    const labels = [];
    const values = [];
    for (let i = 1; i <= years; i++) {
      labels.push(i + "Y");
      values.push(capital * Math.pow(1 + r, i * 12) + monthly * ((Math.pow(1 + r, i * 12) - 1) / r));
    }
    setResult({
      total,
      chartData: {
        labels,
        datasets: [{ label: "Portföy Büyümesi", data: values, borderColor: "#b45309", tension: 0.1 }],
      },
    });
  };

  return (
    <Card title="Faiz & Birikim">
      <InputGroup label="Başlangıç Sermayesi" value={compound.capital} onChange={(e: any) => setCompound({ ...compound, capital: +e.target.value })} />
      <InputGroup label="Aylık Ekleme" value={compound.monthly} onChange={(e: any) => setCompound({ ...compound, monthly: +e.target.value })} />
      <InputGroup label="Yıllık Getiri Oranı (%)" value={compound.rate} onChange={(e: any) => setCompound({ ...compound, rate: +e.target.value })} />
      <InputGroup label="Yıl" value={compound.years} onChange={(e: any) => setCompound({ ...compound, years: +e.target.value })} />
      <button onClick={calculate} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Hesapla</button>
      <ResultBox show={!!result} title="Toplam Portföy" value={result ? formatCurrency(result.total) : ""} note="Bileşik faiz etkisi dahil edilmiştir." />
      {result && (
        <div className="mt-4 h-32">
          <Line data={result.chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        </div>
      )}
    </Card>
  );
}
