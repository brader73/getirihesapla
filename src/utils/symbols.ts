export interface MarketSymbol {
  symbol: string;
  name: string;
  type: "crypto" | "bist" | "us_stock" | "forex" | "commodity" | "index";
  exchange: string;
}

export const SYMBOL_DATABASE: MarketSymbol[] = [
  // BIST Hisseler (Türkiye)
  { symbol: "BIST:THYAO", name: "Türk Hava Yolları", type: "bist", exchange: "BIST" },
  { symbol: "BIST:TUPRS", name: "Tüpraş", type: "bist", exchange: "BIST" },
  { symbol: "BIST:KCHOL", name: "Koç Holding", type: "bist", exchange: "BIST" },
  { symbol: "BIST:AKBNK", name: "Akbank", type: "bist", exchange: "BIST" },
  { symbol: "BIST:ISCTR", name: "İş Bankası", type: "bist", exchange: "BIST" },
  { symbol: "BIST:EREGL", name: "Erdemir", type: "bist", exchange: "BIST" },
  { symbol: "BIST:ASELS", name: "Aselsan", type: "bist", exchange: "BIST" },
  { symbol: "BIST:SAHOL", name: "Sabancı Holding", type: "bist", exchange: "BIST" },
  { symbol: "BIST:BIMAS", name: "BİM Birleşik Mağazalar", type: "bist", exchange: "BIST" },
  { symbol: "BIST:FROTO", name: "Ford Otosan", type: "bist", exchange: "BIST" },
  { symbol: "BIST:GARAN", name: "Garanti BBVA", type: "bist", exchange: "BIST" },
  { symbol: "BIST:SISE", name: "Şişecam", type: "bist", exchange: "BIST" },

  // Crypto
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", type: "crypto", exchange: "BINANCE" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum", type: "crypto", exchange: "BINANCE" },
  { symbol: "BINANCE:BNBUSDT", name: "BNB", type: "crypto", exchange: "BINANCE" },
  { symbol: "BINANCE:SOLUSDT", name: "Solana", type: "crypto", exchange: "BINANCE" },
  { symbol: "BINANCE:XRPUSDT", name: "XRP", type: "crypto", exchange: "BINANCE" },
  { symbol: "BINANCE:ADAUSDT", name: "Cardano", type: "crypto", exchange: "BINANCE" },
  { symbol: "BINANCE:AVAXUSDT", name: "Avalanche", type: "crypto", exchange: "BINANCE" },
  { symbol: "BINANCE:DOGEUSDT", name: "Dogecoin", type: "crypto", exchange: "BINANCE" },

  // US Stocks
  { symbol: "NASDAQ:AAPL", name: "Apple Inc.", type: "us_stock", exchange: "NASDAQ" },
  { symbol: "NASDAQ:MSFT", name: "Microsoft Corp.", type: "us_stock", exchange: "NASDAQ" },
  { symbol: "NASDAQ:GOOGL", name: "Alphabet Inc.", type: "us_stock", exchange: "NASDAQ" },
  { symbol: "NASDAQ:AMZN", name: "Amazon.com", type: "us_stock", exchange: "NASDAQ" },
  { symbol: "NASDAQ:NVDA", name: "NVIDIA Corp.", type: "us_stock", exchange: "NASDAQ" },
  { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", type: "us_stock", exchange: "NASDAQ" },
  { symbol: "NASDAQ:META", name: "Meta Platforms", type: "us_stock", exchange: "NASDAQ" },
  { symbol: "NYSE:V", name: "Visa Inc.", type: "us_stock", exchange: "NYSE" },

  // Forex
  { symbol: "FX_IDC:USDTRY", name: "Amerikan Doları / Türk Lirası", type: "forex", exchange: "FX" },
  { symbol: "FX_IDC:EURTRY", name: "Euro / Türk Lirası", type: "forex", exchange: "FX" },
  { symbol: "FX_IDC:GBPTRY", name: "İngiliz Sterlini / Türk Lirası", type: "forex", exchange: "FX" },
  { symbol: "FX:EURUSD", name: "Euro / Amerikan Doları", type: "forex", exchange: "FX" },
  { symbol: "FX:GBPUSD", name: "İngiliz Sterlini / Amerikan Doları", type: "forex", exchange: "FX" },
  { symbol: "FX:USDJPY", name: "Amerikan Doları / Japon Yeni", type: "forex", exchange: "FX" },

  // Commodities
  { symbol: "OANDA:XAUUSD", name: "Altın (Ons)", type: "commodity", exchange: "OANDA" },
  { symbol: "OANDA:XAGUSD", name: "Gümüş (Ons)", type: "commodity", exchange: "OANDA" },
  { symbol: "TVC:USOIL", name: "Ham Petrol (WTI)", type: "commodity", exchange: "TVC" },
  { symbol: "TVC:UKOIL", name: "Brent Petrol", type: "commodity", exchange: "TVC" },
  { symbol: "TVC:PLATINUM", name: "Platin", type: "commodity", exchange: "TVC" },
  { symbol: "TVC:COPPER", name: "Bakır", type: "commodity", exchange: "TVC" },

  // Indices & Funds
  { symbol: "FOREXCOM:SPXUSD", name: "S&P 500", type: "index", exchange: "FOREXCOM" },
  { symbol: "FOREXCOM:NSXUSD", name: "NASDAQ 100", type: "index", exchange: "FOREXCOM" },
  { symbol: "FOREXCOM:DJI", name: "Dow Jones", type: "index", exchange: "FOREXCOM" },
  { symbol: "AMEX:SPY", name: "SPDR S&P 500 ETF (Fon)", type: "index", exchange: "AMEX" },
  { symbol: "NASDAQ:QQQ", name: "Invesco QQQ Trust (Fon)", type: "index", exchange: "NASDAQ" },
  { symbol: "AMEX:GLD", name: "SPDR Gold Shares (Altın Fonu)", type: "index", exchange: "AMEX" }
];
