"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Piyasa", path: "/", icon: "📊" },
    { name: "Makro", path: "/macro", icon: "🌍" },
    { name: "Araçlar", path: "/#pdf-export-area", icon: "🧮" },
    { name: "Cüzdan", path: "/portfolio", icon: "💼" },
    { name: "Profil", path: "/settings", icon: "⚙️" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path));
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${isActive ? 'text-amber-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className="text-xl leading-none" style={{ filter: isActive ? 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))' : 'none' }}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
