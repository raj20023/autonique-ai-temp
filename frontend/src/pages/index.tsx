import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Zap,
  Shield,
  BarChart3,
  Instagram,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock,
  Users
} from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { FeatureCard } from '@/components/ui/Card';
import AnimatedContainer, { StaggerContainer, StaggerItem } from '@/components/ui/AnimatedContainer';

const features = [
  {
    icon: <MessageCircle className="h-8 w-8" />,
    title: 'AI-Powered Auto-Reply',
    description: 'Intelligent responses to Instagram DMs using advanced AI and FAQ matching for natural conversations'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Lightning Fast Setup',
    description: 'Connect your Instagram Business account in under 2 minutes with secure Facebook OAuth integration'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, secure token storage, and GDPR-compliant data handling'
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Advanced Analytics',
    description: 'Real-time insights, response rates, customer satisfaction metrics, and engagement analytics'
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: '24/7 Availability',
    description: 'Never miss a customer inquiry with round-the-clock automated responses'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Multi-Account Support',
    description: 'Manage multiple Instagram Business accounts from a single, unified dashboard'
  }
];

const benefits = [
  'Save 10+ hours weekly on manual customer service',
  'Achieve 99.9% response rate with zero missed inquiries',
  'Provide instant responses in under 0.5 seconds',
  'Boost customer satisfaction by 40% on average',
  'Scale to handle 1000+ daily messages effortlessly',
  'Reduce customer service costs by up to 80%'
];

