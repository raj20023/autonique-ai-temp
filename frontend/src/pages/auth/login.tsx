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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Epic Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Cosmic Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
              x: [0, 80, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-400/25 to-blue-400/25 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.6, 0.2],
              x: [0, -60, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Neural Network Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

          {/* Floating Particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-6 z-10">
          <div className="max-w-lg w-full">
            {/* Epic Back Button */}
            <motion.button
              onClick={goBack}
              className="flex items-center space-x-3 text-white/80 hover:text-white mb-12 transition-all duration-300 group backdrop-blur-xl bg-white/5 px-6 py-3 rounded-2xl border border-white/10"
              whileHover={{ x: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform duration-300" />
              <span className="font-semibold">Back to Neural Hub</span>
            </motion.button>

            {/* Revolutionary Main Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group"
            >
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

              {/* Main Card */}
              <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-10 md:p-12">
                {/* Holographic Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                {/* Epic Logo & Header */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-8"
                  >
                    <div className="inline-block relative">
                      {/* Holographic Glow */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-cyan-500/40 rounded-3xl blur-2xl scale-125"
                        animate={{
                          scale: [1.2, 1.4, 1.2],
                          opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      {/* Logo Container */}
                      <motion.div
                        className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-2xl border border-white/20"
                        animate={{
                          y: [0, -10, 0],
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
                          className="h-16 w-16 mx-auto filter drop-shadow-2xl"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />

                        {/* Rotating Ring */}
                        <motion.div
                          className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                        Connect Your
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        Instagram Empire
                      </span>
                    </h1>
                    <p className="text-xl text-white/80 leading-relaxed max-w-md mx-auto">
                      Securely link your Instagram Business to our <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-bold">Neural AI Network</span> and revolutionize customer engagement
                    </p>
                  </motion.div>
                </div>

                {/* Revolutionary Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="space-y-6 mb-12"
                >
                  {[
                    {
                      icon: Shield,
                      text: "Military-Grade Quantum Security",
                      gradient: "from-emerald-500 to-teal-500",
                      description: "Zero-trust OAuth with quantum encryption"
                    },
                    {
                      icon: Zap,
                      text: "Lightning Neural Setup",
                      gradient: "from-yellow-500 to-orange-500",
                      description: "AI-powered onboarding in 30 seconds"
                    },
                    {
                      icon: MessageCircle,
                      text: "Instant AI Consciousness",
                      gradient: "from-purple-500 to-pink-500",
                      description: "99.7% accuracy with sub-second responses"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                      className="group relative"
                      whileHover={{ x: 10, scale: 1.02 }}
                    >
                      {/* Glowing Background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                      <div className="relative flex items-center space-x-5 p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                        <motion.div
                          className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                          animate={{
                            rotate: [0, 5, 0, -5, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.5
                          }}
                        >
                          <feature.icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                            {feature.text}
                          </h3>
                          <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Epic CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="mb-8"
                >
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Epic Glowing Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.6, 0.8, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <button
                      onClick={handleFacebookLogin}
                      className="relative w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-black text-xl py-6 rounded-3xl transition-all duration-300 shadow-2xl flex items-center justify-center space-x-4 border-2 border-white/20 group-hover:border-white/40"
                    >
                      <Instagram className="h-8 w-8" />
                      <span>Launch Instagram Empire</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-7 w-7" />
                      </motion.div>
                    </button>
                  </motion.div>
                </motion.div>

                {/* Futuristic Trust Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="flex items-center justify-center space-x-4 text-white/90 backdrop-blur-xl bg-white/10 px-8 py-4 rounded-2xl border border-white/20 shadow-xl"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  <span className="font-semibold">14-day quantum trial • Zero risk • Instant activation</span>
                </motion.div>

                {/* Epic Disclaimer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.6 }}
                  className="text-sm text-white/60 text-center mt-8 leading-relaxed"
                >
                  By continuing, you agree to our{' '}
                  <a href="/terms" target="_blank" className="text-cyan-400 hover:text-cyan-300 underline font-semibold transition-colors">
                    Neural Terms
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" target="_blank" className="text-purple-400 hover:text-purple-300 underline font-semibold transition-colors">
                    Quantum Privacy
                  </a>.
                  <br />We only access essential data to power your AI revolution.
                </motion.p>
              </div>
            </motion.div>

            {/* Epic Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.2 }}
              className="mt-16 text-center"
            >
              <div className="flex flex-col items-center space-y-8">
                {/* AI Pioneers */}
                <div className="flex items-center space-x-6">
                  <div className="flex -space-x-4">
                    {[
                      'from-purple-500 to-pink-500',
                      'from-cyan-500 to-blue-500',
                      'from-emerald-500 to-teal-500',
                      'from-orange-500 to-red-500'
                    ].map((gradient, i) => (
                      <motion.div
                        key={i}
                        className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-full border-3 border-white/20 flex items-center justify-center text-white text-sm font-bold shadow-2xl backdrop-blur-xl`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 2.4 + i * 0.15, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.2, y: -5 }}
                      >
                        {String.fromCharCode(65 + i)}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg text-white">10,000+ AI Pioneers</p>
                    <p className="text-white/60 text-sm">revolutionizing Instagram</p>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="grid grid-cols-3 gap-6 text-xs font-bold text-white/60">
                  <motion.div
                    className="flex flex-col items-center space-y-2 backdrop-blur-xl bg-white/5 p-4 rounded-2xl border border-white/10"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.8, duration: 0.6 }}
                  >
                    <Shield className="h-6 w-6 text-emerald-400" />
                    <span>QUANTUM SECURED</span>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center space-y-2 backdrop-blur-xl bg-white/5 p-4 rounded-2xl border border-white/10"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 0.6 }}
                  >
                    <Sparkles className="h-6 w-6 text-purple-400" />
                    <span>AI CERTIFIED</span>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center space-y-2 backdrop-blur-xl bg-white/5 p-4 rounded-2xl border border-white/10"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.2, duration: 0.6 }}
                  >
                    <CheckCircle className="h-6 w-6 text-cyan-400" />
                    <span>NEURAL READY</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
