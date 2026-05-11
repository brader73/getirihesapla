"use client";

import React, { useEffect, useState } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists() && userSnap.data().isPremium === true) {
            setIsPremium(true);
          } else {
            setIsPremium(false);
          }
        } catch (err) {
          console.error("Premium kontrol hatası:", err);
          setIsPremium(false);
        }
      } else {
        setIsPremium(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Giriş hatası:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Çıkış hatası:", error);
    }
  };

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setIsDark(root.classList.contains("dark"));
  };

  const generatePDF = async () => {
    setIsPdfLoading(true);
    try {
      const docPDF = new jsPDF("p", "mm", "a4");
      
      docPDF.setFontSize(22);
      docPDF.setTextColor(15, 23, 42); 
      docPDF.text("GetiriHesapla.com Stratejik Analiz Raporu", 105, 20, { align: "center" });
      
      docPDF.setFontSize(12);
      docPDF.setTextColor(100);
      docPDF.text("Oluşturma Tarihi: " + new Date().toLocaleString("tr-TR"), 105, 30, { align: "center" });
      
      const container = document.getElementById("pdf-export-area");
      if (!container) throw new Error("Export alanı bulunamadı");
      
      const canvas = await html2canvas(container, {
          scale: 1.5, 
          useCORS: true,
          backgroundColor: document.documentElement.classList.contains("dark") ? "#020617" : "#f1f5f9"
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      const imgWidth = 190; 
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 40; 
      
      docPDF.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);
      
      while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          docPDF.addPage();
          docPDF.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
      }
      
      docPDF.save("Stratejik_Analiz_Raporu.pdf");
    } catch (error) {
      console.error("PDF Hatası:", error);
      alert("PDF oluşturulurken bir hata meydana geldi.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="fixed top-10 right-4 flex items-center gap-4 z-50">
      <div className="flex items-center bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm min-h-[48px] transition-all">
        {!user ? (
          <button onClick={handleLogin} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google ile Giriş
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || '')}&background=0D8ABC&color=fff`} 
              alt="Profil" 
              className="w-8 h-8 rounded-full border-2 border-amber-600 object-cover"
            />
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.displayName || user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="text-[10px] text-left text-slate-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                Çıkış Yap
              </button>
            </div>
          </div>
        )}
      </div>

      {isPremium && (
        <button 
          onClick={generatePDF}
          disabled={isPdfLoading}
          className="bg-amber-600 text-white px-5 py-3 rounded-full font-semibold text-sm shadow-md hover:bg-amber-500 transition-colors disabled:opacity-70"
        >
          {isPdfLoading ? "Hazırlanıyor..." : "📄 Yatırım Raporu"}
        </button>
      )}

      {user && (
        <button className="bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-full border border-slate-700 font-semibold text-sm shadow-md hover:-translate-y-0.5 transition-transform">
          Portföy Kaydet
        </button>
      )}

      <button 
        onClick={toggleDarkMode}
        className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-5 py-3 rounded-full border border-slate-200 dark:border-slate-800 font-semibold text-sm shadow-md hover:border-amber-600 dark:hover:border-amber-600 transition-colors flex items-center justify-center min-h-[48px]"
      >
        {isDark ? "☀️ Mod" : "🌙 Mod"}
      </button>
    </div>
  );
}
