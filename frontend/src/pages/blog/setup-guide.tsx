import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  CheckCircle,
  ExternalLink,
  Instagram,
  Facebook,
  MessageSquare,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Settings
} from 'lucide-react';

export default function SetupGuideBlog() {
  const [activeSection, setActiveSection] = useState('introduction');

  const tableOfContents = [
    { id: 'introduction', title: 'Introduction', icon: MessageSquare },
    { id: 'prerequisites', title: 'Prerequisites', icon: CheckCircle },
    { id: 'registration', title: 'Registration', icon: User },
    { id: 'oauth', title: 'Facebook OAuth', icon: Facebook },
    { id: 'business-setup', title: 'Business Setup', icon: Settings },
    { id: 'faq-setup', title: 'FAQ Management', icon: MessageSquare },
    { id: 'testing', title: 'Testing Setup', icon: Zap },
    { id: 'going-live', title: 'Going Live', icon: Globe },
    { id: 'advanced', title: 'Advanced Features', icon: BarChart3 },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: Shield }
  ];

  return (
    <>
      <Head>
        <title>Complete AutoniqueAI Setup Guide - Instagram Automation Tutorial</title>
        <meta name="description" content="Learn how to set up AutoniqueAI for Instagram automation in 15 minutes. Complete step-by-step guide with screenshots and best practices." />
        <meta name="keywords" content="AutoniqueAI setup, Instagram automation, Instagram chatbot, social media automation, customer service automation" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Navigation */}
        <nav className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/demo" className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Demo & Guides</span>
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                AutoniqueAI
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Table of Contents - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                            activeSection === item.id
                              ? 'bg-purple-500/30 text-white border border-purple-400/50'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{item.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
                
                {/* Article Header */}
                <header className="mb-8">
                  <motion.h1 
                    className="text-4xl lg:text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    How to Set Up AutoniqueAI: Complete Instagram Automation Guide
                  </motion.h1>
                  
                  <motion.p 
                    className="text-xl text-white/80 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Transform your Instagram customer service with AI-powered auto-replies in just 15 minutes
                  </motion.p>

                  <motion.div 
                    className="flex items-center space-x-6 text-white/60 text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Updated January 2024</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>15 min read</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>AutoniqueAI Team</span>
                    </div>
                  </motion.div>
                </header>

                {/* Article Content */}
                <div className="prose prose-lg prose-invert max-w-none">
                  
                  {/* Introduction Section */}
                  <section id="introduction" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <MessageSquare className="h-8 w-8 mr-3 text-purple-400" />
                      Why Instagram Automation Matters
                    </h2>
                    <div className="text-white/80 space-y-4">
                      <p>
                        In today's digital landscape, <strong>Instagram customer service automation</strong> has become essential for businesses looking to scale their social media presence. With over 2 billion monthly active users on Instagram, managing direct messages manually can quickly become overwhelming.
                      </p>
                      <p>
                        That's where <strong>AutoniqueAI</strong> comes in – a powerful Instagram automation tool that uses artificial intelligence to respond to customer inquiries instantly, 24/7.
                      </p>
                      
                      <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-6 my-6">
                        <h3 className="text-xl font-bold text-white mb-4">What You'll Learn</h3>
                        <ul className="space-y-2 text-white/80">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span>Complete AutoniqueAI setup in under 15 minutes</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span>Facebook OAuth integration and permissions</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span>Creating effective FAQ responses</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span>Testing and optimizing your automation</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                            <span>Advanced features and troubleshooting</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Key Features */}
                  <section className="mb-12">
                    <h3 className="text-2xl font-bold text-white mb-6">AutoniqueAI Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { icon: Zap, title: 'AI-Powered Responses', desc: 'Uses Google Gemini 2.0 Flash with LangChain' },
                        { icon: Globe, title: 'Multilingual Support', desc: 'Responds in customer\'s native language' },
                        { icon: MessageSquare, title: 'Real-time Automation', desc: 'Instant response to incoming DMs' },
                        { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track response rates and engagement' },
                        { icon: Shield, title: 'Secure Integration', desc: 'Enterprise-grade security with Facebook OAuth' },
                        { icon: Settings, title: 'Easy Management', desc: 'User-friendly dashboard for FAQ management' }
                      ].map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex items-start space-x-3">
                              <Icon className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                              <div>
                                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                                <p className="text-white/70 text-sm">{feature.desc}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* CTA Section */}
                  <section className="mb-12">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-8 text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                      <p className="text-white/80 mb-6">
                        Follow this comprehensive guide to set up AutoniqueAI for your Instagram business automation.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/login">
                          <motion.button 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Start Free Trial
                          </motion.button>
                        </Link>
                        <Link href="/demo">
                          <motion.button 
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/30 backdrop-blur-xl transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Watch Demo
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </section>

                  {/* Continue Reading Notice */}
                  <section className="text-center py-8">
                    <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-white mb-2">Complete Guide Available</h3>
                      <p className="text-white/80 mb-4">
                        This is a preview of our comprehensive setup guide. The complete tutorial includes detailed screenshots, 
                        step-by-step instructions, troubleshooting tips, and advanced configuration options.
                      </p>
                      <Link href="/auth/login">
                        <motion.button 
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Access Full Guide
                        </motion.button>
                      </Link>
                    </div>
                  </section>

                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
