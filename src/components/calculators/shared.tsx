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

export const AdvisorInsight = ({ type = 'info', message, riskLevel, metrics }: { type?: 'success' | 'warning' | 'danger' | 'info', message: string, riskLevel?: string, metrics?: {label: string, value: string}[] }) => {
  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/30',
    warning: 'bg-amber-500/10 border-amber-500/30',
    danger: 'bg-rose-500/10 border-rose-500/30',
    info: 'bg-blue-500/10 border-blue-500/30'
  };

  const icons = {
    success: '✨',
    warning: '⚠️',
    danger: '🚨',
    info: '💡'
  };

  return (
    <div className={`mt-6 p-5 rounded-2xl border backdrop-blur-md ${colors[type]} flex flex-col gap-3 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
      <div className="absolute -right-4 -top-4 opacity-5 text-6xl rotate-12">{icons[type]}</div>
      
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icons[type]}</span>
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">Korfu Akıllı Yorum</h3>
      </div>
      
      <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
        {message}
      </p>

      {(riskLevel || metrics) && (
        <div className="mt-2 flex flex-wrap gap-3">
          {riskLevel && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm border ${
              riskLevel === 'Düşük' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
              riskLevel === 'Yüksek' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30' :
              'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
            }`}>
              Risk Seviyesi: {riskLevel}
            </span>
          )}
          {metrics && metrics.map((m, i) => (
            <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm bg-slate-900/10 dark:bg-white/10 text-slate-800 dark:text-slate-300 border border-slate-900/10 dark:border-white/10">
              {m.label}: {m.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
