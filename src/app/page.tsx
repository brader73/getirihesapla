import RealMarketOverview from "@/components/tradingview/RealMarketOverview";
import TVScreener from "@/components/tradingview/TVScreener";
import CalculatorGrid from "@/components/calculators/CalculatorGrid";
import FooterWithModals from "@/components/layout/FooterWithModals";

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4 md:px-8 py-8">


        {/* Canlı Piyasalar (Gerçek Zamanlı) */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-bold text-amber-600 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            Öne Çıkan Piyasalar
          </h2>
          <RealMarketOverview />
        </section>

        {/* Evrensel Piyasa Tarayıcı (Screener) */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-xl font-serif font-bold text-amber-600">
              Piyasa Tarayıcısı (Gelişmiş Arama)
            </h2>
            <span className="text-sm text-slate-500">Dünyadaki tüm varlıkları filtreleyin ve arayın</span>
          </div>
          <TVScreener />
        </section>

        {/* Hesaplama Araçları */}
        <section id="pdf-export-area" className="pb-10">
          <h2 className="text-xl font-serif font-bold text-amber-600 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            Hesaplama Araçları
          </h2>
          <CalculatorGrid />
        </section>
      </div>

      <FooterWithModals />
    </>
  );
}
