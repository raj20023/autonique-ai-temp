import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Instagram, CheckCircle, AlertCircle, Loader2, ArrowRight, Home, RefreshCw, Sparkles } from 'lucide-react';
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
          const detail = error.response?.data?.detail || '';
          if (detail.includes('permissions') || detail.includes('Missing')) {
            errorMessage = 'Missing required permissions. Please reset your Facebook app permissions and try again.';
            // Show permission reset link after a delay
            setTimeout(() => {
              router.push('/permission-reset');
            }, 3000);
          } else {
            errorMessage = detail || 'Invalid authorization code. Please try logging in again.';
          }
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

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50/30 to-orange-100/50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/10 to-orange-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-300/10 to-orange-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
              x: [0, -30, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-6">
          <div className="max-w-lg w-full">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 text-center"
            >
              {/* Logo Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                <div className="inline-block relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl scale-110"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                    <img
                      src="/logos/logo_icon.png"
                      alt="AutoniqueAI"
                      className="h-12 w-12 mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Status Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                {status === 'loading' && (
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 mx-auto"
                    >
                      <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full"></div>
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Instagram className="w-8 h-8 text-orange-500" />
                    </motion.div>
                  </div>
                )}

                {status === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: 3 }}
                      className="absolute inset-0 bg-green-400/30 rounded-full blur-xl"
                    />
                  </motion.div>
                )}

                {status === 'setup_required' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <AlertCircle className="w-10 h-10 text-white" />
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <AlertCircle className="w-10 h-10 text-white" />
                  </motion.div>
                )}
              </motion.div>

              {/* Status Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                  {status === 'loading' && 'Connecting Your Account'}
                  {status === 'success' && (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Successfully Connected!</span>
                      <Sparkles className="h-6 w-6 text-orange-500" />
                    </span>
                  )}
                  {status === 'setup_required' && 'Setup Required'}
                  {status === 'error' && 'Connection Failed'}
                </h1>

                <p className="text-lg text-neutral-600 leading-relaxed max-w-md mx-auto">
                  {message}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                {status === 'error' && (
                  <div className="space-y-4">
                    <motion.button
                      onClick={handleRetry}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span>Try Again</span>
                    </motion.button>
                    <motion.button
                      onClick={handleGoHome}
                      className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Home className="h-5 w-5" />
                      <span>Go Home</span>
                    </motion.button>
                  </div>
                )}

                {status === 'success' && (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-green-900 mb-2">🎉 Account Connected Successfully!</h3>
                        <p className="text-sm text-green-800 leading-relaxed">
                          Your Instagram Business account is now connected. You can start creating FAQs and automating your customer service with AI-powered responses.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'setup_required' && (
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-orange-900 mb-2">📋 Setup Required</h3>
                        <p className="text-sm text-orange-800 leading-relaxed">
                          You need to set up your Facebook Page and Instagram Business account first. We'll guide you through the process step by step.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'loading' && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full flex-shrink-0 mt-1"
                      />
                      <div className="text-left">
                        <h3 className="font-semibold text-blue-900 mb-2">Setting Up Your Account</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          Please wait while we securely connect to your Instagram Business profile and configure your automation settings...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
