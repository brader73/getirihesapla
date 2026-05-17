"use client";

import React, { useState, useEffect, useMemo } from 'react';

// Types
type Category = "Tümü" | "Ekonomi" | "Borsa" | "Kripto" | "Makro" | "Merkez Bankası" | "Şirketler" | "Kaydedilenler";
type Sentiment = "Pozitif" | "Negatif" | "Nötr";
type RiskLevel = "Düşük" | "Orta" | "Yüksek";

interface AINews {
  id: string;
  title: string;
  source: string;
  time: string;
  category: Category;
  isBreaking: boolean;
  content: string;
  aiAnalysis: {
    summary: string;
    sentiment: Sentiment;
    impactScore: number; // 1-10
    riskLevel: RiskLevel;
    relatedAssets: string[];
    marketImpact: string;
  };
}

// Mock Database
const MOCK_NEWS: AINews[] = [
  {
    id: "1",
    title: "FED Başkanı Powell'dan Sürpriz Güvercin Açıklama",
    source: "Bloomberg / Korfu Terminal",
    time: "2 Dk Önce",
    category: "Merkez Bankası",
    isBreaking: true,
    content: "Amerika Merkez Bankası (FED) Başkanı Jerome Powell, enflasyon verilerindeki beklenmedik düşüşün ardından önümüzdeki toplantıda faiz artırımlarına ara verilebileceğinin sinyalini verdi. Powell, 'Para politikasında bekle-gör stratejisine geçmek için elimizde yeterli veri birikti' dedi.",
    aiAnalysis: {
      summary: "FED'in faiz artırımını durduracağı sinyali verildi. Güvercin bir ton hakim.",
      sentiment: "Pozitif",
      impactScore: 9,
      riskLevel: "Düşük",
      relatedAssets: ["DXY", "ONS ALTIN", "S&P 500", "BTC"],
      marketImpact: "FED'in faizleri sabit tutma veya indirme ihtimali DXY'yi zayıflatırken, Ons Altın ve Kripto paralar gibi riskli varlıklar üzerinde güçlü bir ralli tetikleyebilir."
    }
  },
  {
    id: "2",
    title: "TCMB Rezervlerinde Rekor Artış Gözlemlendi",
    source: "Reuters / Korfu Analytics",
    time: "15 Dk Önce",
    category: "Makro",
    isBreaking: false,
    content: "Türkiye Cumhuriyet Merkez Bankası (TCMB) brüt döviz rezervleri geçen hafta 3.2 milyar dolar artarak tüm zamanların en yüksek seviyesine ulaştı. Yabancı sıcak para girişlerindeki artışın bu durumda etkili olduğu belirtiliyor.",
    aiAnalysis: {
      summary: "TCMB rezervleri rekor seviyeye ulaştı. Yabancı girişleri hızlandı.",
      sentiment: "Pozitif",
      impactScore: 6,
      riskLevel: "Orta",
      relatedAssets: ["USD/TRY", "BIST100"],
      marketImpact: "Rezervlerin güçlenmesi USD/TRY kurunda kısa vadeli stabilizasyonu destekler. BIST100'e yabancı girişinin devam etmesi bankacılık endeksini pozitif etkileyebilir."
    }
  },
  {
    id: "3",
    title: "Bitcoin 100.000 Dolar Barajını Zorluyor",
    source: "CoinDesk",
    time: "45 Dk Önce",
    category: "Kripto",
    isBreaking: true,
    content: "Kurumsal alımların hız kesmeden devam etmesi ve spot ETF'lere olan güçlü talep sebebiyle Bitcoin, tarihte ilk kez 100.000 dolar barajını aşmaya çok yaklaştı. Borsalardaki arz şoku devam ediyor.",
    aiAnalysis: {
      summary: "Kurumsal talep ve arz şoku nedeniyle BTC rekor seviyelerde.",
      sentiment: "Pozitif",
      impactScore: 8,
      riskLevel: "Yüksek",
      relatedAssets: ["BTC/USD", "ETH", "MSTR"],
      marketImpact: "BTC'nin psikolojik direnci kırması tüm kripto piyasasında (altcoinler dahil) agresif bir yükseliş başlatabilir, ancak dirençten dönerse kısa vadeli düzeltme riski masada."
    }
  },
  {
    id: "4",
    title: "Teknoloji Devinden Hayal Kırıklığı Yaratan Bilanço",
    source: "Financial Times",
    time: "1 Saat Önce",
    category: "Şirketler",
    isBreaking: false,
    content: "Küresel teknoloji çip üreticisi, son çeyrek beklentilerini karşılayamadı. Yapay zeka yatırımlarındaki devasa maliyetlerin kâr marjını daralttığı açıklandı. Hisse senedi vadeli işlemlerde %5 değer kaybetti.",
    aiAnalysis: {
      summary: "Çip üreticisinin bilançosu zayıf geldi, hisseler düşüşte.",
      sentiment: "Negatif",
      impactScore: 7,
      riskLevel: "Yüksek",
      relatedAssets: ["NASDAQ", "NVDA", "AAPL"],
      marketImpact: "Bilanço hayal kırıklığı, teknoloji sektörü hisseleri genelinde kısa süreli bir satış baskısı (kâr realizasyonu) yaratabilir."
    }
  },
  {
    id: "5",
    title: "OPEC+ Üretim Kesintilerini Uzatma Kararı Aldı",
    source: "Bloomberg",
    time: "3 Saat Önce",
    category: "Ekonomi",
    isBreaking: false,
    content: "OPEC+ ülkeleri, küresel talebin yavaşlayacağı endişesiyle petrol üretim kesintilerini yıl sonuna kadar uzatma kararı aldı. Karar sonrası Brent petrol fiyatları tırmanışa geçti.",
    aiAnalysis: {
      summary: "OPEC+ üretimi kısıyor, petrol fiyatları destekleniyor.",
      sentiment: "Nötr",
      impactScore: 5,
      riskLevel: "Orta",
      relatedAssets: ["BRENT", "USO", "TUPRS"],
      marketImpact: "Enerji maliyetlerindeki artış, küresel enflasyonun düşüş hızını yavaşlatabilir. Ancak enerji şirketleri (örn. Tüpraş) için pozitif nakit akışı anlamına gelir."
    }
  }
];

