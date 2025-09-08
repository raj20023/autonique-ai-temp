import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  BarChart3,
  Instagram,
  ArrowRight,
  CheckCircle,
  Brain,
  Menu,
  Star,
  Sparkles,
  Play,
  Users,
  TrendingUp,
  Globe,
  Target,
  Cpu
} from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import Button from '@/components/ui/Button';
import AnimatedContainer, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedContainer';

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'Neural AI Technology',
    description: 'Advanced neural networks that understand context, emotion, and intent for human-like conversations',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    glowColor: 'shadow-purple-500/25'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Quantum-Speed Processing',
    description: 'Lightning-fast AI responses in milliseconds with quantum-inspired processing algorithms',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    glowColor: 'shadow-yellow-500/25'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Military-Grade Security',
    description: 'Bank-level encryption with zero-trust architecture and quantum-resistant cryptography',
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    glowColor: 'shadow-green-500/25'
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Predictive Analytics',
    description: 'AI-powered insights that predict customer behavior and optimize engagement strategies',
    gradient: 'from-blue-400 via-purple-500 to-pink-500',
    glowColor: 'shadow-blue-500/25'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Global AI Network',
    description: 'Distributed AI nodes across 50+ countries for ultra-low latency worldwide coverage',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    glowColor: 'shadow-cyan-500/25'
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Precision Targeting',
    description: 'Laser-focused customer segmentation with 99.7% accuracy using advanced ML algorithms',
    gradient: 'from-pink-400 via-red-500 to-orange-500',
    glowColor: 'shadow-pink-500/25'
  }
];

