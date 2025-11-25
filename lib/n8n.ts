/**
 * n8n Client - Direct integration with n8n webhooks
 * 
 * This is a simple utility, but you mainly use:
 * - useN8N() hook in components
 * - /api/n8n/[...path] route for server-side calls
 */

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

/**
 * Call any n8n webhook directly
 * 
 * @example
 * // Client-side (in components)
 * const { data } = useN8N('dashboard');
 * const { data } = useN8N('my-workflow');
 * 
 * // Server-side (in API routes)
 * const data = await callN8NWebhook('dashboard');
 */
export async function callN8NWebhook<T = any>(
  webhookPath: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const url = `${N8N_BASE_URL}/webhook/${webhookPath}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('n8n webhook error:', error);
    throw error;
  }
}

export const n8n = {
  call: callN8NWebhook,
  baseUrl: N8N_BASE_URL,
};

