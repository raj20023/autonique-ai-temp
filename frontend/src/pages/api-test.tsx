import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const testEndpoints = [
    { name: 'Backend Health', url: 'https://api.autonique.in/test' },
    { name: 'API Health', url: 'https://api.autonique.in/api/v1/system/health' },
    { name: 'Webhook Test', url: 'https://api.autonique.in/webhook-test' },
  ];

  const testApi = async () => {
    setTesting(true);
    const results: any = {};

    for (const endpoint of testEndpoints) {
      try {
        console.log(`Testing ${endpoint.name}: ${endpoint.url}`);
        const response = await fetch(endpoint.url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        results[endpoint.name] = {
          status: response.status,
          success: response.ok,
          data: data,
          error: null
        };
      } catch (error: any) {
        results[endpoint.name] = {
          status: 0,
          success: false,
          data: null,
          error: error.message
        };
      }
    }

    setTestResults(results);
    setTesting(false);
  };

  const getStatusIcon = (result: any) => {
    if (!result) return <Loader2 className="h-5 w-5 text-gray-400" />;
    return result.success ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusColor = (result: any) => {
    if (!result) return 'border-gray-200';
    return result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };

  return (
    <>
      <Head>
        <title>API Test - Autonique.ai</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connectivity Test</h1>
            
            <div className="mb-8">
              <button
                onClick={testApi}
                disabled={testing}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test API Endpoints'
                )}
              </button>
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              {testEndpoints.map((endpoint) => {
                const result = testResults[endpoint.name];
                return (
                  <div key={endpoint.name} className={`border rounded-lg p-4 ${getStatusColor(result)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result)}
                        <h3 className="font-semibold text-gray-900">{endpoint.name}</h3>
                      </div>
                      {result && (
                        <span className={`text-sm px-2 py-1 rounded ${
                          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status || 'Failed'}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>URL:</strong> {endpoint.url}
                    </p>
                    
                    {result && (
                      <div className="text-sm">
                        {result.success ? (
                          <div>
                            <p className="text-green-700 mb-2"><strong>✅ Success</strong></p>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <div>
                            <p className="text-red-700 mb-2"><strong>❌ Failed</strong></p>
                            <p className="text-red-600">{result.error}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">What This Tests</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Backend Health:</strong> Basic backend connectivity</li>
                <li>• <strong>API Health:</strong> API router and database connectivity</li>
                <li>• <strong>Webhook Test:</strong> Webhook endpoint availability</li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">If Tests Fail</h3>
              <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                <li>Check Railway backend service is running</li>
                <li>Verify custom domain (api.autonique.in) is properly configured</li>
                <li>Check Railway backend logs for errors</li>
                <li>Ensure database connection is working</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
