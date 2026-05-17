"use client";

import React, { useState, useEffect, useRef } from "react";
import { SYMBOL_DATABASE, MarketSymbol } from "@/utils/symbols";

interface Props {
  fullHeight?: boolean;
}

export default function DynamicMarketPanel({ fullHeight = false }: Props) {
  const [activeSymbol, setActiveSymbol] = useState<MarketSymbol>(SYMBOL_DATABASE[0]); // Default THYAO
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MarketSymbol[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [watchlist, setWatchlist] = useState<MarketSymbol[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load Watchlist from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("korfu_watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error("Watchlist parse error", e);
      }
    } else {
      // Default Watchlist
      const defaultWatchlist = SYMBOL_DATABASE.filter(s => 
        ["BIST:THYAO", "BINANCE:BTCUSDT", "FX_IDC:USDTRY", "OANDA:XAUUSD"].includes(s.symbol)
      );
      setWatchlist(defaultWatchlist);
    }
  }, []);

  // Save Watchlist
  const toggleWatchlist = (symbol: MarketSymbol) => {
    let updated;
    if (watchlist.find(s => s.symbol === symbol.symbol)) {
      updated = watchlist.filter(s => s.symbol !== symbol.symbol);
    } else {
      updated = [...watchlist, symbol];
    }
    setWatchlist(updated);
    localStorage.setItem("korfu_watchlist", JSON.stringify(updated));
  };

  // Search Logic
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = SYMBOL_DATABASE.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8); // Max 8 sonuç
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mount TradingView Widget when activeSymbol changes
  useEffect(() => {
    setIsLoaded(false);

    // Temizle
    if (containerRef.current) {
      containerRef.current.innerHTML = '<div class="tradingview-widget-container__widget w-full h-full"></div>';
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": activeSymbol.symbol,
      "interval": "D",
      "timezone": "Europe/Istanbul",
      "theme": "dark",
      "style": "1",
      "locale": "tr",
      "enable_publishing": false,
      "backgroundColor": "rgba(2, 6, 23, 1)", 
      "gridColor": "rgba(30, 41, 59, 1)",
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "allow_symbol_change": false, // Arama işlemini kendi UI'ımızla yapıyoruz
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    script.onload = () => setIsLoaded(true);

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Yedek yükleme state'i temizliği
    const timeout = setTimeout(() => setIsLoaded(true), 2000);

    return () => clearTimeout(timeout);
  }, [activeSymbol]);


  return (
    <div className={`w-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${fullHeight ? 'h-[calc(100vh-140px)]' : 'h-[650px]'}`}>
      
      {/* Top Navigation & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-950 border-b border-slate-800 z-20">
        
        {/* Watchlist Tabs (Quick Select) */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {watchlist.map(asset => (
            <button 
              key={asset.symbol}
              onClick={() => setActiveSymbol(asset)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                activeSymbol.symbol === asset.symbol 
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              {asset.name}
            </button>
          ))}
          {watchlist.length === 0 && <span className="text-xs text-slate-500 italic px-2">Watchlist boş</span>}
        </div>

        {/* Global Search Component */}
        <div className="relative w-full md:w-80" ref={searchRef}>
          <div className="relative flex items-center">
            <svg className="w-5 h-5 absolute left-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
              placeholder="Hisse, Kripto, Döviz, Emtia Ara..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => {setSearchQuery(''); setShowSearch(false);}} className="absolute right-3 text-slate-500 hover:text-slate-300">
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearch && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              {searchResults.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto">
                  {searchResults.map(result => (
                    <li key={result.symbol}>
                      <button 
                        onClick={() => {
                          setActiveSymbol(result);
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-800/50 last:border-0 text-left"
                      >
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm">{result.name}</span>
                          <span className="text-slate-500 text-xs">{result.symbol} • {result.type.toUpperCase()}</span>
                        </div>
                        <div 
                          onClick={(e) => { e.stopPropagation(); toggleWatchlist(result); }}
                          className={`p-1.5 rounded-full hover:bg-slate-700 transition-colors ${watchlist.find(s => s.symbol === result.symbol) ? 'text-amber-400' : 'text-slate-600'}`}
                        >
                          {watchlist.find(s => s.symbol === result.symbol) ? '★' : '☆'}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-slate-500">Sonuç bulunamadı</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chart Status Banner */}
      <div className="flex justify-between items-center px-4 py-2 bg-indigo-950/30 border-b border-indigo-900/50 text-xs text-indigo-200">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Canlı Piyasa: <strong>{activeSymbol.name}</strong> ({activeSymbol.symbol})
        </div>
        <button 
          onClick={() => toggleWatchlist(activeSymbol)}
          className={`flex items-center gap-1 font-bold ${watchlist.find(s => s.symbol === activeSymbol.symbol) ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
        >
          {watchlist.find(s => s.symbol === activeSymbol.symbol) ? '★ Favorilerde' : '☆ Favoriye Ekle'}
        </button>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 relative w-full h-full bg-slate-950">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
             <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-400 font-semibold animate-pulse">{activeSymbol.name} Grafiği Yükleniyor...</p>
             <p className="text-slate-600 text-sm mt-1">Gelişmiş teknik analiz araçları hazırlanıyor</p>
          </div>
        )}
        
        <div className="tradingview-widget-container w-full h-full" ref={containerRef}>
          <div className="tradingview-widget-container__widget w-full h-full"></div>
        </div>
      </div>
      
    </div>
  );
}
