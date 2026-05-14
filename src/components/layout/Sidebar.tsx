"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Piyasa Özeti", path: "/", icon: "📊" },
    { name: "Hesaplama Araçları", path: "/#pdf-export-area", icon: "🧮" },
    { name: "Blog & Analiz", path: "/blog", icon: "📰" },
    { name: "Portföyüm", path: "/portfolio", icon: "💼" },
    { name: "Ayarlar", path: "/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto border-r border-slate-800 z-40 transition-transform duration-300 transform -translate-x-full md:translate-x-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
          Korfu<span className="text-amber-500">Finance</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Profesyonel Analiz</p>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path));
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
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
          <p className="text-xs text-slate-400 mb-2">Premium Sürüm</p>
          <button className="w-full bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
            Yükselt
          </button>
        </div>
      </div>
    </aside>
  );
}
