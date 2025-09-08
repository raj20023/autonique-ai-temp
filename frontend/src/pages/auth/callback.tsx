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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Epic Cosmic Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.7, 0.3],
              x: [0, 80, 0],
              y: [0, -60, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-400/25 to-blue-400/25 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.6, 0.2],
              x: [0, -70, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
              rotate: [0, 360]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating Particles */}
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -150, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-6 z-10">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group"
            >
              {/* Epic Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

              <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-12 md:p-16 text-center">
                {/* Epic Logo Header */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-12"
                >
                  <div className="inline-block relative">
                    {/* Holographic Glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-cyan-500/40 rounded-3xl blur-2xl scale-150"
                      animate={{
                        scale: [1.4, 1.6, 1.4],
                        opacity: [0.4, 0.8, 0.4],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Logo Container */}
                    <motion.div
                      className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20"
                      animate={{
                        y: [0, -15, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <img
                        src="/logos/logo_icon.png"
                        alt="AutoniqueAI"
                        className="h-20 w-20 mx-auto filter drop-shadow-2xl"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />

                      {/* Rotating Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Epic Status Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 200 }}
                  className="mb-12"
                >
                  {status === 'loading' && (
                    <div className="relative">
                      {/* Quantum Loading Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 mx-auto"
                      >
                        <div className="w-32 h-32 border-4 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full"
                             style={{
                               background: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)',
                               mask: 'radial-gradient(circle at center, transparent 70%, black 70%)',
                             }}
                        />
                      </motion.div>

                      {/* Pulsing Center */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                          <Instagram className="w-10 h-10 text-white" />
                        </div>
                      </motion.div>

                      {/* Floating Particles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                            marginLeft: '-4px',
                            marginTop: '-4px',
                          }}
                          animate={{
                            x: Math.cos(i * 45 * Math.PI / 180) * 60,
                            y: Math.sin(i * 45 * Math.PI / 180) * 60,
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {status === 'success' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
                      className="relative"
                    >
                      {/* Epic Success Explosion */}
                      <motion.div
                        className="w-32 h-32 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <CheckCircle className="w-16 h-16 text-white" />
                      </motion.div>

                      {/* Success Rings */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute inset-0 border-4 border-emerald-400/50 rounded-full"
                          animate={{
                            scale: [1, 2, 3],
                            opacity: [0.8, 0.4, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                          }}
                        />
                      ))}

                      {/* Sparkle Effects */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                          animate={{
                            x: Math.cos(i * 30 * Math.PI / 180) * (80 + Math.random() * 40),
                            y: Math.sin(i * 30 * Math.PI / 180) * (80 + Math.random() * 40),
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeOut"
                          }}
                        />
                      ))}
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
