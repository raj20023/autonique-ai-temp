import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Instagram, ArrowLeft, Shield, Zap, MessageCircle } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import { buildFacebookOAuthUrl, getRedirectUri } from '@/config/facebook';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleFacebookLogin = () => {
    try {
      const redirectUri = getRedirectUri();
      const loginUrl = buildFacebookOAuthUrl(redirectUri);
      console.log('🚀 Redirecting to:', loginUrl);
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Failed to build OAuth URL:', error);

      // Fallback to hardcoded URL if centralized config fails
      const fallbackUrl = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Fcallback&scope=pages_messaging%2Cinstagram_basic%2Cinstagram_manage_messages%2Cpages_show_list%2Cbusiness_management%2Cpages_manage_metadata&response_type=code&auth_type=rerequest&display=popup';
      console.log('🔄 Using fallback URL:', fallbackUrl);
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

            {/* Login Button */}
            <button
              onClick={handleFacebookLogin}
              className="w-full btn-instagram text-lg py-4 flex items-center justify-center space-x-3 mb-3"
            >
              <Instagram className="h-5 w-5" />
              <span>Continue with Instagram Business</span>
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
