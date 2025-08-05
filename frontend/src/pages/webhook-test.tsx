import { useState } from 'react';
import Head from 'next/head';

export default function WebhookTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/webhook/?hub.mode=subscribe&hub.verify_token=instareply_webhook_2024_secure_token_xyz789&hub.challenge=12345');
      const result = await response.text();
      setTestResult(`Success: ${result}`);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch('/webhook-test');
      const result = await response.json();
      setTestResult(`Backend Test: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Webhook Test - Autonique.ai</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Webhook Test Page</h1>
            
            <div className="space-y-4">
              <button
                onClick={testBackend}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              >
                {loading ? 'Testing...' : 'Test Backend Connection'}
              </button>
              
              <button
                onClick={testWebhook}
                disabled={loading}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? 'Testing...' : 'Test Webhook Verification'}
              </button>
            </div>
            
            {testResult && (
              <div className="mt-8 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Test Result:</h3>
                <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
              </div>
            )}
            
            <div className="mt-8 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">Facebook Webhook Configuration:</h3>
              <p><strong>Callback URL:</strong> https://a4614e674beb.ngrok-free.app/api/v1/webhook/</p>
              <p><strong>Verify Token:</strong> instareply_webhook_2024_secure_token_xyz789</p>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 rounded">
              <h3 className="font-semibold mb-2">Manual Test URLs:</h3>
              <p className="text-sm mb-2">
                <strong>Backend Test:</strong><br/>
                <a 
                  href="https://a4614e674beb.ngrok-free.app/webhook-test" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://a4614e674beb.ngrok-free.app/webhook-test
                </a>
              </p>
              <p className="text-sm">
                <strong>Webhook Verification:</strong><br/>
                <a 
                  href="https://a4614e674beb.ngrok-free.app/api/v1/webhook/?hub.mode=subscribe&hub.verify_token=instareply_webhook_2024_secure_token_xyz789&hub.challenge=12345" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  https://a4614e674beb.ngrok-free.app/api/v1/webhook/?hub.mode=subscribe&hub.verify_token=instareply_webhook_2024_secure_token_xyz789&hub.challenge=12345
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
