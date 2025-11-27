"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Zap, Search, RefreshCw, FolderOpen, Loader2, X, CheckCircle2, XCircle, Archive } from "lucide-react";

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

  const filteredWorkflows = workflows
    .filter((wf) => {
      if (hideArchived && (wf as any).isArchived === true) {
        return false;
      }
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-lime to-spice-600 flex items-center justify-center shadow-lg shadow-brand-lime/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-brand-lime">
                Automation
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              n8n Workflows
            </h1>
            <p className="text-brand-text/70 mt-1 text-sm">
              Execute workflows directly from your dashboard
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHideArchived(!hideArchived)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                hideArchived
                  ? 'bg-[#243530] text-white'
                  : 'bg-white border border-brand-gold/30 text-brand-text hover:bg-brand-sage'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span className="hidden sm:inline">{hideArchived ? 'Show Archived' : 'Hide Archived'}</span>
            </button>
            <button
              onClick={fetchWorkflows}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-brand-gold/30 rounded-2xl hover:bg-brand-sage hover:border-brand-gold transition-all text-sm font-semibold text-brand-text disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40" />
            <input
              type="text"
              placeholder="Search workflows by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-brand-sage border border-brand-gold/20 rounded-2xl focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/20 focus:outline-none text-brand-title placeholder-brand-text/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-brand-text/10 text-brand-text/50 hover:bg-brand-text/20 hover:text-brand-text transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
          {workflows.length > 0 && (
            <p className="text-sm text-brand-text/60 mt-3">
              Showing {filteredWorkflows.length} of {workflows.length} workflows
            </p>
          )}
        </div>

        {/* Workflows Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-16 text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-brand-lime/20 rounded-full blur-xl animate-pulse"></div>
              <Loader2 className="w-10 h-10 animate-spin text-brand-lime relative" />
            </div>
            <p className="text-brand-text/60">Loading workflows from n8n...</p>
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-sage flex items-center justify-center mx-auto mb-4 border border-brand-gold/20">
              <FolderOpen className="w-8 h-8 text-brand-text/30" />
            </div>
            {searchQuery ? (
              <>
                <p className="text-brand-title font-semibold mb-1">No workflows match "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-brand-lime hover:text-spice-600 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="text-brand-title font-semibold mb-1">No workflows found</p>
                <p className="text-sm text-brand-text/60">Create a workflow in n8n to see it here</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_-8px_rgba(139,197,63,0.15)] hover:border-brand-lime/30 transition-all duration-500 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-brand-title mb-1 truncate">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-brand-text/50 font-mono truncate">
                        ID: {workflow.id}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 ml-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        workflow.active
                          ? 'bg-spice-50 text-brand-lime border border-brand-lime/20'
                          : 'bg-brand-sage text-brand-text/50 border border-brand-gold/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${workflow.active ? 'bg-brand-lime' : 'bg-brand-text/30'}`}></span>
                      {workflow.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => executeWorkflow(workflow)}
                    disabled={executing === workflow.id}
                    className="w-full py-3 bg-gradient-to-r from-brand-lime to-spice-600 hover:from-spice-600 hover:to-brand-lime disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-lime/20 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {executing === workflow.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Execute
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Execution Results */}
        {executions.length > 0 && (
          <div className="bg-white rounded-3xl border border-brand-gold/20 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-title">
                Execution Results
              </h2>
              <button
                onClick={() => setExecutions([])}
                className="px-4 py-2 text-sm text-brand-text/60 hover:text-brand-title hover:bg-brand-sage rounded-xl transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="space-y-4">
              {executions.map((exec, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-5 border ${
                    exec.success
                      ? 'border-brand-lime/30 bg-spice-50'
                      : 'border-brand-rust/20 bg-rust-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          exec.success
                            ? 'bg-brand-lime text-white'
                            : 'bg-brand-rust text-white'
                        }`}
                      >
                        {exec.success ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            SUCCESS
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            ERROR
                          </>
                        )}
                      </span>
                      <p className="font-bold text-brand-title mt-2">
                        {exec.workflowName}
                      </p>
                      <p className="text-xs text-brand-text/50 font-mono">
                        {exec.workflowId}
                      </p>
                    </div>
                    <span className="text-xs text-brand-text/50">
                      {new Date(exec.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-brand-text/60 mb-2">
                      {exec.success ? 'Result:' : 'Error:'}
                    </p>
                    <pre
                      className={`p-4 rounded-xl overflow-x-auto text-xs font-mono ${
                        exec.success
                          ? 'bg-[#243530] text-brand-lime'
                          : 'bg-[#243530] text-brand-rust'
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
