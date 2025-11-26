"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { getSettings, saveSettings, clearSettings, type N8NSettings } from "@/lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<N8NSettings>({
    n8nUrl: '',
    apiKey: '',
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Load settings on mount
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default settings?')) {
      clearSettings();
      setSettings({
        n8nUrl: 'http://localhost:5678',
        apiKey: '',
      });
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Test through our API route (avoids CORS issues)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (settings.n8nUrl) {
        headers['X-N8N-URL'] = settings.n8nUrl;
      }
      if (settings.apiKey) {
        headers['X-N8N-API-KEY'] = settings.apiKey;
      }
      
      const response = await fetch('/api/test-n8n', { headers });
      const result = await response.json();
      
      if (result.success) {
        setTestResult({
          success: true,
          message: `✅ Connected successfully! n8n is reachable at ${result.n8nUrl}`,
        });
      } else {
        setTestResult({
          success: false,
          message: `❌ ${result.message}\n\nURL: ${result.n8nUrl}\n\n💡 Make sure n8n is running: n8n start`,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      setTestResult({
        success: false,
        message: `❌ Cannot connect to n8n.\n\nError: ${errorMsg}\n\n💡 Make sure n8n is running on the correct URL.`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your n8n instance connection</p>
        </div>

        {/* n8n Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-spice-500 rounded-lg flex items-center justify-center text-xl">
              🔧
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">n8n Configuration</h2>
              <p className="text-sm text-gray-500">Connect to your n8n instance</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* n8n URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                n8n Instance URL *
              </label>
              <input
                type="text"
                value={settings.n8nUrl}
                onChange={(e) => setSettings({ ...settings, n8nUrl: e.target.value })}
                placeholder="http://localhost:5678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8bc53f] focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                The base URL of your n8n instance (e.g., http://localhost:5678 or https://n8n.yourdomain.com)
              </p>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key (Optional)
              </label>
              <input
                type="password"
                value={settings.apiKey || ''}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="Enter your n8n API key (if required)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8bc53f] focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Only needed if your n8n instance requires API authentication
              </p>
            </div>

            {/* Test Connection */}
            {testResult && (
              <div
                className={`p-4 rounded-lg ${
                  testResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <p
                  className={`text-sm whitespace-pre-line ${
                  testResult.success ? 'text-green-800' : 'text-gray-700'
                  }`}
                >
                  {testResult.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-[#8bc53f] hover:bg-[#77a933] text-white font-medium rounded-lg transition-colors"
              >
                {saved ? '✓ Saved!' : 'Save Settings'}
              </button>
              <button
                onClick={handleTest}
                disabled={testing || !settings.n8nUrl}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Local n8n: <code className="bg-blue-100 px-2 py-0.5 rounded">http://localhost:5678</code></span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Settings are saved in your browser</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>No API key needed for local development</span>
              </li>
            </ul>
          </div>

          {/* Security Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-amber-900 mb-3">🔒 Security</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Settings stored locally in your browser</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>API key is never sent to external servers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Clear browser data to remove settings</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Setup Instructions</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-2">1. Start n8n (if not running):</p>
              <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
                <code>n8n start</code>
              </pre>
            </div>
            <div>
              <p className="font-medium mb-2">2. Verify n8n is accessible:</p>
              <p>Open your n8n URL in a browser and make sure it loads</p>
            </div>
            <div>
              <p className="font-medium mb-2">3. Save settings and test connection</p>
              <p>Click "Test Connection" to verify everything works</p>
            </div>
            <div>
              <p className="font-medium mb-2">4. Create workflows:</p>
              <p>Build webhooks in n8n and call them with <code className="bg-gray-100 px-2 py-0.5 rounded">useN8N('webhook-name')</code></p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

