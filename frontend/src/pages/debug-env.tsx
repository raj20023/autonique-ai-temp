import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function DebugEnvPage() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FACEBOOK_APP_ID',
    'NEXT_PUBLIC_FRONTEND_URL',
    'NEXT_PUBLIC_API_URL'
  ];

  const allEnvVars = Object.keys(process.env)
    .filter(key => key.startsWith('NEXT_PUBLIC_'))
    .sort();

  const getEnvStatus = (key: string) => {
    const value = process.env[key];
    if (!value || value === 'undefined') {
      return { status: 'missing', icon: XCircle, color: 'text-red-500' };
    }
    return { status: 'present', icon: CheckCircle, color: 'text-green-500' };
  };

  return (
    <>
      <Head>
        <title>Environment Variables Debug - Autonique.ai</title>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Environment Variables Debug</h1>
            
            {/* Build Info */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Build Information</h2>
              <div className="space-y-1 text-sm">
                <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'undefined'}</p>
                <p><strong>Build Time:</strong> {new Date().toISOString()}</p>
              </div>
            </div>

            {/* Required Environment Variables */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Environment Variables</h2>
              <div className="space-y-3">
                {requiredEnvVars.map((key) => {
                  const { status, icon: Icon, color } = getEnvStatus(key);
                  const value = process.env[key];
                  
                  return (
                    <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {key}
                          </code>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            status === 'present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Value:</strong> {value ? 
                            (key.includes('SECRET') || key.includes('KEY') ? 
                              `${value.substring(0, 10)}...` : value
                            ) : 
                            '❌ NOT SET'
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Environment Variables */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All NEXT_PUBLIC_ Variables</h2>
              {allEnvVars.length > 0 ? (
                <div className="space-y-2">
                  {allEnvVars.map((key) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <code className="text-sm font-mono">{key}</code>
                      <span className="text-sm text-gray-600">
                        {process.env[key] ? '✅ Set' : '❌ Missing'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-800">No NEXT_PUBLIC_ environment variables found!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Troubleshooting */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Troubleshooting Steps</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                <li>Check Railway dashboard → Your frontend service → Variables tab</li>
                <li>Ensure variables start with <code>NEXT_PUBLIC_</code></li>
                <li>After adding/changing variables, redeploy the service</li>
                <li>Variables are only available after a successful build</li>
                <li>Check Railway build logs for any errors</li>
              </ol>
            </div>

            {/* Test Login Button */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Test Login</h3>
              <Link 
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Facebook Login
              </Link>
              <p className="text-sm text-gray-600 mt-2">
                This will show detailed console logs about environment variables
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
