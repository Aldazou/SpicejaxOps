"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";

export default function TestPage() {
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testWorkflow = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const settings = JSON.parse(localStorage.getItem('spicejax_settings') || '{}');
      const n8nUrl = settings.n8nUrl || 'http://localhost:5678';
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (settings.n8nUrl) headers['X-N8N-URL'] = settings.n8nUrl;
      if (settings.apiKey) headers['X-N8N-API-KEY'] = settings.apiKey;

      // Call our Next.js API proxy
      const res = await fetch('/api/n8n/test', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: name || "Friend",
          product: product || "Birria Blend"
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setResponse(data);
      } else {
        setError(data.message || 'Workflow call failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-spice-600 to-spice-700 rounded-2xl p-8 text-white shadow-glow">
          <h1 className="text-3xl font-bold mb-2">🧪 Test Workflow</h1>
          <p className="text-red-100">
            Test your n8n connection with a simple workflow
          </p>
        </div>

        {/* Test Form */}
        <div className="card-premium p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Send Test Data to n8n
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-spice-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g., Birria Blend"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-spice-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={testWorkflow}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Testing..." : "🚀 Test Workflow"}
            </button>
          </div>
        </div>

        {/* Response */}
        {response && (
          <div className="card-premium p-8 animate-slide-up bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Success!</h3>
                <p className="text-sm text-gray-600">Workflow executed successfully</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-200">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                {response.message}
              </p>
              
              {response.data && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-semibold text-gray-900">{response.data.product}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Spice Level:</span>
                    <span className="font-semibold">{response.data.spiceLevel}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="font-mono text-xs text-gray-500">{response.data.timestamp}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-500 font-mono bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card-premium p-8 animate-slide-up bg-[#f3fbe3] border-[#cfe7b1]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-[#8bc53f] rounded-full flex items-center justify-center text-2xl text-white">
                ✕
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Error</h3>
                <p className="text-sm text-gray-600">Something went wrong</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#cfe7b1]">
              <p className="text-[#4f7f00] font-mono text-sm">{error}</p>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold mb-2">💡 Troubleshooting:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Make sure n8n is running: <code className="bg-gray-100 px-2 py-1 rounded">n8n start</code></li>
                <li>Check the workflow is activated (toggle ON in n8n)</li>
                <li>Verify the webhook path is: <code className="bg-gray-100 px-2 py-1 rounded">/webhook/test</code></li>
                <li>Go to Settings and check your n8n URL</li>
              </ul>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!response && !error && (
          <div className="card-premium p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📝 Setup Instructions
            </h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex">
                <span className="font-bold text-spice-600 mr-3">1.</span>
                <span>Open n8n at <code className="bg-white px-2 py-1 rounded border">http://localhost:5678</code></span>
              </li>
              <li className="flex">
                <span className="font-bold text-spice-600 mr-3">2.</span>
                <span>Create workflow with Webhook → Code → Respond to Webhook</span>
              </li>
              <li className="flex">
                <span className="font-bold text-spice-600 mr-3">3.</span>
                <span>Set webhook path to: <code className="bg-white px-2 py-1 rounded border">test</code></span>
              </li>
              <li className="flex">
                <span className="font-bold text-spice-600 mr-3">4.</span>
                <span>Activate the workflow (toggle ON)</span>
              </li>
              <li className="flex">
                <span className="font-bold text-spice-600 mr-3">5.</span>
                <span>Fill the form above and click Test Workflow!</span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

