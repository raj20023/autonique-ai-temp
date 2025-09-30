import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Shield,
  BarChart3,
  Instagram,
  ArrowRight,
  CheckCircle,
  Brain,
  Menu,
  X,
  Star,
  Sparkles,
  Play,
  Users,
  TrendingUp,
  Globe,
  Target,
  Cpu,
  Clock
} from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import Button from '@/components/ui/Button';
import AnimatedContainer, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedContainer';
import { AutoHero } from '@/components/ui/AutoMascot';

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'Smart AI Responses',
    description: 'AI that understands your customers and responds naturally to their questions',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    glowColor: 'shadow-purple-500/25'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Instant Replies',
    description: 'Respond to customer messages in seconds, even while you sleep',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    glowColor: 'shadow-yellow-500/25'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Secure & Private',
    description: 'Your data is encrypted and protected with enterprise-grade security',
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    glowColor: 'shadow-green-500/25'
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Track Performance',
    description: 'See how many messages you handle and track customer satisfaction',
    gradient: 'from-blue-400 via-purple-500 to-pink-500',
    glowColor: 'shadow-blue-500/25'
  },
  {
    icon: <Instagram className="h-8 w-8" />,
    title: 'Easy Instagram Setup',
    description: 'Connect your Instagram account in just a few clicks and start automating',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    glowColor: 'shadow-cyan-500/25'
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Custom Answers',
    description: 'Create your own FAQ library so AI answers exactly how you want',
    gradient: 'from-pink-400 via-red-500 to-orange-500',
    glowColor: 'shadow-pink-500/25'
  }
];

const benefits = [
  'Save 10+ hours every week on customer messages',
  'Reply to customers 3x faster',
  'Never miss a message, even at night',
  'Grow your business without hiring more staff',
  'Turn more conversations into sales',
  'Keep your brand voice consistent'
];

