"use client";

import React, { useState, useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  currency: string;
}

const USD_TRY_RATE = 32.50; // Basit kura çevrim için varsayılan kur

export default function PortfolioPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  
  const [portfolio, setPortfolio] = useState<Asset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    type: "Hisse (BIST)",
    amount: "",
    avgPrice: "",
    currentPrice: "",
    currency: "TRY"
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Listener
  useEffect(() => {
    if (!user) {
      setPortfolio([]);
      return;
    }

    const q = query(collection(db, "users", user.uid, "portfolio"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const assets: Asset[] = [];
      snapshot.forEach((doc) => {
        assets.push({ id: doc.id, ...doc.data() } as Asset);
      });
      setPortfolio(assets);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setSubmitting(true);
      await addDoc(collection(db, "users", user.uid, "portfolio"), {
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        type: formData.type,
        amount: Number(formData.amount),
        avgPrice: Number(formData.avgPrice),
        currentPrice: Number(formData.currentPrice),
        currency: formData.currency,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ symbol: "", name: "", type: "Hisse (BIST)", amount: "", avgPrice: "", currentPrice: "", currency: "TRY" });
    } catch (error) {
      console.error("Varlık eklenirken hata oluştu:", error);
      alert("Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!user) return;
    const confirmDelete = window.confirm("Bu varlığı silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "portfolio", id));
    } catch (error) {
      console.error("Varlık silinirken hata oluştu:", error);
    }
  };

  const generatePDF = async () => {
    const element = pdfRef.current;
    if (!element) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save("KorfuFinance_Portfoy_Raporu.pdf");
    } catch (error) {
      console.error("PDF oluşturulurken hata:", error);
      alert("PDF oluşturulamadı.");
    } finally {
      setIsExporting(false);
    }
  };

  const calculateTotalValue = () => {
    let totalTRY = 0;
    portfolio.forEach(asset => {
      const value = asset.amount * asset.currentPrice;
      totalTRY += asset.currency === "USD" ? value * USD_TRY_RATE : value;
    });
    return totalTRY;
  };

  const calculateTotalProfit = () => {
    let totalProfitTRY = 0;
    portfolio.forEach(asset => {
      const profit = (asset.currentPrice - asset.avgPrice) * asset.amount;
      totalProfitTRY += asset.currency === "USD" ? profit * USD_TRY_RATE : profit;
    });
    return totalProfitTRY;
  };

  const totalValue = calculateTotalValue();
  const totalProfit = calculateTotalProfit();
  const totalCost = totalValue - totalProfit;
  const profitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const chartData = {
    labels: portfolio.map(a => a.symbol),
    datasets: [
      {
        data: portfolio.map(asset => {
          const value = asset.amount * asset.currentPrice;
          return asset.currency === "USD" ? value * USD_TRY_RATE : value;
        }),
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(14, 165, 233, 0.8)'
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)', 'rgba(16, 185, 129, 1)', 'rgba(59, 130, 246, 1)', 'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)', 'rgba(236, 72, 153, 1)', 'rgba(14, 165, 233, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { color: '#94a3b8', font: { family: 'sans-serif' } } }
    },
    cutout: '75%',
  };

  const formatCurrency = (val: number, currency = "TRY") => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(val);
  };

  if (loadingAuth) {
    return <div className="container mx-auto px-4 py-20 text-center text-slate-500">Yükleniyor...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-sm">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">Erişim Engellendi</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Portföy yönetimi sayfasına erişmek için Korfu Finance hesabınıza giriş yapmanız gerekmektedir.
          </p>
          <p className="text-sm font-semibold text-amber-600">Lütfen üst menüdeki butondan Google ile giriş yapın.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Portföy Yönetimi
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Varlıklarınızı tek bir merkezden izleyin ve analiz edin.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generatePDF}
            disabled={isExporting || portfolio.length === 0}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2.5 px-6 rounded-xl transition disabled:opacity-50"
          >
            {isExporting ? "Hazırlanıyor..." : "📥 PDF İndir"}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-lg shadow-amber-600/20"
          >
            + Varlık Ekle
          </button>
        </div>
      </div>

      {/* PDF Export Alanı Başlangıcı */}
      <div ref={pdfRef} className="bg-slate-50 dark:bg-slate-950 p-2 -mx-2 rounded-xl">

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Toplam Varlık Değeri</h3>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(totalValue)}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Toplam Kâr / Zarar</h3>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {totalProfit > 0 ? '+' : ''}{formatCurrency(totalProfit)}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Getiri Oranı</h3>
          <div className={`text-3xl font-bold ${profitPercentage >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {profitPercentage > 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Varlık Dağılımı ve Liste */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
            Varlık Dağılımı
          </h2>
          {portfolio.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500">Portföyünüz boş</div>
          ) : (
            <div className="flex-1 min-h-[300px] relative">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-[100px]">
                <div className="text-center">
                  <div className="text-xs text-slate-500">Büyüklük</div>
                  <div className="font-bold text-slate-800 dark:text-white">{portfolio.length} Varlık</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">
              Portföy Detayları
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 font-semibold">Sembol</th>
                  <th className="p-4 font-semibold">Tür</th>
                  <th className="p-4 font-semibold text-right">Miktar</th>
                  <th className="p-4 font-semibold text-right">Maliyet</th>
                  <th className="p-4 font-semibold text-right">Güncel</th>
                  <th className="p-4 font-semibold text-right">Kâr/Zarar</th>
                  <th className="p-4 font-semibold text-center">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {portfolio.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Henüz varlık eklenmemiş. Sağ üstten "Varlık Ekle" butonunu kullanın.
                    </td>
                  </tr>
                )}
                {portfolio.map(asset => {
                  const profit = (asset.currentPrice - asset.avgPrice) * asset.amount;
                  const profitPct = ((asset.currentPrice - asset.avgPrice) / asset.avgPrice) * 100;
                  const isProfit = profit >= 0;

                  return (
                    <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{asset.symbol}</div>
                        <div className="text-xs text-slate-500">{asset.name}</div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{asset.type}</td>
                      <td className="p-4 text-right font-medium text-slate-900 dark:text-white">{asset.amount}</td>
                      <td className="p-4 text-right text-slate-600 dark:text-slate-300">{formatCurrency(asset.avgPrice, asset.currency)}</td>
                      <td className="p-4 text-right font-medium text-slate-900 dark:text-white">{formatCurrency(asset.currentPrice, asset.currency)}</td>
                      <td className="p-4 text-right">
                        <div className={`font-bold ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isProfit ? '+' : ''}{formatCurrency(profit, asset.currency)}
                        </div>
                        <div className={`text-xs ${isProfit ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                          {isProfit ? '▲' : '▼'} {profitPct.toFixed(2)}%
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div> {/* PDF Export Alanı Bitişi */}

      {/* Varlık Ekle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Yeni Varlık Ekle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddAsset} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sembol (Örn: THYAO)</label>
                  <input required value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Döviz</label>
                  <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Şirket/Varlık Adı</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tür</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                  <option value="Hisse (BIST)">Hisse (BIST)</option>
                  <option value="Hisse (ABD)">Hisse (ABD)</option>
                  <option value="Kripto">Kripto</option>
                  <option value="Emtia">Emtia</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Miktar</label>
                  <input required type="number" step="any" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Maliyet</label>
                  <input required type="number" step="any" value={formData.avgPrice} onChange={e => setFormData({...formData, avgPrice: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Güncel</label>
                  <input required type="number" step="any" value={formData.currentPrice} onChange={e => setFormData({...formData, currentPrice: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
              </div>

              <button disabled={submitting} type="submit" className="w-full mt-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition">
                {submitting ? "Ekleniyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
