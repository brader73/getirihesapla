import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols') || searchParams.get('symbol');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'Query parameter "symbols" is required' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').map((s) => s.trim());

  try {
    const results = await Promise.all(symbols.map(async (symbol) => {
      try {
        const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=5m`;
        let res = await fetch(targetUrl, { cache: 'no-store' });
        
        if (!res.ok) {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
          res = await fetch(proxyUrl, { cache: 'no-store' });
        }

        if (!res.ok) return null;

        const data = await res.json();
        const result = data?.chart?.result?.[0];
        if (!result) return null;

        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose;
        const change = currentPrice - prevClose;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;

        return {
          symbol: meta.symbol || symbol,
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          currency: meta.currency || 'USD',
          shortname: meta.symbol || symbol,
          marketState: meta.exchangeTimezoneName,
        };
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err);
        return null;
      }
    }));

    const validResults = results.filter(Boolean);

    if (validResults.length === 0) {
      return NextResponse.json({ error: 'Symbols not found' }, { status: 404 });
    }

    return NextResponse.json(validResults);
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}
