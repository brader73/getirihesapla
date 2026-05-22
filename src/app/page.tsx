import RealMarketOverview from "@/components/tradingview/RealMarketOverview";
import TVScreener from "@/components/tradingview/TVScreener";
import CalculatorGrid from "@/components/calculators/CalculatorGrid";
import HistoryPanel from "@/components/calculators/HistoryPanel";
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
          <div className="flex flex-col gap-10">
            <div className="w-full">
              <CalculatorGrid />
            </div>
            <div className="w-full">
              <HistoryPanel />
            </div>
          </div>
        </section>

        {/* Metodoloji & Vizyon */}
        <section className="mt-8 bg-slate-50 dark:bg-[#0f172a] border-t-2 border-amber-600/50 rounded-2xl p-8 lg:p-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Hakkımızda / Vizyon */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Metodoloji & Vizyon</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                <strong className="text-amber-600 dark:text-amber-500">KorfuFinance.com;</strong> finansal kararlarda sezgileri değil, rasyonel matematiği rehber edinen yatırımcılar için tasarlanmış bağımsız bir analiz platformudur. Amacımız, paranın zaman değerini ve piyasa risklerini herkes için şeffaf ve ölçülebilir kılmaktır.
              </p>
            </div>

            {/* Akademik Metodoloji */}
            <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-6 md:pt-0 md:pl-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Akademik Metodoloji</h3>
              <ul className="space-y-4">
                <li className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Gordon Büyüme Modeli (GGM)</strong>
                  Hisse senetlerinin içsel değerini, gelecekteki temettü akışlarının iskonto edilmiş bugünkü değeriyle hesaplar.
                </li>
                <li className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Fisher Denklemi</strong>
                  Nominal getirileri enflasyon şoklarından arındırarak net alım gücünü (Reel Getiri) ölçer.
                </li>
                <li className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Paranın Zaman Değeri (TVM) & Anüite</strong>
                  Gelecekteki düzenli nakit akışlarının (Ordinary Annuity / Annuity Due) bileşik getiri ve bugünkü değer simülasyonlarını matematiksel kesinlikle işletir.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <FooterWithModals />
    </>
  );
}
