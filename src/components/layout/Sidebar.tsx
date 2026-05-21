"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "@/context/MobileMenuContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useMobileMenu();

  const menuItems = [
    { name: "Piyasa Özeti", path: "/", icon: "📊" },
    { name: "Makro Ekonomi", path: "/macro", icon: "🌍" },
    { name: "AI Haber Merkezi", path: "/haberler", icon: "📰" },
    { name: "Fiyat Alarmları", path: "/alerts", icon: "🔔" },
    { name: "Hesaplama Araçları", path: "/#pdf-export-area", icon: "🧮" },
    { name: "Portföy Simülasyonu", path: "/portfoy-simulasyonu", icon: "🔮" },
    { name: "Blog & Analiz", path: "/blog", icon: "📰" },
    { name: "Portföyüm", path: "/portfolio", icon: "💼" },
    { name: "Ayarlar", path: "/settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside className={`w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-[46px] md:top-0 overflow-y-auto border-r border-slate-800 z-50 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/korfu_logo_transparent.svg" alt="KorfuFinance Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide leading-tight">
              KorfuFinance
            </h1>
            <p className="text-[10px] text-amber-500 font-semibold tracking-widest uppercase mt-1">Profesyonel Analiz</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Menüyü Kapat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path));
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-amber-600/10 text-amber-500 font-semibold border border-amber-600/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-2 font-medium">Hesap Durumu</p>
          <Link href="/premium" className="block w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-sm font-bold py-2.5 rounded-lg transition-all text-center shadow-[0_0_15px_rgba(217,119,6,0.2)]">
            Premium'a Yükselt
          </Link>
        </div>
      </div>
    </aside>
    </>
  );
}
