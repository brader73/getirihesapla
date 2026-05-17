import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols') || searchParams.get('symbol');

  if (!symbolsParam) {
    return NextResponse.json({ error: 'Query parameter "symbols" is required' }, { status: 400 });
  }

  const symbols = symbolsParam.split(',').map((s) => s.trim());

  try {
    const quotes: any = await yahooFinance.quote(symbols);

    if (!quotes || (Array.isArray(quotes) && quotes.length === 0)) {
      return NextResponse.json({ error: 'Symbols not found' }, { status: 404 });
    }

    const results = (Array.isArray(quotes) ? quotes : [quotes]).map((quote: any) => ({
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
    console.error('Yahoo Finance Quote Error:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}
