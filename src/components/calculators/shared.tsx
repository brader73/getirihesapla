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

export const AIAnalysisDashboard = ({ score, riskLevel, growthPotential, inflationImpact, longTermView, pros, cons }: any) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    if (score >= 50) return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]';
    return 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]';
  };

  const MetricBox = ({ title, value, type, icon, className = "" }: any) => {
    const colors: any = {
      success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      danger: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    };
    return (
      <div className={`p-4 rounded-2xl border backdrop-blur-sm flex flex-col justify-between ${colors[type]} ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <span>{icon}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">{title}</span>
        </div>
        <div className="text-lg font-black tracking-tight">{value}</div>
      </div>
    );
  };

  return (
    <div className="mt-8 bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">Korfu AI Analizi</h3>
            <p className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mt-0.5">Algoritmik Yatırım Skoru</p>
          </div>
        </div>
        <div className="text-center">
          <div className={`text-4xl font-black tracking-tighter ${getScoreColor()}`}>
            {score}<span className="text-lg text-slate-500 font-bold opacity-50">/100</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 relative z-10">
        <MetricBox title="Risk Seviyesi" value={riskLevel} type={riskLevel === 'Yüksek' ? 'danger' : riskLevel === 'Orta' ? 'warning' : 'success'} icon="⚡" />
        <MetricBox title="Büyüme Pot." value={growthPotential} type={growthPotential === 'Yüksek' ? 'success' : growthPotential === 'Orta' ? 'warning' : 'danger'} icon="🚀" />
        <MetricBox title="Enflasyon Etkisi" value={inflationImpact} type={inflationImpact === 'Negatif' ? 'danger' : inflationImpact === 'Nötr' ? 'warning' : 'success'} icon="🛡️" className="col-span-2 md:col-span-1" />
      </div>

      {/* Long Term View */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-6 relative z-10 hover:bg-slate-800/60 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-500 text-lg">🔭</span>
          <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">Uzun Vadeli Görünüm</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          {longTermView}
        </p>
      </div>

      {/* Pros & Cons Grid */}
      <div className="grid md:grid-cols-2 gap-4 relative z-10">
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-5 hover:bg-emerald-950/30 transition-colors">
          <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> Olumlu Sinyaller
          </div>
          <ul className="space-y-3">
            {pros.map((p: string, i: number) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-3 font-medium">
                <span className="text-emerald-500 mt-0.5">✓</span> <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-5 hover:bg-rose-950/30 transition-colors">
          <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></span> Risk & Zayıflıklar
          </div>
          <ul className="space-y-3">
            {cons.map((c: string, i: number) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-3 font-medium">
                <span className="text-rose-500 mt-0.5">✕</span> <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