export default function HomePage() {
  const router = useRouter();

  // Temporarily disable auth check to debug
  // useEffect(() => {
  //   if (isAuthenticated()) {
  //     router.push('/dashboard');
  //   }
  // }, [router]);

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <Head>
        <title>AutoniqueAI - Instagram Auto-Reply SaaS</title>
        <meta name="description" content="Automatically respond to Instagram DMs with AI-powered FAQ matching. Save time and never miss a customer inquiry." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
        {/* Header */}
        <motion.header
          className="relative z-50 bg-white/95 backdrop-blur-2xl border-b border-neutral-200/20"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/logos/full_logo_light_theam.png"
                  alt="AutoniqueAI"
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.currentTarget.src = "/logos/logo_icon.png";
                    e.currentTarget.className = "h-10 w-10";
                  }}
                />
              </motion.div>
              <div className="hidden lg:flex items-center space-x-12">
                <Link href="#features" className="text-neutral-700 hover:text-orange-600 transition-all duration-200 font-medium text-sm tracking-wide">
                  Features
                </Link>
                <Link href="#benefits" className="text-neutral-700 hover:text-orange-600 transition-all duration-200 font-medium text-sm tracking-wide">
                  Benefits
                </Link>
                <Link href="#pricing" className="text-neutral-700 hover:text-orange-600 transition-all duration-200 font-medium text-sm tracking-wide">
                  Pricing
                </Link>
                <motion.button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-300/20 to-orange-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -30, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              {/* Logo Hero */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="inline-block relative"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-3xl blur-2xl scale-110"></div>
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                    <img
                      src="/logos/logo_icon.png"
                      alt="AutoniqueAI"
                      className="h-20 w-20 mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8"
              >
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-neutral-900 mb-6 leading-[0.9] tracking-tight">
                  Automate Your{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
                      Instagram DMs
                    </span>
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-12"
              >
                <p className="text-xl md:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed font-medium">
                  Transform your Instagram customer service with{' '}
                  <span className="text-orange-600 font-semibold">AI-powered automation</span>.
                  Save 10+ hours weekly while providing instant, intelligent responses.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              >
                <motion.button
                  onClick={handleGetStarted}
                  className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 flex items-center space-x-3"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram className="h-6 w-6" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
                </motion.button>

                <motion.div
                  className="flex items-center space-x-3 text-neutral-600 bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl border border-neutral-200/50 shadow-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">14-day free trial • No credit card required</span>
                </motion.div>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-12 text-neutral-600"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-3">
                    {[
                      'bg-gradient-to-r from-blue-500 to-blue-600',
                      'bg-gradient-to-r from-green-500 to-green-600',
                      'bg-gradient-to-r from-purple-500 to-purple-600',
                      'bg-gradient-to-r from-pink-500 to-pink-600'
                    ].map((bg, i) => (
                      <motion.div
                        key={i}
                        className={`w-10 h-10 ${bg} rounded-full border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.1 + i * 0.1, type: "spring", stiffness: 200 }}
                      >
                        {String.fromCharCode(65 + i)}
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">1000+ businesses</p>
                    <p className="text-sm text-neutral-600">trust AutoniqueAI</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 1.3 + i * 0.1, type: "spring", stiffness: 200 }}
                        className="text-yellow-400 text-xl"
                      >
                        ⭐
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">4.9/5 rating</p>
                    <p className="text-sm text-neutral-600">from 500+ reviews</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedContainer animation="slideUp" className="text-center mb-20">
              <div className="mb-8">
                <motion.div
                  className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-4 shadow-xl"
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <Logo variant="icon" size="lg" className="text-white" />
                </motion.div>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-8">
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  automate customer service
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-neutral-600 max-w-4xl mx-auto leading-relaxed">
                Powerful AI-driven features designed to transform your Instagram customer support experience
              </p>
            </AnimatedContainer>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.15}>
              {features.map((feature, index) => (
                <StaggerItem key={feature.title}>
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    className="h-full"
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Feature Highlight */}
            <AnimatedContainer animation="scaleIn" delay={0.8} className="mt-20">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-4xl p-8 md:p-12 border border-orange-200">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                      See AutoniqueAI in action
                    </h3>
                    <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                      Watch how our AI seamlessly handles customer inquiries, providing instant,
                      accurate responses that feel natural and helpful.
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={<ArrowRight className="h-5 w-5" />}
                      iconPosition="right"
                    >
                      Watch Demo
                    </Button>
                  </div>
                  <div className="relative">
                    <motion.div
                      className="bg-white rounded-3xl shadow-2xl p-6 border border-neutral-200"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <Instagram className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">Customer Message</p>
                          <p className="text-sm text-neutral-500">Just now</p>
                        </div>
                      </div>
                      <div className="bg-neutral-100 rounded-2xl p-4 mb-4">
                        <p className="text-neutral-800">
                          "What are your store hours and do you offer same-day delivery?"
                        </p>
                      </div>
                      <div className="border-t border-neutral-200 pt-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Logo variant="icon" size="sm" />
                          <p className="font-semibold text-neutral-900">AutoniqueAI</p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4">
                          <p className="text-neutral-800 mb-2">
                            "Hi! We're open Monday-Friday 9AM-6PM and Saturday 10AM-4PM.
                            Yes, we offer same-day delivery for orders placed before 2PM within our delivery zone.
                            Would you like to check if your area is covered?"
                          </p>
                          <p className="text-xs text-orange-600 font-medium">✓ Auto-replied in 0.3s</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-orange-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <AnimatedContainer animation="slideRight">
                <div className="mb-8">
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 w-fit shadow-xl border border-white/20"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Logo variant="icon" size="lg" className="text-white" />
                  </motion.div>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                  Transform your{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                    customer service
                  </span>
                </h2>
                <p className="text-xl text-white/90 mb-12 leading-relaxed">
                  Join 1000+ businesses already using AutoniqueAI to provide
                  lightning-fast, intelligent customer support on Instagram.
                </p>

                <StaggerContainer className="space-y-6" stagger={0.1}>
                  {benefits.map((benefit, index) => (
                    <StaggerItem key={benefit}>
                      <motion.div
                        className="flex items-center space-x-4"
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-full p-1 shadow-lg"
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="h-6 w-6 text-white" />
                        </motion.div>
                        <span className="text-white text-lg font-medium">{benefit}</span>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </AnimatedContainer>

              <AnimatedContainer animation="slideLeft" delay={0.3}>
                <div className="relative">
                  {/* Floating background elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-400/20 rounded-full blur-xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  />

                  <motion.div
                    className="bg-white/10 backdrop-blur-xl rounded-4xl shadow-2xl p-8 border border-white/20 relative z-10"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <MessageCircle className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-white">Customer Message</p>
                        <p className="text-sm text-white/70">Just now</p>
                      </div>
                    </div>
                    <motion.div
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-white font-medium">
                        "Do you have this product in stock? What's the delivery time to New York?"
                      </p>
                    </motion.div>
                    <div className="border-t border-white/20 pt-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <motion.div
                          className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Logo variant="icon" size="xs" />
                        </motion.div>
                        <p className="font-semibold text-white">AutoniqueAI</p>
                      </div>
                      <motion.div
                        className="bg-gradient-to-r from-orange-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <p className="text-white mb-3">
                          "Yes, we have it in stock! For New York delivery, we offer:
                          • Standard delivery: 2-3 business days ($5.99)
                          • Express delivery: Next business day ($12.99)

                          Would you like me to help you place an order?"
                        </p>
                        <motion.p
                          className="text-xs text-orange-300 font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          ✓ Auto-replied in 0.2s with inventory check
                        </motion.p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </AnimatedContainer>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedContainer animation="bounceIn" className="mb-12">
              <motion.div
                className="inline-block bg-white/20 backdrop-blur-xl rounded-4xl p-8 shadow-2xl border border-white/30"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Logo variant="icon" size="2xl" className="mx-auto" />
              </motion.div>
            </AnimatedContainer>

            <AnimatedContainer animation="slideUp" delay={0.2}>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 drop-shadow-lg leading-tight">
                Ready to{' '}
                <span className="relative">
                  automate
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </span>
                {' '}your Instagram customer service?
              </h2>
            </AnimatedContainer>

            <AnimatedContainer animation="fadeIn" delay={0.4}>
              <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium max-w-3xl mx-auto leading-relaxed">
                Join 1000+ businesses already saving 10+ hours weekly with intelligent automation
              </p>
            </AnimatedContainer>

            <AnimatedContainer animation="scaleIn" delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  onClick={handleGetStarted}
                  variant="secondary"
                  size="xl"
                  icon={<Instagram className="h-7 w-7" />}
                  className="bg-white text-orange-600 hover:bg-neutral-50 shadow-2xl hover:shadow-3xl border-0"
                >
                  Start Free Trial
                  <ArrowRight className="h-6 w-6 ml-2" />
                </Button>

                <motion.div
                  className="flex items-center space-x-3 text-white/90 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Setup takes less than 2 minutes</span>
                </motion.div>
              </div>
            </AnimatedContainer>

            {/* Floating elements */}
            <motion.div
              className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedContainer animation="slideUp">
              <div className="grid md:grid-cols-4 gap-12 mb-12">
                {/* Brand Section */}
                <div className="md:col-span-2">
                  <motion.div
                    className="flex items-center space-x-4 mb-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-3 shadow-lg">
                      <Logo variant="icon" size="md" />
                    </div>
                    <Logo variant="name" size="lg" theme="dark" />
                  </motion.div>
                  <p className="text-neutral-400 text-lg leading-relaxed max-w-md">
                    Automate your Instagram customer service with AI-powered responses.
                    Save time, improve satisfaction, and scale your business effortlessly.
                  </p>
                  <div className="flex items-center space-x-4 mt-6">
                    <motion.div
                      className="flex items-center space-x-2 text-orange-400"
                      whileHover={{ scale: 1.05 }}
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">1000+ businesses trust us</span>
                    </motion.div>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-6">Product</h3>
                  <ul className="space-y-4">
                    {['Features', 'Pricing', 'Demo', 'API'].map((item) => (
                      <li key={item}>
                        <motion.a
                          href={`#${item.toLowerCase()}`}
                          className="text-neutral-400 hover:text-white transition-colors"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="text-lg font-semibold mb-6">Support</h3>
                  <ul className="space-y-4">
                    {['Help Center', 'Contact', 'Status', 'Community'].map((item) => (
                      <li key={item}>
                        <motion.a
                          href={`/${item.toLowerCase().replace(' ', '-')}`}
                          className="text-neutral-400 hover:text-white transition-colors"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-neutral-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-6">
                    <Link href="/privacy" className="text-neutral-400 hover:text-white text-sm transition-colors">
                      Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-neutral-400 hover:text-white text-sm transition-colors">
                      Terms of Service
                    </Link>
                    <span className="text-neutral-500 text-sm">
                      © 2024 AutoniqueAI. All rights reserved.
                    </span>
                  </div>

                  <motion.div
                    className="flex items-center space-x-2 text-neutral-400"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm">Made with</span>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-orange-500"
                    >
                      ❤️
                    </motion.span>
                    <span className="text-sm">for Instagram businesses</span>
                  </motion.div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </footer>
      </div>
    </>
  );
}
