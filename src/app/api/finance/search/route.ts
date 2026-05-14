import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const results: any = await yahooFinance.search(query, {
      newsCount: 0,
      quotesCount: 8,
    });

    const formattedResults = results.quotes.map((quote: any) => ({
      symbol: quote.symbol,
      shortname: quote.shortname || quote.longname || quote.symbol,
      typeDisp: quote.typeDisp,
      exchange: quote.exchange,
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error('Yahoo Finance Search Error:', error);
    return NextResponse.json({ error: 'Failed to search symbols' }, { status: 500 });
  }
}
