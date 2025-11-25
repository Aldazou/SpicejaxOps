import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint to check if n8n is reachable
// This runs server-side, so no CORS issues!
export async function GET(request: NextRequest) {
  // Allow override from client settings
  const n8nUrl = request.headers.get('X-N8N-URL') || process.env.N8N_BASE_URL || 'http://localhost:5678';
  const apiKey = request.headers.get('X-N8N-API-KEY');
  
  try {
    const headers: HeadersInit = {};
    
    if (apiKey) {
      headers['X-N8N-API-KEY'] = apiKey;
    }

    const response = await fetch(`${n8nUrl}/healthz`, {
      method: 'GET',
      headers,
    });

    const isHealthy = response.ok;

    return NextResponse.json({
      success: isHealthy,
      n8nUrl,
      status: isHealthy ? 'connected' : 'error',
      message: isHealthy 
        ? 'n8n is reachable and healthy' 
        : `n8n responded with status ${response.status}`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      n8nUrl,
      status: 'error',
      message: errorMessage.includes('ECONNREFUSED') 
        ? 'Cannot connect to n8n. Make sure it is running.'
        : `Connection error: ${errorMessage}`,
      error: errorMessage,
    }, { status: 500 });
  }
}

