import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols') || searchParams.get('symbol');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'Query parameter "symbols" is required' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').map((s) => s.trim()).join(',');

  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;
    let res = await fetch(url, { cache: 'no-store' });
    
    // If Yahoo blocks the request (e.g., from Vercel), use the proxy
    if (!res.ok) {
      console.warn('Direct fetch failed, falling back to proxy');
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      res = await fetch(proxyUrl, { cache: 'no-store' });
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch from Yahoo Finance API: ${res.status}`);
    }

    const data = await res.json();
    const quotes = data?.quoteResponse?.result;

    if (!quotes || quotes.length === 0) {
      return NextResponse.json({ error: 'Symbols not found' }, { status: 404 });
    }

    const results = quotes.map((quote: any) => ({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      currency: quote.currency || 'USD',
      shortname: quote.shortName || quote.longName || quote.symbol,
      marketState: quote.marketState,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}