const demoVideos = [
  {
    id: 'main-demo',
    title: 'Complete Platform Demo',
    description: 'See how AutoniqueAI works from setup to automation',
    youtubeId: 'qxhFyY_hGF8',
    duration: '15:30',
    thumbnail: `https://img.youtube.com/vi/qxhFyY_hGF8/maxresdefault.jpg`
  },
  {
    id: 'mobile-demo',
    title: 'Mobile Experience',
    description: 'Watch how AutoniqueAI works on mobile devices',
    youtubeId: 'f7gC1Qog-Dc',
    duration: '1:00',
    thumbnail: `https://img.youtube.com/vi/f7gC1Qog-Dc/maxresdefault.jpg`
  }
];

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const openVideo = (youtubeId: string) => {
    setSelectedVideo(youtubeId);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <Head>
        <title>AutoniqueAI - AI-Powered Instagram Customer Service Automation</title>
        <meta name="description" content="Transform your Instagram customer service with AutoniqueAI. Save 10+ hours weekly while providing instant, intelligent responses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg" type="image/svg+xml" />
      </Head>

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at center, #13132b 0%, #0f0f25 50%, #13132b 100%)`,
        }}
      >


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
                  src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/header_dark_background.svg"
                  alt="AutoniqueAI"
                  className="h-10 w-auto filter drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg";
                    e.currentTarget.className = "h-10 w-10 filter drop-shadow-lg";
                  }}
                />
              </motion.div>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/demo" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                  Demo
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="#benefits" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                  Benefits
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/pricing" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                  Pricing
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/auth/login">
                      <Button
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold border border-white/30 backdrop-blur-xl transition-all duration-300"
                      >
                        Login
                      </Button>
                    </Link>
                  </motion.div>
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
              </div>

              <motion.button
                className="md:hidden p-2 text-white/90 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
            </div>
          </nav>
        </motion.header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-80 max-w-[85vw] backdrop-blur-xl bg-white/10 border-l border-white/20 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                  <img
                    src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/header_dark_background.svg"
                    alt="AutoniqueAI"
                    className="h-8 w-auto filter drop-shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg";
                      e.currentTarget.className = "h-8 w-8 filter drop-shadow-lg";
                    }}
                  />
                  <motion.button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="p-6 space-y-4">
                  {[
                    { href: "#features", label: "Features" },
                    { href: "/demo", label: "Demo" },
                    { href: "#benefits", label: "Benefits" },
                    { href: "/pricing", label: "Pricing" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="block text-white/90 hover:text-white transition-all duration-300 font-medium text-lg py-3 px-4 rounded-xl hover:bg-white/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Action Buttons */}
                <div className="p-6 space-y-4 border-t border-white/20">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold border border-white/30 backdrop-blur-xl transition-all duration-300">
                        Login
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleGetStarted();
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                    >
                      Start Free Trial
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section className="relative py-32 lg:py-48">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="text-center">
              {/* AI Mascot Hero */}
              <AnimatedContainer
                animation="neuralPulse"
                className="mb-16"
                delay={0.2}
              >
                <motion.div
                  className="inline-block relative"
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  }}
                >


                  {/* Auto Mascot Hero */}
                  <AutoHero />




                </motion.div>
              </AnimatedContainer>

              {/* Mind-Blowing Headline */}
              <AnimatedContainer
                animation="morphGlow"
                delay={0.4}
                className="mb-8"
              >
                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-8xl font-black mb-6 leading-tight"
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

              {/* Clear Subtitle */}
              <AnimatedContainer
                animation="morphGlow"
                delay={0.6}
                className="mb-16"
              >
                <motion.p
                  className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed drop-shadow-lg px-4 sm:px-0"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  Let AI handle your Instagram messages automatically
                  <br />
                  <span className="text-white/70 text-lg sm:text-xl">Save 10+ hours every week with instant, intelligent responses</span>
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
                      className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-2xl border border-white/20 min-w-[240px] sm:min-w-[280px] h-[60px] sm:h-[70px] flex items-center justify-center"
                    >
                      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                        <Instagram className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                        <span className="whitespace-nowrap">Start AI Revolution</span>
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      </div>
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
                    <Link href="/demo">
                      <Button
                        className="relative backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg border border-white/30 shadow-2xl min-w-[240px] sm:min-w-[280px] h-[60px] sm:h-[70px] flex items-center justify-center"
                      >
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                          <Play className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                          <span className="whitespace-nowrap">Watch Demo</span>
                        </div>
                      </Button>
                    </Link>
                  </motion.div>
                </StaggerItem>
              </StaggerContainer>

              {/* Trust Badge */}
              <motion.div
                className="flex items-center justify-center space-x-3 text-white/90 backdrop-blur-xl bg-white/10 px-8 py-4 rounded-2xl border border-white/20 shadow-2xl inline-flex"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <CheckCircle className="h-6 w-6 text-emerald-400" />
                <span className="font-semibold">14-day free trial • No credit card required • Cancel anytime</span>
              </motion.div>

              {/* Social Proof */}
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
                    <p className="font-bold text-xl text-white">Trusted by Businesses</p>
                    <p className="text-white/60">automating Instagram messages</p>
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
                    <p className="font-bold text-xl text-white">Highly Rated</p>
                    <p className="text-white/60">by satisfied customers</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-gradient-to-b from-slate-900 via-gray-900 to-black relative overflow-hidden">

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <AnimatedContainer
              animation="morphGlow"
              className="text-center mb-20"
            >
              <motion.h2
                className="text-4xl sm:text-5xl lg:text-7xl font-black mb-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Everything You Need
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  In One Place
                </span>
              </motion.h2>
              <motion.p
                className="text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Simple, powerful features to automate your Instagram customer service
              </motion.p>
            </AnimatedContainer>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.15}>
              {features.map((feature, index) => (
                <StaggerItem key={feature.title}>
                  <motion.div
                    className="group relative h-full"
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Glowing Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>

                    {/* Card */}
                    <div className="relative backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl group-hover:border-white/20 transition-all duration-500 h-full flex flex-col min-h-[320px]">
                      {/* Floating Icon */}
                      <motion.div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 shadow-lg ${feature.glowColor} group-hover:shadow-2xl flex-shrink-0`}
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
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </motion.div>

                      {/* Content */}
                      <div className="flex-grow flex flex-col">
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 flex-shrink-0">
                          {feature.title}
                        </h3>
                        <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300 flex-grow">
                          {feature.description}
                        </p>
                      </div>

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

        {/* Live Demo Section with GIF */}
        <section className="py-32 bg-gradient-to-b from-black via-slate-900 to-indigo-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <AnimatedContainer
              animation="morphGlow"
              className="text-center mb-16"
            >
              <motion.h2
                className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  See It In
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Action
                </span>
              </motion.h2>
              <motion.p
                className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Watch how AutoniqueAI automates your Instagram messages and converts conversations into sales
              </motion.p>
            </AnimatedContainer>

            {/* Live Conversation Demo */}
            <motion.div
              className="max-w-4xl mx-auto mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative backdrop-blur-2xl bg-white/10 p-8 lg:p-12 rounded-3xl border border-white/20 shadow-2xl">
                {/* Glowing Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>

                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Left: Description */}
                  <div className="text-center lg:text-left">
                    <motion.div
                      className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full mb-6 border border-emerald-500/30"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-sm">Live Example</span>
                    </motion.div>

                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Urgent Order?
                      </span>
                      <br />
                      <span className="text-white">No Problem!</span>
                    </h3>

                    <p className="text-white/80 text-lg mb-6 leading-relaxed">
                      A customer needs an engagement ring for next week. Watch AutoniqueAI:
                    </p>

                    <div className="space-y-3 mb-6">
                      {[
                        'Understand the urgency instantly',
                        'Provide helpful product information',
                        'Answer questions naturally',
                        'Convert to sale in seconds'
                      ].map((item, index) => (
                        <motion.div
                          key={item}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-white/90">{item}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                      <CheckCircle className="h-5 w-5" />
                      <span>Sale Completed ✓</span>
                    </div>
                  </div>

                  {/* Right: Mobile Frame with GIF */}
                  <div className="relative">
                    <motion.div
                      className="relative mx-auto max-w-sm"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Mobile Device Frame */}
                      <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10"></div>

                        {/* Screen */}
                        <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-inner" style={{ backgroundColor: '#13132b' }}>
                          <img
                            src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/content/YourBestJewellery.gif"
                            alt="AutoniqueAI handling urgent jewelry order"
                            className="w-full h-auto"
                            style={{ minHeight: '500px' }}
                          />
                        </div>
                      </div>

                      {/* Floating Badges */}
                      <motion.div
                        className="absolute -top-4 -right-4 bg-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                        animate={{
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Instagram className="h-4 w-4 inline mr-1" />
                        Instagram DM
                      </motion.div>

                      <motion.div
                        className="absolute -bottom-4 -left-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        ⚡ Instant Reply
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Video Demos */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {demoVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className="group relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-600 to-pink-600">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <motion.button
                        onClick={() => openVideo(video.youtubeId)}
                        className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center text-purple-600 hover:bg-white hover:scale-110 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play className="h-8 w-8 ml-1" fill="currentColor" />
                      </motion.button>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4">
                      <span className="px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-lg backdrop-blur-sm">
                        {video.duration}
                      </span>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                      {video.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Demos Link */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/demo">
                <motion.button
                  className="text-white/80 hover:text-white font-semibold text-lg flex items-center space-x-2 mx-auto group"
                  whileHover={{ x: 5 }}
                >
                  <span>View all demos and guides</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <motion.h2
                  className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Why Businesses
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Love AutoniqueAI
                  </span>
                </motion.h2>

                <motion.p
                  className="text-xl text-white/80 mb-12 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Join businesses already saving time and growing with automated Instagram messaging
                </motion.p>

                <StaggerContainer className="space-y-6" stagger={0.1}>
                  {benefits.map((benefit) => (
                    <StaggerItem key={benefit}>
                      <motion.div
                        className="flex items-center space-x-4 group"
                        whileHover={{ x: 10, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-8 w-8 text-emerald-400 drop-shadow-lg group-hover:text-emerald-300 transition-colors" />
                        </div>
                        <span className="text-white font-semibold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 drop-shadow-lg">
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
                {/* Live Demo Card */}
                <motion.div
                  className="relative backdrop-blur-2xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl"
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glowing Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>

                  <div className="relative">
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Real Conversation Example
                      </span>
                    </h3>

                    <p className="text-white/80 text-center mb-6 text-sm">
                      Watch AutoniqueAI handle an urgent jewelry order and convert it to a sale instantly
                    </p>

                    {/* Mobile Frame with GIF */}
                    <div className="relative mx-auto max-w-sm">
                      {/* Mobile Device Frame */}
                      <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-700">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10"></div>

                        {/* Screen */}
                        <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-inner" style={{ backgroundColor: '#13132b' }}>
                          <img
                            src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/content/YourBestJewellery.gif"
                            alt="AutoniqueAI handling jewelry customer inquiry"
                            className="w-full h-auto"
                            style={{ minHeight: '400px' }}
                          />
                        </div>
                      </div>

                      {/* Floating Badge */}
                      <motion.div
                        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg whitespace-nowrap"
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        ✓ Converted to Sale
                      </motion.div>
                    </div>

                    <p className="text-white/60 text-center mt-8 text-sm italic">
                      Customer needed an engagement ring urgently - AutoniqueAI responded instantly and closed the sale
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 bg-gradient-to-r from-black via-purple-900 to-black relative overflow-hidden">
          {/* Background */}
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
              className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Ready to Start
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Automating?
              </span>
            </motion.h2>

            <motion.p
              className="text-2xl text-white/80 mb-16 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Start your <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-bold">14-day free trial</span> and save 10+ hours every week
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
                  className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 sm:px-12 py-5 sm:py-6 rounded-3xl font-black text-lg sm:text-xl shadow-2xl border-2 border-white/20 min-w-[280px] sm:min-w-[320px] h-[70px] sm:h-[80px] flex items-center justify-center"
                >
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                    <Instagram className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
                    <span className="whitespace-nowrap">Start Free Trial</span>
                    <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
                  </div>
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
                <span>Setup in 5 minutes • No credit card • 14 days free</span>
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
                { number: "10+ Hours", label: "Saved Weekly", icon: <Clock className="h-8 w-8" /> },
                { number: "Instant", label: "Responses", icon: <Zap className="h-8 w-8" /> },
                { number: "24/7", label: "Always Active", icon: <Shield className="h-8 w-8" /> }
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

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Logo and Description */}
              <div className="md:col-span-2">
                <motion.div
                  className="mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/header_dark_background.svg"
                    alt="AutoniqueAI"
                    className="h-12 w-auto filter drop-shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg";
                      e.currentTarget.className = "h-12 w-12 filter drop-shadow-lg";
                    }}
                  />
                </motion.div>
                <p className="text-white/70 text-lg leading-relaxed mb-4">
                  Automate your Instagram customer service with AI. Save 10+ hours every week with instant, intelligent responses.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">System Online</span>
                  </div>
                  <div className="text-white/40 text-sm">99.9% Uptime</div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><Link href="#features" className="text-white/60 hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/demo" className="text-white/60 hover:text-white transition-colors">Demo</Link></li>
                  <li><Link href="#benefits" className="text-white/60 hover:text-white transition-colors">Benefits</Link></li>
                  <li><Link href="/pricing" className="text-white/60 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/auth/login" className="text-white/60 hover:text-white transition-colors">Login</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><a href="mailto:support@autonique.in" className="text-white/60 hover:text-white transition-colors">Contact Support</a></li>
                  <li><Link href="/demo" className="text-white/60 hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="/demo" className="text-white/60 hover:text-white transition-colors">Video Tutorials</Link></li>
                  <li><span className="text-white/60">24/7 Support</span></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-white/40 text-lg mb-4 md:mb-0">
                  © 2024 AutoniqueAI. Automating Instagram customer service.
                </p>
                <motion.div
                  className="flex items-center space-x-6 text-white/20 text-sm"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span>Powered by AutoniqueAI</span>
                  <span>•</span>
                  <span>Built with Care</span>
                  <span>•</span>
                  <span>Made with ❤️</span>
                </motion.div>
              </div>
            </div>
          </div>
        </footer>

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeVideo}
            >
              <motion.div
                className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeVideo}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="Demo Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
