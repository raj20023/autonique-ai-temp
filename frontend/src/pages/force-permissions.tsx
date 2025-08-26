import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, RefreshCw, Shield, CheckCircle } from 'lucide-react';

export default function ForcePermissionsPage() {
  const [step, setStep] = useState(1);

  // Multiple URLs with different parameters to force Facebook to re-evaluate
  const forceUrls = [
    {
      name: "Method 1: Force Re-request",
      url: "https://www.facebook.com/v18.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Fcallback&scope=pages_messaging%2Cinstagram_basic%2Cinstagram_manage_messages%2Cpages_show_list%2Cbusiness_management&response_type=code&auth_type=rerequest&display=popup&force_login=true"
    },
    {
      name: "Method 2: Force Login + Re-request", 
      url: "https://www.facebook.com/v18.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Fcallback&scope=pages_messaging%2Cinstagram_basic%2Cinstagram_manage_messages%2Cpages_show_list%2Cbusiness_management&response_type=code&auth_type=rerequest&display=page&force_login=true&reauthorize=true"
    },
    {
      name: "Method 3: Different Display Mode",
      url: "https://www.facebook.com/v18.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Fcallback&scope=pages_messaging%2Cinstagram_basic%2Cinstagram_manage_messages%2Cpages_show_list%2Cbusiness_management&response_type=code&auth_type=rerequest&display=page"
    },
    {
      name: "Method 4: With State Parameter",
      url: "https://www.facebook.com/v18.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Fcallback&scope=pages_messaging%2Cinstagram_basic%2Cinstagram_manage_messages%2Cpages_show_list%2Cbusiness_management&response_type=code&auth_type=rerequest&display=popup&state=force_permissions_reset"
    }
  ];

  const manualSteps = [
    {
      title: "Go to Facebook Settings",
      description: "Visit Facebook Settings > Apps and Websites",
      action: "Click the link below",
      url: "https://www.facebook.com/settings?tab=applications"
    },
    {
      title: "Find AutoniqueAI App",
      description: "Look for 'AutoniqueAI' or any app with ID '2032087817551720'",
      action: "Click on the app name"
    },
    {
      title: "Remove All Permissions",
      description: "Click 'Remove' or 'Revoke Access' to completely disconnect the app",
      action: "This will reset ALL permissions"
    },
    {
      title: "Clear Browser Data",
      description: "Clear cookies and cache for facebook.com",
      action: "This ensures no cached permission data"
    },
    {
      title: "Try Login Again",
      description: "Return to AutoniqueAI and log in again",
      action: "Should now show ALL permission requests"
    }
  ];

  const tryMethod = (url: string) => {
    console.log('🚀 Trying force permission URL:', url);
    window.open(url, '_blank', 'width=600,height=700');
  };

  return (
    <>
      <Head>
        <title>Force Permissions Reset - AutoniqueAI</title>
        <meta name="description" content="Force Facebook to request all permissions" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔥 Nuclear Permission Reset
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Facebook is being stubborn about permissions. Let's force it to cooperate!
            </p>
          </motion.div>

          {/* Current Issue */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              🚨 Current Issue
            </h3>
            <p className="text-red-700 mb-4">
              Facebook is only granting: <code>pages_messaging, instagram_basic, instagram_manage_messages</code>
            </p>
            <p className="text-red-700">
              Missing: <code>pages_show_list, business_management</code>
            </p>
          </div>

          {/* Quick Fix Methods */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <RefreshCw className="h-6 w-6 mr-2 text-blue-600" />
              Quick Fix Methods
            </h2>
            
            <div className="grid gap-4">
              {forceUrls.map((method, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">
                        Opens in new window with special parameters
                      </p>
                    </div>
                    <button
                      onClick={() => tryMethod(method.url)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      Try This
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Reset Steps */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-orange-600" />
              Manual Reset (Nuclear Option)
            </h2>
            
            <div className="space-y-6">
              {manualSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-orange-600">{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {step.description}
                    </p>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 font-medium">
                        Action: {step.action}
                      </p>
                    </div>
                    
                    {step.url && (
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Open Facebook Settings
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Should Happen */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              What Should Happen After Reset
            </h3>
            <div className="space-y-2 text-green-800">
              <p>✅ Facebook should show ALL permission requests</p>
              <p>✅ You should see requests for "Manage Pages" and "Business Management"</p>
              <p>✅ Backend logs should show all 5 permissions granted</p>
              <p>✅ You should see your Facebook pages listed</p>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔍 Debug Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700 font-mono">
              <p><strong>App ID:</strong> 2032087817551720</p>
              <p><strong>Required Scope:</strong> pages_messaging,instagram_basic,instagram_manage_messages,pages_show_list,business_management</p>
              <p><strong>Redirect URI:</strong> https://autonique.in/auth/callback</p>
              <p><strong>API Version:</strong> v18.0</p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <a href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
