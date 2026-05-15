"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export const ASSETS = [
  { id: "BTCUSDT", name: "Bitcoin", type: "crypto", symbol: "BTCUSDT" },
  { id: "ETHUSDT", name: "Ethereum", type: "crypto", symbol: "ETHUSDT" },
  { id: "XU100", name: "BIST 100", type: "yahoo", symbol: "XU100.IS" },
  { id: "THYAO", name: "Türk Hava Yolları", type: "yahoo", symbol: "THYAO.IS" },
  { id: "TUPRS", name: "Tüpraş", type: "yahoo", symbol: "TUPRS.IS" },
  { id: "KCHOL", name: "Koç Holding", type: "yahoo", symbol: "KCHOL.IS" },
  { id: "AKBNK", name: "Akbank", type: "yahoo", symbol: "AKBNK.IS" },
  { id: "ISCTR", name: "İş Bankası", type: "yahoo", symbol: "ISCTR.IS" },
  { id: "EREGL", name: "Erdemir", type: "yahoo", symbol: "EREGL.IS" },
  { id: "USDTRY", name: "USD/TRY", type: "crypto", symbol: "USDTTRY" },
  { id: "GOLD", name: "Altın (Ons)", type: "yahoo", symbol: "GC=F" },
];

export interface MarketData {
  price: number;
  change: number;
  history: number[];
  labels: string[];
}

interface MarketContextType {
  dataMap: Record<string, MarketData>;
}

const MarketContext = createContext<MarketContextType>({ dataMap: {} });

export const useMarketData = () => useContext(MarketContext);

export const MarketProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataMap, setDataMap] = useState<Record<string, MarketData>>({});

  useEffect(() => {
    let wsBinance: WebSocket | null = null;
    let isMounted = true;

    async function fetchYahooData(symbol: string) {
      try {
        const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=5m`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        const res = await fetch(proxyUrl);
        const data = await res.json();

        const result = data.chart.result[0];
        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose;
        const change = ((currentPrice - prevClose) / prevClose) * 100;

        const prices = result.indicators.quote[0].close.filter((p: number | null) => p !== null);
        const labels = prices.map((_: any, i: number) => i.toString());

        return { price: currentPrice, change, history: prices, labels };
      } catch (error) {
        console.error("Yahoo fetch error:", error);
        return null;
      }
    }

    async function fetchInitialCrypto(symbol: string) {
      try {
        const tickerRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const tickerData = await tickerRes.json();

        const klineRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`);
        const klineData = await klineRes.json();

        const prices = klineData.map((d: any[]) => parseFloat(d[4]));
        const labels = klineData.map((_: any, i: number) => i.toString());

        return {
          price: parseFloat(tickerData.lastPrice),
          change: parseFloat(tickerData.priceChangePercent),
          history: prices,
          labels,
        };
      } catch (error) {
        console.error("Crypto fetch error:", error);
        return null;
      }
    }

    async function fetchAll() {
      const initialMap: Record<string, MarketData> = {};
      for (const asset of ASSETS) {
        let res;
        if (asset.type === "crypto") res = await fetchInitialCrypto(asset.symbol);
        if (asset.type === "yahoo") res = await fetchYahooData(asset.symbol);
        if (res) initialMap[asset.id] = res;
      }
      if (isMounted) {
        setDataMap(initialMap);
      }
    }

    fetchAll().then(() => {
      const streams = ASSETS.filter((a) => a.type === "crypto")
        .map((a) => a.symbol.toLowerCase() + "@ticker")
        .join("/");
        
      if (streams) {
        wsBinance = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);
        wsBinance.onmessage = (event) => {
          if (!isMounted) return;
          const message = JSON.parse(event.data);
          const symbol = message.s;
          const asset = ASSETS.find((a) => a.symbol === symbol);
          if (asset) {
            setDataMap((prev) => {
              const prevData = prev[asset.id];
              if (!prevData) return prev;
              const currentPrice = parseFloat(message.c);
              const history = [...prevData.history];
              if (history.length > 0) history[history.length - 1] = currentPrice;

              return {
                ...prev,
                [asset.id]: {
                  ...prevData,
                  price: currentPrice,
                  change: parseFloat(message.P),
                  history,
                },
              };
            });
          }
        };
      }
    });

    const interval = setInterval(async () => {
      for (const asset of ASSETS) {
        if (asset.type === "yahoo") {
          const res = await fetchYahooData(asset.symbol);
          if (res && isMounted) {
            setDataMap((prev) => ({ ...prev, [asset.id]: res }));
          }
        }
      }
    }, 60000);

    return () => {
      isMounted = false;
      if (wsBinance) wsBinance.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <MarketContext.Provider value={{ dataMap }}>
      {children}
    </MarketContext.Provider>
  );
};
