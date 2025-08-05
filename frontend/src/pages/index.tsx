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
        <title>Autonique.ai - Instagram Auto-Reply SaaS</title>
        <meta name="description" content="Automatically respond to Instagram DMs with AI-powered FAQ matching. Save time and never miss a customer inquiry." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="relative z-10">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Instagram className="h-8 w-8 text-instagram-500" />
                <span className="text-2xl font-bold text-gradient">Autonique.ai</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="btn-instagram"
                >
                  Get Started
                </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Automate Your{' '}
              <span className="text-gradient">Instagram DMs</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Save hours every day by automatically responding to Instagram messages 
              with AI-powered FAQ matching. Never miss a customer inquiry again.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={handleGetStarted}
                className="btn-instagram text-lg px-8 py-4 flex items-center space-x-2"
              >
                <Instagram className="h-5 w-5" />
                <span>Continue with Instagram Business</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <p className="text-sm text-gray-500">
                Free 14-day trial • No credit card required
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to automate customer service
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to help you provide instant, accurate responses to your customers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card text-center hover:shadow-glow transition-all duration-300"
                >
                  <feature.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Transform your customer service
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Join thousands of businesses already using InstaReply to provide 
                  instant, accurate customer support on Instagram.
                </p>
                
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-instagram-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Customer Message</p>
                      <p className="text-sm text-gray-500">Just now</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "What are your store hours?"
                  </p>
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900">InstaReply Bot</p>
                    </div>
                    <p className="text-gray-700">
                      "Hi! We're open Monday-Friday 9AM-6PM and Saturday 10AM-4PM. 
                      Is there anything specific you'd like to know about our products?"
                    </p>
                    <p className="text-xs text-green-600 mt-2">✓ Auto-replied in 0.3s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to automate your Instagram customer service?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses saving time with InstaReply
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Instagram className="h-5 w-5" />
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Instagram className="h-6 w-6 text-instagram-500" />
                <span className="text-xl font-bold">InstaReply</span>
              </div>
              <p className="text-gray-400 text-sm">
                © 2024 InstaReply. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
