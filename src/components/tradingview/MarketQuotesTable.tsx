"use client";

import React, { useEffect, useRef } from "react";

export default function MarketQuotesTable() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Temizle
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;

    // Widget Ayarları
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "600",
      "symbolsGroups": [
        {
          "name": "Endeksler",
          "originalName": "Indices",
          "symbols": [
            { "name": "BIST:XU100", "displayName": "BIST 100" },
            { "name": "FOREXCOM:SPXUSD", "displayName": "S&P 500" },
            { "name": "FOREXCOM:NSXUSD", "displayName": "Nasdaq 100" },
            { "name": "FOREXCOM:DJI", "displayName": "Dow Jones" },
            { "name": "INDEX:DXY", "displayName": "Dolar Endeksi (DXY)" }
          ]
        },
        {
          "name": "Hisseler (BIST)",
          "symbols": [
            { "name": "BIST:THYAO", "displayName": "Türk Hava Yolları" },
            { "name": "BIST:TUPRS", "displayName": "Tüpraş" },
            { "name": "BIST:KCHOL", "displayName": "Koç Holding" },
            { "name": "BIST:AKBNK", "displayName": "Akbank" },
            { "name": "BIST:ISCTR", "displayName": "İş Bankası" },
            { "name": "BIST:EREGL", "displayName": "Erdemir" },
            { "name": "BIST:ASELS", "displayName": "Aselsan" },
            { "name": "BIST:SAHOL", "displayName": "Sabancı Holding" },
            { "name": "BIST:FROTO", "displayName": "Ford Otosan" }
          ]
        },
        {
          "name": "Global Hisseler",
          "symbols": [
            { "name": "NASDAQ:AAPL", "displayName": "Apple" },
            { "name": "NASDAQ:NVDA", "displayName": "NVIDIA" },
            { "name": "NASDAQ:MSFT", "displayName": "Microsoft" },
            { "name": "NASDAQ:TSLA", "displayName": "Tesla" },
            { "name": "NASDAQ:AMZN", "displayName": "Amazon" },
            { "name": "NASDAQ:META", "displayName": "Meta" }
          ]
        },
        {
          "name": "Emtia",
          "originalName": "Commodities",
          "symbols": [
            { "name": "OANDA:XAUUSD", "displayName": "Altın (Ons)" },
            { "name": "OANDA:XAGUSD", "displayName": "Gümüş (Ons)" },
            { "name": "TVC:USOIL", "displayName": "Ham Petrol (WTI)" },
            { "name": "TVC:UKOIL", "displayName": "Brent Petrol" }
          ]
        },
        {
          "name": "Kripto Paralar",
          "symbols": [
            { "name": "BINANCE:BTCUSDT", "displayName": "Bitcoin" },
            { "name": "BINANCE:ETHUSDT", "displayName": "Ethereum" },
            { "name": "BINANCE:BNBUSDT", "displayName": "BNB" },
            { "name": "BINANCE:SOLUSDT", "displayName": "Solana" },
            { "name": "BINANCE:XRPUSDT", "displayName": "XRP" },
            { "name": "BINANCE:AVAXUSDT", "displayName": "Avalanche" }
          ]
        },
        {
          "name": "Dövizler",
          "symbols": [
            { "name": "FX_IDC:USDTRY", "displayName": "USD/TRY" },
            { "name": "FX_IDC:EURTRY", "displayName": "EUR/TRY" },
            { "name": "FX_IDC:GBPTRY", "displayName": "GBP/TRY" },
            { "name": "FX:EURUSD", "displayName": "EUR/USD" }
          ]
        }
      ],
      "showSymbolLogo": true,
      "isTransparent": true,
      "colorTheme": "dark",
      "locale": "tr"
    });
    
    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div className="tradingview-widget-container w-full" ref={container}>
        <div className="tradingview-widget-container__widget w-full"></div>
      </div>
    </div>
  );
}
