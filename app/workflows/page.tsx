"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";

interface N8NWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowExecution {
  workflowId: string;
  workflowName: string;
  result: any;
  timestamp: string;
  success: boolean;
  error?: string;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<N8NWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideArchived, setHideArchived] = useState(true);
  // Fetch workflows from n8n on mount
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const settings = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('spicejax_settings') || '{}')
        : {};
      
      const headers: HeadersInit = {};
      if (settings.n8nUrl) headers['X-N8N-URL'] = settings.n8nUrl;
      if (settings.apiKey) headers['X-N8N-API-KEY'] = settings.apiKey;

      const response = await fetch('/api/n8n-workflows', { 
        headers,
        cache: 'no-store',
      });
      const data = await response.json();

      if (data.success) {
        setWorkflows(data.workflows);
      } else {
        console.error('Failed to fetch workflows:', data.error);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter workflows based on search query and archive status
  const filteredWorkflows = workflows
    .filter((wf) => {
      // Filter by archive status
      if (hideArchived && (wf as any).isArchived === true) {
        return false;
      }
      // Filter by search query
      return (
        wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const executeWorkflow = async (workflow: N8NWorkflow) => {
    setExecuting(workflow.id);
    
    try {
      const settings = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('spicejax_settings') || '{}')
        : {};
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (settings.n8nUrl) headers['X-N8N-URL'] = settings.n8nUrl;
      if (settings.apiKey) headers['X-N8N-API-KEY'] = settings.apiKey;

      const response = await fetch(`/api/n8n-workflows/${workflow.id}/execute`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.success) {
        setExecutions(prev => [{
          workflowId: workflow.id,
          workflowName: workflow.name,
          result: data.result,
          timestamp: new Date().toISOString(),
          success: true,
        }, ...prev]);
      } else {
        setExecutions(prev => [{
          workflowId: workflow.id,
          workflowName: workflow.name,
          result: null,
          timestamp: new Date().toISOString(),
          success: false,
          error: data.message || data.error,
        }, ...prev]);
      }
    } catch (error) {
      setExecutions(prev => [{
        workflowId: workflow.id,
        workflowName: workflow.name,
        result: null,
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, ...prev]);
    } finally {
      setExecuting(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Your n8n Workflows
                  </h1>
                  <p className="text-gray-600">
                    Execute workflows directly from n8n
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHideArchived(!hideArchived)}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                      hideArchived
                        ? 'bg-[#8bc53f] text-white hover:bg-[#77a933]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hideArchived ? '📁 Show Archived' : '✓ Hide Archived'}
                  </button>
                  <button
                    onClick={fetchWorkflows}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    {loading ? '⟳ Loading...' : '↻ Refresh'}
                  </button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search workflows by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:border-[#8bc53f] focus:outline-none text-gray-900 placeholder-gray-400"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {workflows.length > 0 && (
                <p className="text-sm text-gray-500 mt-3">
                  Showing {filteredWorkflows.length} of {workflows.length} workflows
                </p>
              )}
            </div>

        {/* Workflows Grid */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-gray-600">Loading workflows from n8n...</p>
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            {searchQuery ? (
              <>
                <p className="text-gray-600 mb-2">No workflows match "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-[#4f7f00] hover:text-[#8bc53f] font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-2">No workflows found in n8n</p>
                <p className="text-sm text-gray-500">Create a workflow in n8n to see it here</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {workflow.id}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        workflow.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {workflow.active ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                  
                      <button
                        onClick={() => executeWorkflow(workflow)}
                        disabled={executing === workflow.id}
                        className="w-full py-3 bg-[#8bc53f] hover:bg-[#77a933] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                      >
                        {executing === workflow.id ? '⏳ Executing...' : '⚡ Execute'}
                      </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Execution Results */}
        {executions.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Execution Results
              </h2>
              <button
                onClick={() => setExecutions([])}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-4">
              {executions.map((exec, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 ${
                    exec.success
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          exec.success
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-700'
                        }`}
                      >
                        {exec.success ? '✓ SUCCESS' : '✗ ERROR'}
                      </span>
                      <p className="font-bold text-gray-900 mt-2">
                        {exec.workflowName}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {exec.workflowId}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(exec.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      {exec.success ? 'Result:' : 'Error:'}
                    </p>
                    <pre
                      className={`p-4 rounded-lg overflow-x-auto text-xs font-mono ${
                      exec.success
                        ? 'bg-gray-900 text-green-400'
                          : 'bg-gray-900 text-amber-200'
                      }`}
                    >
                      {exec.success
                        ? JSON.stringify(exec.result, null, 2)
                        : exec.error}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

