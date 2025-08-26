import { useState } from 'react';
import { buildFacebookOAuthUrl, getRedirectUri, FACEBOOK_CONFIG } from '@/config/facebook';

export default function TestOAuthPage() {
  const [oauthUrl, setOauthUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const generateUrl = () => {
    try {
      const redirectUri = getRedirectUri();
      const url = buildFacebookOAuthUrl(redirectUri);
      setOauthUrl(url);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setOauthUrl('');
    }
  };

  const testLogin = () => {
    if (oauthUrl) {
      window.location.href = oauthUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OAuth URL Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Scope:</strong> {FACEBOOK_CONFIG.OAUTH_SCOPE}</div>
            <div><strong>API Version:</strong> {FACEBOOK_CONFIG.API_VERSION}</div>
            <div><strong>Required Permissions:</strong> {FACEBOOK_CONFIG.REQUIRED_PERMISSIONS.join(', ')}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">URL Generation Test</h2>
          <button
            onClick={generateUrl}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            Generate OAuth URL
          </button>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {oauthUrl && (
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
              <h3 className="font-semibold text-green-800 mb-2">Generated URL:</h3>
              <div className="bg-white border rounded p-2 text-xs break-all font-mono">
                {oauthUrl}
              </div>
              <button
                onClick={testLogin}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Test Login with This URL
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div><strong>NEXT_PUBLIC_FACEBOOK_APP_ID:</strong> {process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'Not set'}</div>
            <div><strong>NEXT_PUBLIC_FRONTEND_URL:</strong> {process.env.NEXT_PUBLIC_FRONTEND_URL || 'Not set'}</div>
            <div><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