export default function AINewsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<AINews[]>(MOCK_NEWS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const categories: Category[] = ["Tümü", "Ekonomi", "Borsa", "Kripto", "Makro", "Merkez Bankası", "Şirketler"];

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesCategory = activeCategory === "Tümü" || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, activeCategory, searchQuery]);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const breakingNews = useMemo(() => news.find(n => n.isBreaking), [news]);

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-[#020617] font-sans pb-20">
      
      {/* Top Banner for Breaking News */}
      {breakingNews && (
        <div className="bg-red-600/90 text-white px-4 py-2 flex items-center justify-between shadow-lg relative z-10 border-b border-red-500 cursor-pointer hover:bg-red-500 transition-colors" onClick={() => setExpandedId(expandedId === breakingNews.id ? null : breakingNews.id)}>
          <div className="flex items-center gap-3 container mx-auto">
             <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-200"></span>
            </span>
            <span className="font-bold uppercase tracking-wider text-xs bg-black/20 px-2 py-0.5 rounded">Sıcak Gelişme</span>
            <span className="text-sm font-medium truncate">{breakingNews.title}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-white flex items-center gap-3">
                <span className="text-indigo-500 text-5xl">⚡</span>
                AI Haber Merkezi
              </h1>
              <p className="text-slate-400 mt-2 text-sm max-w-xl">
                Sadece haberi okumayın. Yapay zeka motorumuzun piyasa etkisini, risk seviyesini ve ilgili varlıkları sizin için analiz etmesine izin verin.
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Haber veya hisse ara..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </header>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 border-b border-slate-800">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
                activeCategory === cat 
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
          <button 
            onClick={() => setActiveCategory("Kaydedilenler" as any)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ml-auto flex items-center gap-2 ${
              activeCategory === "Kaydedilenler" ? "bg-amber-600 text-white" : "bg-slate-900 text-amber-500 border border-slate-800"
            }`}
          >
            🔖 Kaydedilenler ({bookmarks.length})
          </button>
        </div>

        {/* News Feed */}
        <div className="space-y-6">
          {(activeCategory === "Kaydedilenler" ? news.filter(n => bookmarks.includes(n.id)) : filteredNews).length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 text-slate-500">
              Bulunamadı. Farklı bir arama yapmayı deneyin.
            </div>
          ) : (
            (activeCategory === "Kaydedilenler" ? news.filter(n => bookmarks.includes(n.id)) : filteredNews).map((item) => {
              const isExpanded = expandedId === item.id;
              const sentimentColor = item.aiAnalysis.sentiment === 'Pozitif' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : item.aiAnalysis.sentiment === 'Negatif' ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-slate-300 border-slate-500/20 bg-slate-500/10';
              const riskColor = item.aiAnalysis.riskLevel === 'Yüksek' ? 'text-red-400' : item.aiAnalysis.riskLevel === 'Orta' ? 'text-amber-400' : 'text-emerald-400';

              return (
                <article 
                  key={item.id} 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className={`bg-slate-900/80 backdrop-blur-xl border ${isExpanded ? 'border-indigo-500/50 shadow-[0_10px_30px_rgba(79,70,229,0.1)]' : 'border-slate-800 hover:border-slate-700'} rounded-3xl overflow-hidden transition-all cursor-pointer group`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          🕒 {item.time}
                        </span>
                        <span className="text-xs text-slate-600 hidden md:inline-block">
                          • {item.source}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => toggleBookmark(e, item.id)}
                        className={`text-xl transition-transform hover:scale-110 ${bookmarks.includes(item.id) ? 'text-amber-500' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        {bookmarks.includes(item.id) ? '🔖' : '📌'}
                      </button>
                    </div>

                    <h2 className={`text-xl md:text-2xl font-bold text-white mb-2 leading-snug group-hover:text-indigo-400 transition-colors ${item.isBreaking ? 'text-red-100' : ''}`}>
                      {item.title}
                    </h2>
                    
                    {!isExpanded && (
                      <p className="text-slate-400 text-sm line-clamp-2 mt-2">
                        {item.content}
                      </p>
                    )}

                    {/* AI Impact Preview Mini Bar */}
                    {!isExpanded && (
                       <div className="mt-4 flex items-center gap-4 text-xs font-medium border-t border-slate-800/50 pt-4">
                          <span className={`px-2 py-1 rounded border ${sentimentColor}`}>
                            {item.aiAnalysis.sentiment} Etki
                          </span>
                          <span className="text-slate-500 flex items-center gap-1">
                            🤖 AI Analizi için tıklayın
                          </span>
                       </div>
                    )}
                  </div>

                  {/* Expanded AI Analysis Section */}
                  {isExpanded && (
                    <div className="bg-slate-950/80 p-6 border-t border-slate-800 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-slate-300 text-sm leading-relaxed mb-8">
                        {item.content}
                      </p>
                      
                      <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mt-10 -mr-10"></div>
                        
                        <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
                          <span>🧠</span> Korfu AI Analizi
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Piyasa Duyarlılığı</span>
                            <span className={`font-bold ${sentimentColor} px-2 py-0.5 rounded text-sm`}>{item.aiAnalysis.sentiment}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Risk Seviyesi</span>
                            <span className={`font-bold ${riskColor} text-sm`}>{item.aiAnalysis.riskLevel} Risk</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Etki Şiddeti (1-10)</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{item.aiAnalysis.impactScore}/10</span>
                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.aiAnalysis.impactScore * 10}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">Etkilenecek Varlıklar</span>
                          <div className="flex flex-wrap gap-2">
                            {item.aiAnalysis.relatedAssets.map(asset => (
                              <span key={asset} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded shadow-sm hover:border-indigo-500 cursor-pointer transition-colors">
                                {asset}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                           <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">Gelecek Projeksiyonu</span>
                           <p className="text-sm text-slate-200 leading-relaxed">
                             {item.aiAnalysis.marketImpact}
                           </p>
                        </div>

                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
