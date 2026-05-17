import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import InvestmentSimulator from "@/components/calculators/InvestmentSimulator";

export const metadata: Metadata = {
  title: "Gelişmiş Portföy ve Yatırım Simülasyonu | Korfu Finance",
  description: "Enflasyon ve kur riskini hesaba katan, yapay zeka destekli yatırım simülasyon motoru. Gelecekteki servetinizi senaryolaştırın.",
  keywords: "yatırım simülasyonu, portföy hesaplama, enflasyondan korunma, reel getiri hesaplama, yapay zeka yatırım, korfu finance",
  alternates: {
    canonical: "https://www.korfufinance.com/portfoy-simulasyonu",
  },
};

export default function PortfoySimulasyonuPage() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Portföy Simülasyonu",
    "description": "Enflasyon ve kur riskini hesaba katan yatırım simülasyon motoru.",
    "url": "https://www.korfufinance.com/portfoy-simulasyonu",
  };

  return (
    <div className="bg-slate-50 dark:bg-[#020617] min-h-screen text-slate-900 dark:text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />

      <main className="container mx-auto px-4 md:px-8 py-10 max-w-7xl">
        
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="text-xs font-semibold text-slate-500 mb-8 uppercase tracking-widest flex items-center gap-2">
          <Link href="/" className="hover:text-indigo-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-indigo-400">Portföy Simülasyonu</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            AI Destekli Analiz
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            Gelişmiş Yatırım <span className="text-indigo-500">Simülasyonu</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Piyasadaki diğer hesaplayıcıların aksine Korfu Finance; sadece nominal (kağıt üstündeki) paranızı değil, enflasyon oranını düşerek <b>Reel Satın Alma Gücünüzü</b> ve dolar bazlı servetinizi hesaplar. Yapay zeka destekli senaryo motorumuzla hedeflerinizi test edin.
          </p>
        </header>

        {/* The Advanced Engine Component */}
        <div className="mb-20">
          <InvestmentSimulator />
        </div>

        {/* Bilgi ve Açıklama Blokları (SEO) */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl mb-6 border border-emerald-500/20 text-emerald-500">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Reel Getiri Nedir?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Hesabınızdaki para 1 milyon ₺'den 2 milyon ₺'ye çıkmış olabilir. Ancak aynı sürede fiyatlar da 2 katına çıktıysa aslında hiç para kazanmadınız. Bu motor, enflasyonu hesaba katarak gerçekte ne kadar zenginleştiğinizi gösterir.
            </p>
          </article>
          
          <article className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl mb-6 border border-amber-500/20 text-amber-500">
              💵
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Dolar Bazlı Büyüme</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Özellikle Türkiye gibi gelişmekte olan piyasalarda yatırımların global değerini ölçmek kritiktir. Simülasyon, belirlediğiniz yıllık kur artış beklentisine göre tahmini döviz sepeti değerinizi çıkartır.
            </p>
          </article>

          <article className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-2xl mb-6 border border-indigo-500/20 text-indigo-500">
              🎯
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Risk ve Olasılık Analizi</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kripto gibi yüksek riskli varlıklarda beklenen getiri yüksek olsa da, volatilite (dalgalanma) skoru sebebiyle hedefe ulaşma ihtimali düşebilir. AI motorumuz bu matematiksel olasılıkları analiz ederek size stratejik yorumlar sunar.
            </p>
          </article>
        </section>

      </main>
    </div>
  );
}
