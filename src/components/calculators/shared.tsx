import React from "react";

export function formatCurrency(num: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(num);
}

export const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
    <h2 className="text-xl font-serif text-amber-600 mb-4 font-bold">{title}</h2>
    {children}
  </div>
);

export const InputGroup = ({ label, value, onChange, type = "number" }: any) => (
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

export const ResultBox = ({ title, value, note, show }: any) => {
  if (!show) return null;
  return (
    <div className="mt-5 p-4 border-l-4 border-amber-600 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
      <div className="text-sm text-slate-600 dark:text-slate-400">{title}</div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</div>
      {note && <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 opacity-80">{note}</div>}
    </div>
  );
};
