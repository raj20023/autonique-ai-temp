import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ExternalLink,
  Instagram,
  Facebook,
  ArrowRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface SetupStep {
  step: number;
  title: string;
  description: string;
  url: string;
}

interface SetupGuide {
  title: string;
  message: string;
  steps: SetupStep[];
  help_links: Array<{
    title: string;
    url: string;
  }>;
}

export default function SetupGuidePage() {
  const [setupGuide, setSetupGuide] = useState<SetupGuide | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    fetchSetupGuide();
  }, []);

  const fetchSetupGuide = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/setup-guide');
      const data = await response.json();
      setSetupGuide(data);
    } catch (error) {
      console.error('Error fetching setup guide:', error);
    }
  };

  const toggleStepCompletion = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(s => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const allStepsCompleted = setupGuide?.steps.length === completedSteps.length;

  if (!setupGuide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Setup Guide - AutoniqueAI</title>
        <meta name="description" content="Set up your Instagram Business account for AutoniqueAI" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-orange-100 p-4 rounded-full">
                <AlertCircle className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {setupGuide.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {setupGuide.message}
            </p>
          </motion.div>

          {/* Setup Steps */}
          <div className="space-y-6 mb-12">
            {setupGuide.steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                  completedSteps.includes(step.step)
                    ? 'border-green-500 bg-green-50'
                    : 'border-blue-500'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleStepCompletion(step.step)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        completedSteps.includes(step.step)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-blue-500'
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
                    
                    {step.url.startsWith('http') ? (
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Open Guide
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    ) : (
                      <Link href={step.url}>
                        <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                          Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Completion Section */}
          {allStepsCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-8"
            >
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Setup Complete!
              </h3>
              <p className="text-green-700 mb-4">
                Great! Now you can log in to AutoniqueAI to connect your Instagram Business account.
              </p>
              <Link href="/auth/login">
                <span className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Log In Again
                </span>
              </Link>
            </motion.div>
          )}

          {/* Help Links */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="space-y-3">
              {setupGuide.help_links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
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
