import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
const WEBHOOK_OVERRIDES: Record<string, string | undefined> = {
  'content-generate': process.env.N8N_CONTENT_GENERATE_WEBHOOK,
  'image-enhance': process.env.N8N_IMAGE_ENHANCE_WEBHOOK,
};

function buildWebhookUrl(baseUrl: string, envValue: string | undefined, defaultPath: string) {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  if (envValue) {
    if (envValue.startsWith('http')) {
      return envValue;
    }
    const path = envValue.startsWith('/') ? envValue : `/${envValue}`;
    return `${normalizedBase}${path}`;
  }
  return `${normalizedBase}${defaultPath}`;
}

function resolveWebhookUrl(baseUrl: string, webhookPath: string) {
  const override = WEBHOOK_OVERRIDES[webhookPath];
  return buildWebhookUrl(baseUrl, override, `/webhook/${webhookPath}`);
}

/**
 * Generic n8n proxy endpoint
 * Forwards all requests to n8n webhooks
 * 
 * Usage:
 * GET  /api/n8n/workflow-name
 * POST /api/n8n/workflow-name
 * 
 * This calls: http://localhost:5678/webhook/workflow-name
 * 
 * Can override n8n URL via headers:
 * X-N8N-URL: custom n8n instance URL
 * X-N8N-API-KEY: optional API key
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const webhookPath = params.path.join('/');
  
  // Allow override from client settings
  const n8nUrl = request.headers.get('X-N8N-URL') || N8N_BASE_URL;
  const apiKey = request.headers.get('X-N8N-API-KEY');
  
  const url = resolveWebhookUrl(n8nUrl, webhookPath);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['X-N8N-API-KEY'] = apiKey;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('n8n webhook error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch from n8n',
        message: error instanceof Error ? error.message : 'Unknown error',
        webhookPath,
        n8nUrl: url,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const webhookPath = params.path.join('/');
  
  // Allow override from client settings
  const n8nUrl = request.headers.get('X-N8N-URL') || N8N_BASE_URL;
  const apiKey = request.headers.get('X-N8N-API-KEY');
  
  const url = resolveWebhookUrl(n8nUrl, webhookPath);

  try {
    const body = await request.json();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['X-N8N-API-KEY'] = apiKey;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n error response:', errorText);
      throw new Error(`n8n responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('n8n webhook error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to post to n8n',
        message: error instanceof Error ? error.message : 'Unknown error',
        webhookPath,
        n8nUrl: url,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const webhookPath = params.path.join('/');
  
  // Allow override from client settings
  const n8nUrl = request.headers.get('X-N8N-URL') || N8N_BASE_URL;
  const apiKey = request.headers.get('X-N8N-API-KEY');
  
  const url = resolveWebhookUrl(n8nUrl, webhookPath);

  try {
    const body = await request.json();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['X-N8N-API-KEY'] = apiKey;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('n8n webhook error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to update in n8n',
        message: error instanceof Error ? error.message : 'Unknown error',
        webhookPath,
        n8nUrl: url,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const webhookPath = params.path.join('/');
  
  // Allow override from client settings
  const n8nUrl = request.headers.get('X-N8N-URL') || N8N_BASE_URL;
  const apiKey = request.headers.get('X-N8N-API-KEY');
  
  const url = resolveWebhookUrl(n8nUrl, webhookPath);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['X-N8N-API-KEY'] = apiKey;
    }
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('n8n webhook error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to delete from n8n',
        message: error instanceof Error ? error.message : 'Unknown error',
        webhookPath,
        n8nUrl: url,
      },
      { status: 500 }
    );
  }
}
