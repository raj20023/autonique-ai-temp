import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface PermissionGuide {
  title: string;
  message: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    url?: string;
    action?: string;
  }>;
  alternative_method: {
    title: string;
    description: string;
    url: string;
  };
  required_permissions: string[];
}

export default function PermissionResetPage() {
  const [guide, setGuide] = useState<PermissionGuide | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    fetchPermissionGuide();
  }, []);

  const fetchPermissionGuide = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/permission-reset-guide`);
      const data = await response.json();
      setGuide(data);
    } catch (error) {
      console.error('Error fetching permission guide:', error);
    }
  };

  const toggleStepCompletion = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(s => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const handleReauthorize = () => {
    if (guide?.alternative_method?.url) {
      window.location.href = guide.alternative_method.url;
    }
  };

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Permissions - AutoniqueAI</title>
        <meta name="description" content="Reset Facebook permissions for AutoniqueAI" />
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
                <Shield className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {guide.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {guide.message}
            </p>
          </motion.div>

          {/* Quick Fix Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {guide.alternative_method.title}
              </h3>
              <p className="text-blue-700 mb-4">
                {guide.alternative_method.description}
              </p>
              <button
                onClick={handleReauthorize}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Re-authorize with New Permissions
              </button>
            </div>
          </motion.div>

          {/* Manual Steps */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Manual Reset Steps
            </h2>
            
            <div className="space-y-6">
              {guide.steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                    completedSteps.includes(step.step)
                      ? 'border-green-500 bg-green-50'
                      : 'border-orange-500'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => toggleStepCompletion(step.step)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          completedSteps.includes(step.step)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-orange-500'
                        }`}
                      >
                        {completedSteps.includes(step.step) ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-semibold">{step.step}</span>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      
                      {step.action && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <p className="text-yellow-800 font-medium">
                            Action: {step.action}
                          </p>
                        </div>
                      )}
                      
                      {step.url && (
                        <a
                          href={step.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Open Link
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      )}
                      
                      {step.url === "/auth/login" && (
                        <Link href="/auth/login">
                          <span className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                            Log In Again
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Required Permissions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Required Permissions
            </h3>
            <div className="space-y-2">
              {guide.required_permissions.map((permission, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/">
              <span className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">
                ← Back to Home
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
