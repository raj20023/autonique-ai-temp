import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, ArrowLeft, CheckCircle, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import { buildFacebookOAuthUrl, getRedirectUri } from '@/config/facebook';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleFacebookLogin = () => {
    try {
      const redirectUri = getRedirectUri();
      const loginUrl = buildFacebookOAuthUrl(redirectUri);

      window.location.href = loginUrl;
    } catch (error) {
      console.error('Failed to build OAuth URL:', error);

      // Fallback to hardcoded URL with required permissions (removed pages_read_engagement)
      const fallbackUrl = 'https://www.facebook.com/v23.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Fcallback&scope=pages_messaging%2Cinstagram_basic%2Cinstagram_manage_messages%2Cpages_show_list%2Cbusiness_management%2Cpages_manage_metadata&response_type=code&auth_type=rerequest&display=popup';

      window.location.href = fallbackUrl;
    }
  };

  const goBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Connect Instagram Business - AutoniqueAI</title>
        <meta name="description" content="Connect your Instagram Business account to start automating your DMs with AI-powered responses" />
        <link rel="icon" href="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-6 z-10">
          <div className="max-w-md w-full">
            {/* Back Button */}
            <motion.button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8 transition-all duration-300"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </motion.button>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6"
                >
                  <img
                    src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg"
                    alt="AutoniqueAI"
                    className="h-12 w-12 mx-auto mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Connect Your Instagram Business
                  </h1>
                  <p className="text-gray-600">
                    Link your Instagram Business account to start automating your DMs with AI-powered responses
                  </p>
                </motion.div>
              </div>

              {/* Setup Guide Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-6"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-2">
                        New to AutoniqueAI? Learn how to set up your Instagram Business account first.
                      </p>
                      <Link 
                        href="/blog/setup-guide" 
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                      >
                        <span>Read the Complete Setup Guide</span>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Connect Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-6"
              >
                <button
                  onClick={handleFacebookLogin}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Connect Instagram Business</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center justify-center space-x-3 text-gray-600 bg-gray-50 px-6 py-3 rounded-lg border border-gray-200"
              >
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">14-day free trial • No credit card required</span>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-xs text-gray-500 text-center mt-6 leading-relaxed"
              >
                By continuing, you agree to our{' '}
                <a href="/terms" target="_blank" className="text-purple-600 hover:text-purple-700 underline transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-purple-600 hover:text-purple-700 underline transition-colors">
                  Privacy Policy
                </a>.
                <br />We only access data necessary to provide our service.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
