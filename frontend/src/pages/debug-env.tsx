import { useEffect, useState } from 'react';

export default function DebugEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
      NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Environment Variables Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Environment Variables:</h2>
          
          <div className="space-y-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-gray-600">{key}:</span>
                  <span className={`font-mono text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
                    {value || 'NOT SET'}
                  </span>
                </div>
                {value && (
                  <div className="text-xs text-gray-500 mt-1 break-all">
                    {value}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Expected Values:</h3>
            <ul className="text-sm space-y-1">
              <li><strong>NEXT_PUBLIC_API_URL:</strong> https://autonique-backend-production.up.railway.app</li>
              <li><strong>NEXT_PUBLIC_FACEBOOK_APP_ID:</strong> 2032087817551720</li>
              <li><strong>NEXT_PUBLIC_FRONTEND_URL:</strong> https://autonique.in</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Troubleshooting:</h3>
            <ul className="text-sm space-y-1">
              <li>1. Make sure you have a <code>.env.local</code> file in the frontend directory</li>
              <li>2. Restart your Next.js development server after changing .env.local</li>
              <li>3. Environment variables must start with <code>NEXT_PUBLIC_</code> to be available in the browser</li>
              <li>4. Check that there are no extra spaces or quotes in your .env.local file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
