import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Query parameter "symbol" is required' }, { status: 400 });
  }

  try {
    const quote: any = await yahooFinance.quote(symbol);

    if (!quote) {
      return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
    }

    return NextResponse.json({
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency || 'USD',
      shortname: quote.shortName || quote.longName || quote.symbol,
      marketState: quote.marketState,
    });
  } catch (error) {
    console.error('Yahoo Finance Quote Error:', error);
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}
