import Header from "@/components/layout/Header";
import MarketTicker from "@/components/MarketTicker";
import MarketDashboard from "@/components/MarketDashboard";
import CalculatorGrid from "@/components/calculators/CalculatorGrid";

export default function Home() {
  return (
    <>
      {/* Kayan Fiyat Bandı */}
      <MarketTicker />
      
      {/* Üst Menü, Auth ve PDF */}
      <Header />

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-12 text-center mt-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            GetiriHesapla<span className="text-amber-600">.com</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Profesyonel Finansal Hesaplama ve Yatırım Analiz Terminali
          </p>
        </div>

        {/* Canlı Piyasalar (Chart.js + WebSockets) */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-amber-600 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
            Canlı Piyasalar
          </h2>
          <MarketDashboard />
        </section>

        {/* Hesaplama Araçları */}
        <section id="pdf-export-area" className="pb-10">
          <h2 className="text-2xl font-serif font-bold text-amber-600 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
            Hesaplama Araçları
          </h2>
          <CalculatorGrid />
        </section>
      </main>

      <footer className="text-center py-8 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800">
        <p>Bu platform eğitim amaçlıdır. Yatırım tavsiyesi değildir.<br/>Veriler kullanıcı girişlerine dayalı yaklaşık hesaplamalar üretir.</p>
      </footer>
    </>
  );
}
