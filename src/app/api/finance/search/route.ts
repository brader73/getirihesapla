import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const targetUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`;
    let res = await fetch(targetUrl, { cache: 'no-store' });
    
    if (!res.ok) {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      res = await fetch(proxyUrl, { cache: 'no-store' });
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch search data: ${res.status}`);
    }

    const data = await res.json();
    const quotes = data?.quotes || [];

    const formattedResults = quotes.map((quote: any) => ({
      symbol: quote.symbol,
      shortname: quote.shortname || quote.longname || quote.symbol,
      typeDisp: quote.typeDisp || quote.quoteType,
      exchange: quote.exchange,
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Yahoo Finance Search API Error:', error);
    return NextResponse.json({ error: 'Failed to search symbols' }, { status: 500 });
  }
}
