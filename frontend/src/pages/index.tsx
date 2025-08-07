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
  CheckCircle
} from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import Logo from '@/components/ui/Logo';

const features = [
  {
    icon: MessageCircle,
    title: 'Auto-Reply to DMs',
    description: 'Automatically respond to Instagram DMs using AI-powered FAQ matching'
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Connect your Instagram Business account in minutes with Facebook OAuth'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with encrypted token storage'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track response rates, popular questions, and engagement metrics'
  }
];

const benefits = [
  'Save hours of manual customer service work',
  'Never miss a customer inquiry again',
  'Provide instant 24/7 customer support',
  'Improve customer satisfaction scores',
  'Scale your business without hiring more staff'
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
        <title>Autonique.ai - Instagram Auto-Reply SaaS</title>
        <meta name="description" content="Automatically respond to Instagram DMs with AI-powered FAQ matching. Save time and never miss a customer inquiry." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-800 to-accent-500">
        {/* Header */}
        <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Autonique.ai Logo"
                    className="h-12 w-12 drop-shadow-lg"
                    onError={(e) => {
                      // Fallback to a visible icon if logo fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg" style={{display: 'none'}}>
                    <span className="text-brand-950 font-bold text-xl">A</span>
                  </div>
                </div>
                <span className="text-3xl font-bold text-white drop-shadow-lg">Autonique.ai</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-white/90 hover:text-white transition-colors font-medium">
                  Features
                </Link>
                <Link href="#pricing" className="text-white/90 hover:text-white transition-colors font-medium">
                  Pricing
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-white/30 hover:border-white/50"
                >
                  Get Started
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Floating Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <img
                  src="/logo.png"
                  alt="Autonique.ai Logo"
                  className="h-20 w-20 mx-auto drop-shadow-2xl"
                  onError={(e) => {
                    // Fallback to a visible icon if logo fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="h-20 w-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto" style={{display: 'none'}}>
                  <span className="text-brand-950 font-bold text-4xl">A</span>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
            >
              Automate Your{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Instagram DMs</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Save hours every day by automatically responding to Instagram messages
              with AI-powered FAQ matching. Never miss a customer inquiry again.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-brand-950 text-lg px-10 py-5 rounded-2xl font-bold transition-all duration-200 flex items-center space-x-3 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                <Instagram className="h-6 w-6" />
                <span>Continue with Instagram Business</span>
                <ArrowRight className="h-6 w-6" />
              </button>

              <p className="text-sm text-white/70 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                Free 14-day trial • No credit card required
              </p>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-accent-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-accent-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="inline-block bg-gradient-to-r from-brand-950 to-accent-500 rounded-2xl p-4 shadow-xl">
                  <img
                    src="/logo.png"
                    alt="Features"
                    className="h-12 w-12"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg" style={{display: 'none'}}>
                    <span className="text-brand-950 font-bold text-xl">A</span>
                  </div>
                </div>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-950 mb-6">
                Everything you need to automate customer service
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features designed to help you provide instant, accurate responses to your customers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="bg-gradient-to-br from-accent-500 to-brand-950 rounded-2xl p-4 w-fit mx-auto mb-6 shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-950 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-gradient-to-br from-brand-950 to-brand-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-fit shadow-xl">
                    <img
                      src="/logo.png"
                      alt="Benefits"
                      className="h-12 w-12"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg" style={{display: 'none'}}>
                      <span className="text-brand-950 font-bold text-xl">A</span>
                    </div>
                  </div>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Transform your customer service
                </h2>
                <p className="text-xl text-white/90 mb-10 leading-relaxed">
                  Join thousands of businesses already using Autonique.ai to provide
                  instant, accurate customer support on Instagram.
                </p>

                <ul className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                        <CheckCircle className="h-6 w-6 text-brand-950" />
                      </div>
                      <span className="text-white text-lg font-medium">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Customer Message</p>
                      <p className="text-sm text-white/70">Just now</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
                    <p className="text-white font-medium">
                      "What are your store hours?"
                    </p>
                  </div>
                  <div className="border-t border-white/20 pt-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <img src="/logo.png" alt="Bot" className="h-6 w-6" />
                      </div>
                      <p className="font-semibold text-white">Autonique Bot</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-white">
                        "Hi! We're open Monday-Friday 9AM-6PM and Saturday 10AM-4PM.
                        Is there anything specific you'd like to know about our products?"
                      </p>
                      <p className="text-xs text-yellow-300 mt-3 font-medium">✓ Auto-replied in 0.3s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                <img src="/logo.png" alt="Ready to start" className="h-16 w-16 mx-auto" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">
              Ready to automate your Instagram customer service?
            </h2>
            <p className="text-2xl text-white/90 mb-12 font-medium">
              Join thousands of businesses saving time with Autonique.ai
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-brand-950 hover:bg-gray-100 font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-200 flex items-center space-x-4 mx-auto shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              <Instagram className="h-7 w-7" />
              <span>Start Free Trial</span>
              <ArrowRight className="h-7 w-7" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-brand-950 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div className="bg-gradient-to-r from-accent-500 to-yellow-400 rounded-2xl p-3 shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Autonique.ai Logo"
                    className="h-10 w-10"
                    onError={(e) => {
                      // Fallback to a visible icon if logo fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg" style={{display: 'none'}}>
                    <span className="text-brand-950 font-bold text-lg">A</span>
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-accent-500 to-yellow-400 bg-clip-text text-transparent">Autonique.ai</span>
              </div>

              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex items-center space-x-6">
                  <a href="/privacy" className="text-white/70 hover:text-white text-sm transition-colors">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="text-white/70 hover:text-white text-sm transition-colors">
                    Terms of Service
                  </a>
                </div>
                <p className="text-white/70 text-sm">
                  © 2024 Autonique.ai. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
