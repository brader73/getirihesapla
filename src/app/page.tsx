import TVChart from "@/components/tradingview/TVChart";
import TVMarketOverview from "@/components/tradingview/TVMarketOverview";
import CalculatorGrid from "@/components/calculators/CalculatorGrid";

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="mb-10 text-left">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Piyasa Özeti
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Güncel piyasa verileri ve gelişmiş analiz araçları.
          </p>
        </div>

        {/* Gelişmiş Grafik (TradingView Advanced Chart) */}
        <section className="mb-12">
          <TVChart />
        </section>

        {/* Canlı Piyasalar (TradingView Market Overview) */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-bold text-amber-600 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            Canlı Piyasalar
          </h2>
          <TVMarketOverview />
        </section>

        {/* Hesaplama Araçları */}
        <section id="pdf-export-area" className="pb-10">
          <h2 className="text-xl font-serif font-bold text-amber-600 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            Hesaplama Araçları
          </h2>
          <CalculatorGrid />
        </section>
      </div>

      <footer className="text-center py-6 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
        <p>Bu platform eğitim amaçlıdır. Yatırım tavsiyesi değildir.<br/>Veriler kullanıcı girişlerine dayalı yaklaşık hesaplamalar üretir.</p>
      </footer>
    </>
  );
}
