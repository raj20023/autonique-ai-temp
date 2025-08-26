import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Instagram, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/utils/api';
import { setAuthToken } from '@/utils/auth';
import toast from 'react-hot-toast';

export default function CallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'setup_required' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your Instagram account...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code, error, error_description } = router.query;

        if (error) {
          setStatus('error');
          setMessage(error_description as string || 'Authentication failed');
          return;
        }

        if (!code) {
          return; // Still loading
        }

        setMessage('Exchanging authorization code...');

        const redirectUri = 'https://autonique.in/auth/callback';
        const response = await authApi.handleCallback(code as string, redirectUri);

        setMessage('Setting up your account...');

        // Store the token
        setAuthToken(response.data.access_token);

        // Check if setup is required (no Facebook pages)
        const responseData = response.data as any;
        if (responseData.setup_required) {
          setStatus('setup_required');
          setMessage(responseData.message || 'Please complete your Instagram Business account setup.');

          // Redirect to setup guide after a short delay
          setTimeout(() => {
            router.push('/setup-guide');
          }, 3000);
        } else {
          setStatus('success');
          setMessage('Successfully connected! Redirecting to dashboard...');

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }

      } catch (error: any) {
        setStatus('error');

        let errorMessage = 'Failed to connect your Instagram account. Please try again.';

        if (error.message?.includes('CORS')) {
          errorMessage = 'Server configuration error. Please contact support.';
        } else if (error.response?.status === 400) {
          errorMessage = error.response?.data?.detail || 'Invalid authorization code. Please try logging in again.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
          errorMessage = 'Cannot connect to server. Please try again later.';
        }

        setMessage(errorMessage);
        toast.error('Authentication failed');
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router]);

  const handleRetry = () => {
    router.push('/auth/login');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Connecting Account - AutoniqueAI</title>
        <meta name="description" content="Connecting your Instagram Business account..." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            {/* Header */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Instagram className="h-8 w-8 text-instagram-500" />
              <span className="text-2xl font-bold text-gradient">AutoniqueAI</span>
            </div>

            {/* Status Icon */}
            <div className="mb-6">
              {status === 'loading' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto"
                >
                  <Loader2 className="w-16 h-16 text-primary-600" />
                </motion.div>
              )}
              
              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
              )}

              {status === 'setup_required' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center"
                >
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </motion.div>
              )}
              
              {status === 'error' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center"
                >
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </motion.div>
              )}
            </div>

            {/* Status Message */}
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              {status === 'loading' && 'Connecting Your Account'}
              {status === 'success' && 'Successfully Connected!'}
              {status === 'setup_required' && 'Setup Required'}
              {status === 'error' && 'Connection Failed'}
            </h1>

            <p className="text-gray-600 mb-8">
              {message}
            </p>

            {/* Action Buttons */}
            {status === 'error' && (
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full btn-primary"
                >
                  Try Again
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full btn-secondary"
                >
                  Go Home
                </button>
              </div>
            )}

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  🎉 Your Instagram Business account is now connected!
                  You can start uploading FAQs and automating your customer service.
                </p>
              </div>
            )}

            {status === 'setup_required' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  📋 You need to set up your Facebook Page and Instagram Business account first.
                  We'll guide you through the process step by step.
                </p>
              </div>
            )}

            {status === 'loading' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Please wait while we set up your account and connect to your Instagram Business profile...
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
