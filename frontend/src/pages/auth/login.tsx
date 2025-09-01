import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Instagram, ArrowLeft, Shield, Zap, MessageCircle } from 'lucide-react';
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

  const handleInstagramLogin = () => {
    // For now, use the same Facebook login flow
    handleFacebookLogin();
  };

  const handleFacebookLogin = () => {
    try {
      const redirectUri = getRedirectUri();
      const loginUrl = buildFacebookOAuthUrl(redirectUri);

      window.location.href = loginUrl;
    } catch (error) {
      console.error('Failed to build OAuth URL:', error);

      // Fallback to hardcoded URL with minimal required permissions
      const fallbackUrl = 'https://www.facebook.com/v23.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Fcallback&scope=pages_messaging%2Cinstagram_basic%2Cinstagram_manage_messages&response_type=code&auth_type=rerequest&display=popup';

      window.location.href = fallbackUrl;
    }
  };



  const goBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Login - AutoniqueAI</title>
        <meta name="description" content="Connect your Instagram Business account to start automating your DMs" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <button
            onClick={goBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </button>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Instagram className="h-8 w-8 text-instagram-500" />
                <span className="text-2xl font-bold text-gradient">AutoniqueAI</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Your Instagram Business
              </h1>
              <p className="text-gray-600">
                Securely connect your Instagram Business account to start automating your customer service
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">Secure OAuth authentication</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Instant setup in under 2 minutes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700">Auto-reply to DMs immediately</span>
              </div>
            </div>

            {/* Primary Instagram Login Button */}
            <button
              onClick={handleInstagramLogin}
              className="w-full btn-instagram text-lg py-4 flex items-center justify-center space-x-3 mb-3"
            >
              <Instagram className="h-5 w-5" />
              <span>Continue with Instagram Business</span>
            </button>

            {/* Alternative Facebook Login */}
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">or</span>
            </div>

            <button
              onClick={handleFacebookLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook Pages</span>
            </button>



            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our{' '}
              <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </a>.
              We only access the data necessary to provide our service.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500 mb-4">Trusted by 10,000+ businesses</p>
            <div className="flex items-center justify-center space-x-6 opacity-60">
              <div className="text-xs font-semibold text-gray-400">FACEBOOK APPROVED</div>
              <div className="text-xs font-semibold text-gray-400">SOC 2 COMPLIANT</div>
              <div className="text-xs font-semibold text-gray-400">GDPR READY</div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