const benefits = [
  'Save 10+ hours weekly on customer service',
  'Increase response rate by 300%',
  'Improve customer satisfaction scores',
  'Scale your business without hiring',
  'Never miss a potential sale',
  'Maintain consistent brand voice'
];

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <Head>
        <title>AutoniqueAI - AI-Powered Instagram Customer Service Automation</title>
        <meta name="description" content="Transform your Instagram customer service with Neural AI Technology. Save 10+ hours weekly while providing instant, intelligent responses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-400/25 to-teal-400/25 rounded-full blur-3xl"
            animate={{
              x: [0, 120, 0],
              y: [0, -40, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />

          {/* Neural Network Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            {[...Array(15)].map((_, i) => (
              <motion.line
                key={i}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        </div>

        {/* Header */}
        <motion.header
          className="relative z-50 backdrop-blur-xl bg-white/10 border-b border-white/20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/logos/full_logo_dark_theam.png"
                  alt="AutoniqueAI"
                  className="h-10 w-auto filter drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/logos/logo_icon.png";
                    e.currentTarget.className = "h-10 w-10 filter drop-shadow-lg";
                  }}
                />
              </motion.div>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="#benefits" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                  Benefits
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="#pricing" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                  Pricing
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                  >
                    Start Free Trial
                  </Button>
                </motion.div>
              </div>

              <motion.button
                className="md:hidden p-2 text-white/90 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </div>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <section className="relative py-32 lg:py-48">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center">
              {/* Floating Logo with Holographic Effect */}
              <AnimatedContainer
                animation="neuralPulse"
                className="mb-16"
                delay={0.2}
              >
                <motion.div
                  className="inline-block relative"
                  animate={{
                    y: [0, -20, 0],
                    rotateY: [0, 360],
                  }}
                  transition={{
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { duration: 20, repeat: Infinity, ease: "linear" }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl blur-2xl scale-110 opacity-60 animate-pulse"></div>
                  <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <img
                      src="/logos/logo_icon.png"
                      alt="AutoniqueAI"
                      className="h-24 w-24 mx-auto filter drop-shadow-2xl"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {/* Holographic Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </AnimatedContainer>

              {/* Mind-Blowing Headline */}
              <AnimatedContainer
                animation="morphGlow"
                delay={0.4}
                className="mb-8"
              >
                <motion.h1
                  className="text-5xl lg:text-8xl font-black mb-6 leading-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    Transform Your
                  </span>
                  <br />
                  <motion.span
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Instagram Empire
                  </motion.span>
                </motion.h1>
              </AnimatedContainer>

              {/* Futuristic Subtitle */}
              <AnimatedContainer
                animation="morphGlow"
                delay={0.6}
                className="mb-16"
              >
                <motion.p
                  className="text-xl lg:text-2xl text-white/80 mb-4 max-w-4xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  Harness the power of <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-bold">Neural AI Technology</span>
                  <br />
                  Save 10+ hours weekly while providing <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-bold">quantum-speed responses</span>
                </motion.p>
              </AnimatedContainer>

              {/* Revolutionary CTA Buttons */}
              <StaggerContainer
                stagger={0.2}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
              >
                <StaggerItem>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Button
                      onClick={handleGetStarted}
                      className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center space-x-3 shadow-2xl border border-white/20"
                    >
                      <Instagram className="h-6 w-6" />
                      <span>Start AI Revolution</span>
                      <Sparkles className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </StaggerItem>

                <StaggerItem>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <Button
                      className="relative backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center space-x-3 border border-white/30 shadow-2xl"
                    >
                      <Play className="h-6 w-6" />
                      <span>Watch Neural Demo</span>
                    </Button>
                  </motion.div>
                </StaggerItem>
              </StaggerContainer>

              {/* Futuristic Trust Badge */}
              <motion.div
                className="flex items-center justify-center space-x-3 text-white/90 backdrop-blur-xl bg-white/10 px-8 py-4 rounded-2xl border border-white/20 shadow-2xl inline-flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <CheckCircle className="h-6 w-6 text-emerald-400" />
                <span className="font-semibold">14-day quantum trial • Zero risk • Instant activation</span>
              </motion.div>

              {/* Epic Social Proof */}
              <motion.div
                className="mt-20 flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-16 text-white/80"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
              >
                <div className="flex items-center space-x-6">
                  <div className="flex -space-x-4">
                    {[
                      'from-purple-500 to-pink-500',
                      'from-blue-500 to-cyan-500',
                      'from-emerald-500 to-teal-500',
                      'from-orange-500 to-red-500'
                    ].map((gradient, i) => (
                      <motion.div
                        key={i}
                        className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-full border-4 border-white/20 flex items-center justify-center text-white text-lg font-bold shadow-2xl backdrop-blur-xl`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1.6 + i * 0.1, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.1, y: -5 }}
                      >
                        {String.fromCharCode(65 + i)}
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-xl text-white">10,000+ AI Pioneers</p>
                    <p className="text-white/60">revolutionizing customer service</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-6 h-6"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1.8 + i * 0.1, type: "spring", stiffness: 200 }}
                      >
                        <Star className="w-6 h-6 text-yellow-400 fill-current drop-shadow-lg" />
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-xl text-white">4.98/5 Quantum Rating</p>
                    <p className="text-white/60">from 50,000+ neural reviews</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Revolutionary Features Section */}
        <section id="features" className="py-32 bg-gradient-to-b from-slate-900 via-gray-900 to-black relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <AnimatedContainer
              animation="morphGlow"
              className="text-center mb-20"
            >
              <motion.h2
                className="text-5xl lg:text-7xl font-black mb-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Revolutionary
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Arsenal
                </span>
              </motion.h2>
              <motion.p
                className="text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Unleash the most advanced AI technologies ever created for Instagram automation
              </motion.p>
            </AnimatedContainer>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.15}>
              {features.map((feature, index) => (
                <StaggerItem key={feature.title}>
                  <motion.div
                    className="group relative"
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Glowing Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>

                    {/* Card */}
                    <div className="relative backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl group-hover:border-white/20 transition-all duration-500">
                      {/* Floating Icon */}
                      <motion.div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 shadow-lg ${feature.glowColor} group-hover:shadow-2xl`}
                        animate={{
                          y: [0, -5, 0],
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                      >
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                        {feature.description}
                      </p>

                      {/* Holographic Border */}
                      <motion.div
                        className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(45deg, transparent, transparent), linear-gradient(45deg, ${feature.gradient.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').join(', ')})`,
                          backgroundClip: 'padding-box, border-box',
                          backgroundOrigin: 'padding-box, border-box',
                        }}
                      />
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Mind-Blowing Benefits Section */}
        <section id="benefits" className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-cyan-400/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <motion.h2
                  className="text-5xl lg:text-6xl font-black mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Why Choose
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    AutoniqueAI?
                  </span>
                </motion.h2>

                <motion.p
                  className="text-xl text-white/80 mb-12 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Join <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-bold">10,000+ visionary businesses</span> already revolutionizing their customer experience
                </motion.p>

                <StaggerContainer className="space-y-6" stagger={0.1}>
                  {benefits.map((benefit, index) => (
                    <StaggerItem key={benefit}>
                      <motion.div
                        className="flex items-center space-x-4 group"
                        whileHover={{ x: 10, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="flex-shrink-0"
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }
                          }}
                        >
                          <CheckCircle className="h-8 w-8 text-emerald-400 drop-shadow-lg group-hover:text-emerald-300 transition-colors" />
                        </motion.div>
                        <span className="text-white font-semibold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                          {benefit}
                        </span>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {/* Holographic Demo Card */}
                <motion.div
                  className="relative backdrop-blur-2xl bg-white/10 p-10 rounded-3xl border border-white/20 shadow-2xl"
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glowing Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>

                  <div className="relative text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-8 shadow-2xl"
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Play className="h-10 w-10 text-white" />
                    </motion.div>

                    <h3 className="text-3xl font-bold text-white mb-6">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Neural AI in Action
                      </span>
                    </h3>

                    <p className="text-white/80 mb-8 text-lg leading-relaxed">
                      Watch our quantum AI seamlessly handle customer inquiries with <span className="text-cyan-400 font-bold">99.7% accuracy</span> and <span className="text-emerald-400 font-bold">sub-second response times</span>
                    </p>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/25">
                        Experience the Future
                      </Button>
                    </motion.div>
                  </div>

                  {/* Holographic Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-purple-400/50 via-pink-400/50 to-cyan-400/50"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      background: 'linear-gradient(45deg, transparent, transparent), linear-gradient(45deg, #a855f7, #ec4899, #06b6d4)',
                      backgroundClip: 'padding-box, border-box',
                      backgroundOrigin: 'padding-box, border-box',
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Epic Final CTA Section */}
        <section className="py-32 bg-gradient-to-r from-black via-purple-900 to-black relative overflow-hidden">
          {/* Cosmic Background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            {/* Floating Particles */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
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
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <motion.h2
              className="text-6xl lg:text-8xl font-black mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Ready to
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Dominate?
              </span>
            </motion.h2>

            <motion.p
              className="text-2xl text-white/80 mb-16 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Join <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-bold">10,000+ AI pioneers</span> already saving 10+ hours weekly with quantum automation
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Button
                  onClick={handleGetStarted}
                  className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 rounded-3xl font-black text-xl flex items-center space-x-4 shadow-2xl border-2 border-white/20"
                >
                  <Instagram className="h-8 w-8" />
                  <span>Launch AI Empire</span>
                  <ArrowRight className="h-8 w-8" />
                </Button>
              </motion.div>

              <motion.div
                className="text-white/60 text-lg flex items-center space-x-3"
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <span>Quantum setup in 90 seconds • Zero risk • Infinite potential</span>
              </motion.div>
            </motion.div>

            {/* Final Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              viewport={{ once: true }}
            >
              {[
                { number: "10,000+", label: "AI Pioneers", icon: <Users className="h-8 w-8" /> },
                { number: "99.7%", label: "Success Rate", icon: <TrendingUp className="h-8 w-8" /> },
                { number: "24/7", label: "Quantum Support", icon: <Cpu className="h-8 w-8" /> }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center">
                    <div className="text-purple-400 mb-2 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{stat.number}</div>
                    <div className="text-white/60">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Futuristic Footer */}
        <footer className="bg-black border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                className="mb-8"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/logos/full_logo_dark_theam.png"
                  alt="AutoniqueAI"
                  className="h-12 w-auto mx-auto filter drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/logos/logo_icon.png";
                    e.currentTarget.className = "h-12 w-12 mx-auto filter drop-shadow-lg";
                  }}
                />
              </motion.div>
              <p className="text-white/40 text-lg">
                © 2024 AutoniqueAI. Revolutionizing the future of customer service.
              </p>
              <motion.div
                className="mt-4 text-white/20 text-sm"
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Powered by Neural AI Technology • Built for the Future
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
