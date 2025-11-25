import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Get all workflows from n8n
 */
export async function GET(request: NextRequest) {
  const n8nUrl = request.headers.get('X-N8N-URL') || N8N_BASE_URL;
  const apiKey = request.headers.get('X-N8N-API-KEY');
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['X-N8N-API-KEY'] = apiKey;
    }

    // Fetch workflows from n8n
    const response = await fetch(`${n8nUrl}/api/v1/workflows`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch workflows: ${response.status}`);
    }

    const workflows = await response.json();
    
    // Sort workflows by most recent first (updatedAt)
    const allWorkflows = workflows.data || workflows;
    const sortedWorkflows = Array.isArray(allWorkflows)
      ? [...allWorkflows].sort((a: any, b: any) => {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt).getTime();
          return dateB - dateA; // Most recent first
        })
      : allWorkflows;
    
    console.log('=== N8N WORKFLOWS ===');
    console.log(`Total workflows: ${sortedWorkflows.length}`);
    if (sortedWorkflows.length > 0) {
      console.log(`Most recent: "${sortedWorkflows[0].name}" (${sortedWorkflows[0].updatedAt})`);
    }
    console.log('=====================');
    
    return NextResponse.json({
      success: true,
      workflows: sortedWorkflows,
    });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch workflows from n8n',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

