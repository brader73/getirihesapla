"use client";

import React, { useEffect, useRef, memo } from 'react';

function TVMarketOverview() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": true,
      "locale": "tr",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "width": "100%",
      "height": "600",
      "plotLineColorGrowing": "rgba(245, 158, 11, 1)", // amber-500
      "plotLineColorFalling": "rgba(245, 158, 11, 1)", // amber-500
      "gridLineColor": "rgba(42, 46, 57, 0)",
      "scaleFontColor": "rgba(209, 212, 220, 1)",
      "belowLineFillColorGrowing": "rgba(245, 158, 11, 0.12)",
      "belowLineFillColorFalling": "rgba(245, 158, 11, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(245, 158, 11, 0)",
      "belowLineFillColorFallingBottom": "rgba(245, 158, 11, 0)",
      "symbolActiveColor": "rgba(245, 158, 11, 0.12)",
      "tabs": [
        {
          "title": "Borsa İstanbul",
          "symbols": [
            { "s": "BIST:XU100", "d": "BIST 100" },
            { "s": "BIST:THYAO" },
            { "s": "BIST:TUPRS" },
            { "s": "BIST:KCHOL" },
            { "s": "BIST:AKBNK" },
            { "s": "BIST:ISCTR" },
            { "s": "BIST:EREGL" }
          ]
        },
        {
          "title": "Kripto",
          "symbols": [
            { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
            { "s": "BINANCE:ETHUSDT", "d": "Ethereum" },
            { "s": "BINANCE:BNBUSDT", "d": "BNB" },
            { "s": "BINANCE:SOLUSDT", "d": "Solana" },
            { "s": "BINANCE:XRPUSDT", "d": "Ripple" },
            { "s": "BINANCE:AVAXUSDT", "d": "Avalanche" }
          ]
        },
        {
          "title": "Döviz & Emtia",
          "symbols": [
            { "s": "FX_IDC:USDTRY", "d": "USD/TRY" },
            { "s": "FX_IDC:EURTRY", "d": "EUR/TRY" },
            { "s": "FX_IDC:EURUSD", "d": "EUR/USD" },
            { "s": "OANDA:XAUUSD", "d": "Altın (Ons)" },
            { "s": "OANDA:XAGUSD", "d": "Gümüş (Ons)" },
            { "s": "TVC:UKOIL", "d": "Brent Petrol" }
          ]
        },
        {
          "title": "Küresel",
          "symbols": [
            { "s": "FOREXCOM:SPXUSD", "d": "S&P 500" },
            { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" },
            { "s": "FOREXCOM:DJI", "d": "Dow Jones" },
            { "s": "INDEX:DAX", "d": "DAX" }
          ]
        }
      ]
    });

    container.current.appendChild(script);
  }, []);

  return (
    <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden min-h-[600px]">
      <div className="tradingview-widget-container w-full h-full" ref={container}>
        <div className="tradingview-widget-container__widget w-full h-full"></div>
      </div>
    </div>
  );
}

export default memo(TVMarketOverview);
