import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data, timestamp } = body;

    // Log the event (in production, send to analytics service)
    console.log(`[Analytics] ${timestamp} - ${event}`, JSON.stringify(data || {}));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
