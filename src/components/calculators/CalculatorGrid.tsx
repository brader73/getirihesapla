"use client";

import React, { useState, useRef, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function formatCurrency(num: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(num);
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
    <h2 className="text-xl font-serif text-amber-600 mb-4 font-bold">{title}</h2>
    {children}
  </div>
);

const InputGroup = ({ label, value, onChange, type = "number" }: any) => (
  <div className="mb-4">
    <label className="block mb-2 font-semibold text-sm text-slate-800 dark:text-slate-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-amber-600 dark:focus:border-amber-600 transition-colors"
    />
  </div>
);

const ResultBox = ({ title, value, note, show }: any) => {
  if (!show) return null;
  return (
    <div className="mt-5 p-4 border-l-4 border-amber-600 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
      <div className="text-sm text-slate-600 dark:text-slate-400">{title}</div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</div>
      {note && <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 opacity-80">{note}</div>}
    </div>
  );
};

export default function CalculatorGrid() {
  // Faiz & Birikim State
  const [compound, setCompound] = useState({ capital: 10000, monthly: 1000, rate: 25, years: 10 });
  const [compoundResult, setCompoundResult] = useState<{ total: number; chartData: any } | null>(null);

  const calcCompound = () => {
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
    setCompoundResult({
      total,
      chartData: {
        labels,
        datasets: [{ label: "Portföy Büyümesi", data: values, borderColor: "#b45309", tension: 0.1 }],
      },
    });
  };

  // Kredi / Anüite State
  const [loan, setLoan] = useState({ amount: 250000, rate: 3, term: 36 });
  const [loanResult, setLoanResult] = useState<{ payment: number; total: number } | null>(null);

  const calcLoan = () => {
    const r = loan.rate / 100;
    const payment = loan.amount * (r * Math.pow(1 + r, loan.term)) / (Math.pow(1 + r, loan.term) - 1);
    setLoanResult({ payment, total: payment * loan.term });
  };

  // Gordon Model State
  const [gordon, setGordon] = useState({ dividend: 5, growth: 6, required: 12, marketPrice: 70 });
  const [gordonResult, setGordonResult] = useState<{ intrinsic: number; status: string } | null>(null);

  const calcGordon = () => {
    const g = gordon.growth / 100;
    const k = gordon.required / 100;
    if (k <= g) return alert("Beklenen getiri büyümeden büyük olmalıdır");
    const intrinsic = gordon.dividend / (k - g);
    let status = "Nötr";
    if (gordon.marketPrice < intrinsic * 0.8) status = "Potansiyel Ucuz";
    else if (gordon.marketPrice > intrinsic * 1.2) status = "Aşırı Değerli";
    setGordonResult({ intrinsic, status });
  };

  // Reel Getiri
  const [real, setReal] = useState({ nominal: 50, inflation: 40 });
  const [realResult, setRealResult] = useState<number | null>(null);
  
  const calcReal = () => {
    const r = ((1 + real.nominal / 100) / (1 + real.inflation / 100)) - 1;
    setRealResult(r * 100);
  };

  // BES
  const [bes, setBes] = useState({ monthly: 2000, rate: 30, years: 20 });
  const [besResult, setBesResult] = useState<number | null>(null);

  const calcBes = () => {
    const r = bes.rate / 100 / 12;
    const n = bes.years * 12;
    const state = bes.monthly * 0.30;
    const total = (bes.monthly + state) * ((Math.pow(1 + r, n) - 1) / r);
    setBesResult(total);
  };

  // Tahvil
  const [bond, setBond] = useState({ face: 1000, coupon: 10, yieldRate: 12 });
  const [bondResult, setBondResult] = useState<number | null>(null);

  const calcBond = () => {
    const c = bond.coupon / 100;
    const y = bond.yieldRate / 100;
    const price = (bond.face * c) * ((1 - Math.pow(1 + y, -5)) / y) + bond.face / Math.pow(1 + y, 5);
    setBondResult(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <Card title="Faiz & Birikim">
        <InputGroup label="Başlangıç Sermayesi" value={compound.capital} onChange={(e: any) => setCompound({ ...compound, capital: +e.target.value })} />
        <InputGroup label="Aylık Ekleme" value={compound.monthly} onChange={(e: any) => setCompound({ ...compound, monthly: +e.target.value })} />
        <InputGroup label="Yıllık Getiri Oranı (%)" value={compound.rate} onChange={(e: any) => setCompound({ ...compound, rate: +e.target.value })} />
        <InputGroup label="Yıl" value={compound.years} onChange={(e: any) => setCompound({ ...compound, years: +e.target.value })} />
        <button onClick={calcCompound} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Hesapla</button>
        <ResultBox show={!!compoundResult} title="Toplam Portföy" value={compoundResult ? formatCurrency(compoundResult.total) : ""} note="Bileşik faiz etkisi dahil edilmiştir." />
        {compoundResult && (
          <div className="mt-4 h-32">
            <Line data={compoundResult.chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        )}
      </Card>

      <Card title="Kredi / Anüite Hesaplama">
        <InputGroup label="Kredi Tutarı" value={loan.amount} onChange={(e: any) => setLoan({ ...loan, amount: +e.target.value })} />
        <InputGroup label="Aylık Faiz (%)" value={loan.rate} onChange={(e: any) => setLoan({ ...loan, rate: +e.target.value })} />
        <InputGroup label="Vade (Ay)" value={loan.term} onChange={(e: any) => setLoan({ ...loan, term: +e.target.value })} />
        <button onClick={calcLoan} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Ödeme Planı</button>
        <ResultBox show={!!loanResult} title="Aylık Taksit" value={loanResult ? formatCurrency(loanResult.payment) : ""} note={loanResult ? `Toplam geri ödeme: ${formatCurrency(loanResult.total)}` : ""} />
      </Card>

      <Card title="Gordon Hisse Değerleme">
        <InputGroup label="Beklenen Temettü" value={gordon.dividend} onChange={(e: any) => setGordon({ ...gordon, dividend: +e.target.value })} />
        <InputGroup label="Büyüme Oranı (%)" value={gordon.growth} onChange={(e: any) => setGordon({ ...gordon, growth: +e.target.value })} />
        <InputGroup label="Beklenen Getiri (%)" value={gordon.required} onChange={(e: any) => setGordon({ ...gordon, required: +e.target.value })} />
        <InputGroup label="Mevcut Piyasa Fiyatı" value={gordon.marketPrice} onChange={(e: any) => setGordon({ ...gordon, marketPrice: +e.target.value })} />
        <button onClick={calcGordon} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">İçsel Değer Hesapla</button>
        <ResultBox show={!!gordonResult} title="İçsel Hisse Değeri" value={gordonResult ? formatCurrency(gordonResult.intrinsic) : ""} note={gordonResult ? `Durum: ${gordonResult.status}` : ""} />
      </Card>

      <Card title="Reel Getiri Analizi">
        <InputGroup label="Nominal Getiri (%)" value={real.nominal} onChange={(e: any) => setReal({ ...real, nominal: +e.target.value })} />
        <InputGroup label="Enflasyon (%)" value={real.inflation} onChange={(e: any) => setReal({ ...real, inflation: +e.target.value })} />
        <button onClick={calcReal} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Reel Getiri</button>
        <ResultBox show={realResult !== null} title="Gerçek Kazanç" value={realResult !== null ? `%${realResult.toFixed(2)}` : ""} note="Fisher denklemi kullanılmıştır." />
      </Card>

      <Card title="BES Birikim Simülasyonu">
        <InputGroup label="Aylık Katkı" value={bes.monthly} onChange={(e: any) => setBes({ ...bes, monthly: +e.target.value })} />
        <InputGroup label="Yıllık Getiri (%)" value={bes.rate} onChange={(e: any) => setBes({ ...bes, rate: +e.target.value })} />
        <InputGroup label="Süre (Yıl)" value={bes.years} onChange={(e: any) => setBes({ ...bes, years: +e.target.value })} />
        <button onClick={calcBes} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">BES Hesapla</button>
        <ResultBox show={besResult !== null} title="Toplam BES Birikimi" value={besResult !== null ? formatCurrency(besResult) : ""} note="%30 devlet katkısı dahil yaklaşık hesaplama." />
      </Card>

      <Card title="Tahvil / Eurobond">
        <InputGroup label="Nominal Değer" value={bond.face} onChange={(e: any) => setBond({ ...bond, face: +e.target.value })} />
        <InputGroup label="Kupon Faizi (%)" value={bond.coupon} onChange={(e: any) => setBond({ ...bond, coupon: +e.target.value })} />
        <InputGroup label="Piyasa Faizi (%)" value={bond.yieldRate} onChange={(e: any) => setBond({ ...bond, yieldRate: +e.target.value })} />
        <button onClick={calcBond} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:opacity-90 transition">Tahvil Değerle</button>
        <ResultBox show={bondResult !== null} title="Tahvil Fiyatı" value={bondResult !== null ? formatCurrency(bondResult) : ""} note="5 yıllık kuponlu tahvil varsayılmıştır." />
      </Card>

    </div>
  );
}
