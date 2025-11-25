import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

/**
 * Execute a workflow by ID
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const workflowId = params.id;
  const n8nUrl = request.headers.get('X-N8N-URL') || N8N_BASE_URL;
  const apiKey = request.headers.get('X-N8N-API-KEY');
  
  try {
    const body = await request.json().catch(() => ({}));
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['X-N8N-API-KEY'] = apiKey;
    }

    // First, get the workflow details to find webhook nodes
    console.log(`Fetching workflow ${workflowId} to find webhook...`);
    
    const workflowResponse = await fetch(`${n8nUrl}/api/v1/workflows/${workflowId}`, {
      method: 'GET',
      headers,
    });

    if (!workflowResponse.ok) {
      throw new Error(`Failed to fetch workflow: ${workflowResponse.status}`);
    }

    const workflow = await workflowResponse.json();
    
    console.log('Workflow nodes:', workflow.nodes?.map((n: any) => ({ type: n.type, name: n.name })));
    
    // Find webhook node in the workflow
    const webhookNode = workflow.nodes?.find((node: any) => 
      node.type === 'n8n-nodes-base.webhook'
    );

    if (!webhookNode) {
      console.error('No webhook node found. Available nodes:', workflow.nodes?.length);
      throw new Error('This workflow does not have a webhook trigger. Please add a Webhook node to execute it from the app.');
    }

    // Get the webhook path from the node parameters
    const webhookPath = webhookNode.parameters?.path || 'test';
    const webhookMethod = (webhookNode.parameters?.httpMethod || 'GET').toUpperCase();
    
    console.log(`Found webhook: ${webhookMethod} /webhook/${webhookPath}`);

    // Call the webhook to execute the workflow
    const webhookUrl = `${n8nUrl}/webhook/${webhookPath}`;
    
    const webhookResponse = await fetch(webhookUrl, {
      method: webhookMethod,
      headers: {
        'Content-Type': 'application/json',
      },
      body: webhookMethod !== 'GET' ? JSON.stringify(body) : undefined,
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      throw new Error(`Webhook call failed: ${webhookResponse.status} - ${errorText}`);
    }

    const result = await webhookResponse.json().catch(() => ({ status: 'executed' }));
    console.log(`Workflow executed successfully via webhook`);
    
    return NextResponse.json({
      success: true,
      result,
      webhookPath: `/webhook/${webhookPath}`,
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute workflow',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

