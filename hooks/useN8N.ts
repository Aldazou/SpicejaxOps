"use client";

import { useState, useEffect } from 'react';

interface UseN8NOptions {
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseN8NResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch data from n8n workflows
 * @param workflowPath - The n8n workflow webhook path (e.g., 'dashboard', 'spicejax/content', etc.)
 * @param options - Hook options
 * 
 * @example
 * const { data, loading, error } = useN8N('dashboard');
 * const { data } = useN8N('spicejax/content');
 * const { data } = useN8N('my-custom-workflow', { refreshInterval: 30000 });
 */
export function useN8N<T = any>(
  workflowPath: string,
  options: UseN8NOptions = {}
): UseN8NResult<T> {
  const { autoFetch = true, refreshInterval } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get settings from localStorage
      const settings = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('spicejax_settings') || '{}')
        : {};
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Pass custom n8n URL and API key via headers
      if (settings.n8nUrl) {
        headers['X-N8N-URL'] = settings.n8nUrl;
      }
      if (settings.apiKey) {
        headers['X-N8N-API-KEY'] = settings.apiKey;
      }
      
      // Call the generic n8n proxy endpoint
      const response = await fetch(`/api/n8n/${workflowPath}`, { headers });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to fetch data');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('useN8N error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    // Set up auto-refresh if interval is specified
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [workflowPath, autoFetch, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for POST/PUT/DELETE requests to n8n workflows
 * 
 * @example
 * const { mutate, loading } = useN8NMutation('create-content');
 * await mutate({ title: 'New Post', content: '...' });
 * 
 * const { mutate: updateItem } = useN8NMutation('update-content', 'PUT');
 * await updateItem({ id: 123, title: 'Updated' });
 */
export function useN8NMutation<TData = any, TVariables = any>(
  workflowPath: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables?: TVariables): Promise<TData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get settings from localStorage
      const settings = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('spicejax_settings') || '{}')
        : {};
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Pass custom n8n URL and API key via headers
      if (settings.n8nUrl) {
        headers['X-N8N-URL'] = settings.n8nUrl;
      }
      if (settings.apiKey) {
        headers['X-N8N-API-KEY'] = settings.apiKey;
      }
      
      const response = await fetch(`/api/n8n/${workflowPath}`, {
        method,
        headers,
        body: variables ? JSON.stringify(variables) : undefined,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Request failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('useN8NMutation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}

