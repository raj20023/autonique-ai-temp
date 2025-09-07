import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Instagram, ArrowLeft, Shield, Zap, MessageCircle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
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
          <div className="max-w-md w-full">
            {/* Back Button */}
            <motion.button
              onClick={goBack}
              className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-all duration-200 group"
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to home</span>
            </motion.button>

            {/* Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10"
            >
              {/* Logo & Header */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mb-6"
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 leading-tight">
                    Connect Your{' '}
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      Instagram Business
                    </span>
                  </h1>
                  <p className="text-lg text-neutral-600 leading-relaxed">
                    Securely connect your Instagram Business account to start automating customer service with AI-powered responses
                  </p>
                </motion.div>
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="space-y-4 mb-10"
              >
                {[
                  { icon: Shield, text: "Bank-grade security with OAuth", color: "green" },
                  { icon: Zap, text: "Setup complete in under 60 seconds", color: "blue" },
                  { icon: MessageCircle, text: "Instant AI-powered auto-replies", color: "purple" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-4 p-3 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                  >
                    <div className={`w-10 h-10 bg-${feature.color}-100 rounded-xl flex items-center justify-center shadow-sm`}>
                      <feature.icon className={`h-5 w-5 text-${feature.color}-600`} />
                    </div>
                    <span className="font-medium text-neutral-700">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mb-6"
              >
                <motion.button
                  onClick={handleFacebookLogin}
                  className="group relative w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Instagram className="h-6 w-6" />
                  <span>Continue with Instagram Business</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
                </motion.button>
              </motion.div>


              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="flex items-center justify-center space-x-3 text-neutral-600 bg-neutral-50/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-neutral-200/50"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">14-day free trial • No credit card required</span>
              </motion.div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="text-xs text-neutral-500 text-center mt-6 leading-relaxed"
              >
                By continuing, you agree to our{' '}
                <a href="/terms" target="_blank" className="text-orange-600 hover:text-orange-700 underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-orange-600 hover:text-orange-700 underline font-medium">
                  Privacy Policy
                </a>.
                <br />We only access the data necessary to provide our service.
              </motion.p>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              className="mt-10 text-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[
                      'bg-gradient-to-r from-blue-500 to-blue-600',
                      'bg-gradient-to-r from-green-500 to-green-600',
                      'bg-gradient-to-r from-purple-500 to-purple-600',
                      'bg-gradient-to-r from-pink-500 to-pink-600'
                    ].map((bg, i) => (
                      <motion.div
                        key={i}
                        className={`w-8 h-8 ${bg} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.9 + i * 0.1, type: "spring", stiffness: 200 }}
                      >
                        {String.fromCharCode(65 + i)}
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">1000+ businesses trust us</span>
                </div>

                <div className="flex items-center justify-center space-x-8 text-xs font-semibold text-neutral-400">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>FACEBOOK APPROVED</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>SOC 2 COMPLIANT</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>GDPR READY</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
