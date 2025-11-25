import { NextResponse } from 'next/server';

// Health check endpoint to verify API is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'SpiceJax Command Center API is running',
    timestamp: new Date().toISOString(),
    n8nUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
  });
}

