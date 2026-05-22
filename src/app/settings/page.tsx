"use client";

import React, { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currency, setCurrency] = useState("TRY");
  const [theme, setTheme] = useState("system");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    setCurrency(localStorage.getItem("defaultCurrency") || "TRY");
    setTheme(localStorage.getItem("theme") || "system");
    
    const handleThemeEvent = () => {
      setTheme(localStorage.getItem("theme") || "system");
    };
    window.addEventListener("themeChanged", handleThemeEvent);
    
    return () => {
      unsubscribe();
      window.removeEventListener("themeChanged", handleThemeEvent);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      await updateProfile(auth.currentUser!, { photoURL });
      setUser({ ...user, photoURL });
    } catch (error) {
      console.error("Fotoğraf yükleme hatası:", error);
      alert("Fotoğraf yüklenirken bir hata oluştu. Lütfen dosya boyutunu kontrol edin.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCurrency(val);
    localStorage.setItem("defaultCurrency", val);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTheme(val);
    localStorage.setItem("theme", val);
    
    const root = document.documentElement;
    if (val === "dark") {
      root.classList.add("dark");
    } else if (val === "light") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">Ayarlar</h1>
        <p className="text-slate-600 dark:text-slate-400">Hesap bilgilerinizi ve uygulama tercihlerinizi buradan yönetebilirsiniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-amber-500">👤</span> Profil Bilgileri
            </h2>
            
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {uploadingImage ? (
                      <div className="w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-amber-500"></div>
                      </div>
                    ) : user.photoURL ? (
                      <img src={user.photoURL} alt="Profil" className="w-16 h-16 rounded-full border-2 border-amber-500 object-cover group-hover:opacity-75 transition-opacity" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:opacity-75 transition-opacity border-2 border-transparent group-hover:border-amber-500">
                        🧑‍💼
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">Değiştir</span>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user.displayName || "Kullanıcı"}</h3>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Hesap ID</label>
                    <div className="text-sm font-mono text-slate-700 dark:text-slate-300 mt-1">{user.uid.substring(0, 10)}...</div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Durum</label>
                    <div className="text-sm text-emerald-600 font-bold mt-1">Aktif ✓</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 mb-4">Ayarları görüntülemek için giriş yapmalısınız.</p>
                <button onClick={() => router.push("/")} className="px-6 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition">
                  Giriş Yap
                </button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-amber-500">⚙️</span> Uygulama Tercihleri
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Varsayılan Para Birimi</div>
                  <div className="text-xs text-slate-500">Portföy ve hesaplamalar için kullanılacak döviz.</div>
                </div>
                <select 
                  value={currency} 
                  onChange={handleCurrencyChange} 
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Tema (Karanlık Mod)</div>
                  <div className="text-xs text-slate-500">Uygulama genelinde kullanılacak renk teması.</div>
                </div>
                <select 
                  value={theme} 
                  onChange={handleThemeChange} 
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-white font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="light">Açık</option>
                  <option value="dark">Koyu</option>
                  <option value="system">Otomatik</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">👑</div>
            <h2 className="text-xl font-bold mb-2">Abonelik Planı</h2>
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wider mb-4 border border-white/20">
              ÜCRETSİZ PLAN
            </div>
            
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li className="flex gap-2"><span>✓</span> Canlı Borsa Taraması</li>
              <li className="flex gap-2"><span>✓</span> Temel Portföy Takibi</li>
              <li className="flex gap-2 opacity-50"><span>✕</span> Limitsiz PDF Raporu</li>
              <li className="flex gap-2 opacity-50"><span>✕</span> Gelişmiş AI Analizi</li>
            </ul>

            <button className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition">
              Premium'a Yükselt
            </button>
          </div>

          {user && (
            <button 
              onClick={handleLogout}
              className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition"
            >
              Güvenli Çıkış Yap
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
