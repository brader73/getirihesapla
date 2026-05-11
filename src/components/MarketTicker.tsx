"use client";

import React from "react";
import { useMarketData, ASSETS } from "@/context/MarketContext";

export default function MarketTicker() {
  const { dataMap } = useMarketData();

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-slate-900 border-b-2 border-amber-600 text-white overflow-hidden py-2 h-10 box-border">
      <div className="flex whitespace-nowrap animate-ticker gap-12 pl-[100%]">
        {[1, 2].map((copyIndex) => (
          <React.Fragment key={copyIndex}>
            {ASSETS.map((asset) => {
              const data = dataMap[asset.id];
              if (!data) return null;

              const isPositive = data.change >= 0;
              let priceFormatted =
                asset.type === "yahoo"
                  ? asset.symbol === "XU100.IS"
                    ? data.price.toFixed(2)
                    : data.price.toFixed(4)
                  : data.price.toLocaleString("en-US", { style: "currency", currency: "USD" });

              if (asset.symbol === "USDTTRY") priceFormatted = "₺" + data.price.toFixed(4);
              if (asset.symbol === "GC=F") priceFormatted = "$" + data.price.toFixed(2);
              if (asset.symbol === "XU100.IS") priceFormatted = data.price.toFixed(2);

              return (
                <div key={asset.id} className="inline-flex items-center gap-2 font-semibold text-sm">
                  <span>{asset.name}</span>
                  <span className="text-white">{priceFormatted}</span>
                  <span className={isPositive ? "text-green-400" : "text-red-400"}>
                    {isPositive ? "▲" : "▼"} {Math.abs(data.change).toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
