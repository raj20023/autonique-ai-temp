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

                  {/* Prerequisites Section */}
                  <section id="prerequisites" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <CheckCircle className="h-8 w-8 mr-3 text-green-400" />
                      Prerequisites: What You Need
                    </h2>
                    <div className="text-white/80 space-y-4">
                      <p>Before setting up AutoniqueAI, ensure you have:</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-3 flex items-center">
                            <Instagram className="h-5 w-5 mr-2 text-pink-400" />
                            Instagram Requirements
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              <span>Instagram Business Account (not personal)</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              <span>Admin access to your Instagram account</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              <span>Active Instagram business profile</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-3 flex items-center">
                            <Facebook className="h-5 w-5 mr-2 text-blue-400" />
                            Facebook Requirements
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              <span>Facebook Page connected to Instagram</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              <span>Admin access to Facebook Page</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              <span>Facebook Developer Account (free)</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-6 mt-6">
                        <h4 className="font-bold text-white mb-2">📱 Converting to Instagram Business Account</h4>
                        <p className="text-white/80 mb-3">If you don't have an Instagram Business account yet:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
                          <li>Open Instagram app on your mobile device</li>
                          <li>Go to <strong>Settings → Account → Switch to Professional Account</strong></li>
                          <li>Select <strong>Business</strong> (not Creator)</li>
                          <li>Connect to your Facebook Page</li>
                          <li>Complete your business profile information</li>
                        </ol>
                      </div>
                    </div>
                  </section>

                  {/* Registration Section */}
                  <section id="registration" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <User className="h-8 w-8 mr-3 text-blue-400" />
                      Step 1: Register for AutoniqueAI
                    </h2>
                    <div className="text-white/80 space-y-4">
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="font-bold text-white mb-4">Getting Started</h4>
                        <ol className="list-decimal list-inside space-y-3">
                          <li>Visit <a href="https://autonique.in/demo" className="text-purple-400 hover:text-purple-300 underline">AutoniqueAI Demo Page</a></li>
                          <li>Watch the complete demo video to understand the platform</li>
                          <li>Click <strong>"Start Free Trial"</strong> to begin registration</li>
                          <li>You'll be redirected to the Facebook OAuth login</li>
                        </ol>
                      </div>
                    </div>
                  </section>

                  {/* OAuth Section */}
                  <section id="oauth" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Facebook className="h-8 w-8 mr-3 text-blue-400" />
                      Step 2: Facebook OAuth Integration
                    </h2>
                    <div className="text-white/80 space-y-4">
                      <p>AutoniqueAI uses Facebook's secure OAuth system to connect with your Instagram account:</p>

                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="font-bold text-white mb-4">OAuth Process</h4>
                        <ol className="list-decimal list-inside space-y-3">
                          <li><strong>Click "Connect with Facebook"</strong> on the login page</li>
                          <li><strong>Grant permissions</strong> for:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                              <li><code className="bg-purple-500/20 px-2 py-1 rounded text-purple-300">pages_messaging</code>: Send auto-reply messages</li>
                              <li><code className="bg-purple-500/20 px-2 py-1 rounded text-purple-300">instagram_basic</code>: Access Instagram account information</li>
                              <li><code className="bg-purple-500/20 px-2 py-1 rounded text-purple-300">instagram_manage_messages</code>: Receive and send Instagram DMs</li>
                            </ul>
                          </li>
                          <li><strong>Select your Facebook Page</strong> that's connected to Instagram</li>
                          <li><strong>Authorize the connection</strong></li>
                        </ol>
                      </div>

                      <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-6">
                        <h4 className="font-bold text-white mb-2">🔒 Security & Privacy</h4>
                        <p className="text-white/80">
                          AutoniqueAI only requests minimal permissions necessary for Instagram automation.
                          Your data remains secure and private. We never store your Facebook password or access personal information.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Business Setup Section */}
                  <section id="business-setup" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Settings className="h-8 w-8 mr-3 text-purple-400" />
                      Step 3: Business Profile Setup
                    </h2>
                    <div className="text-white/80 space-y-6">
                      <p>After successful OAuth connection, you'll enter the <strong>Business Onboarding</strong> process:</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-3">📋 Business Basics</h4>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Business Name:</strong> Your company or brand name</li>
                            <li><strong>Business Type:</strong> E-commerce, Service, Restaurant, etc.</li>
                            <li><strong>Industry:</strong> Select your industry category</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-3">🎨 Brand Personality</h4>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Business Description:</strong> Brief description of your business</li>
                            <li><strong>Brand Personality:</strong> Friendly, Professional, Casual, etc.</li>
                            <li><strong>Target Audience:</strong> Who are your typical customers?</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-3">💬 Communication Style</h4>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Communication Tone:</strong> Formal, Casual, Enthusiastic</li>
                            <li><strong>Response Style:</strong> Brief, Detailed, Conversational</li>
                            <li><strong>Greeting Style:</strong> How you want to greet customers</li>
                            <li><strong>Use Emojis:</strong> Enable/disable emoji usage</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-3">🏢 Business Operations</h4>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Business Hours:</strong> When you're typically available</li>
                            <li><strong>Location:</strong> Your business location (optional)</li>
                            <li><strong>Website:</strong> Your business website URL</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* FAQ Setup Section */}
                  <section id="faq-setup" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <MessageSquare className="h-8 w-8 mr-3 text-green-400" />
                      Step 4: FAQ Setup and Management
                    </h2>
                    <div className="text-white/80 space-y-6">
                      <p>The heart of AutoniqueAI is its intelligent FAQ system:</p>

                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="font-bold text-white mb-4">Creating Your First FAQ</h4>
                        <ol className="list-decimal list-inside space-y-3">
                          <li><strong>Navigate to FAQ Management</strong> in your dashboard</li>
                          <li><strong>Add your first FAQ:</strong>
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                              <li><strong>Question:</strong> Common customer inquiry</li>
                              <li><strong>Answer:</strong> Your desired response</li>
                              <li><strong>Keywords:</strong> Related terms for better matching</li>
                            </ul>
                          </li>
                        </ol>
                      </div>

                      <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-6">
                        <h4 className="font-bold text-white mb-4">💡 Best Practices for FAQ Creation</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Start with 5-10 most common questions</li>
                          <li>• Use natural language in both questions and answers</li>
                          <li>• Include variations of the same question</li>
                          <li>• Keep answers concise but helpful</li>
                          <li>• Test responses before going live</li>
                        </ul>
                      </div>

                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="font-bold text-white mb-4">📝 Example FAQs</h4>
                        <div className="space-y-4 text-sm">
                          <div className="border-l-4 border-purple-400 pl-4">
                            <p><strong>Q:</strong> What are your business hours?</p>
                            <p><strong>A:</strong> We're open Monday-Friday 9 AM to 6 PM EST. For urgent inquiries outside business hours, please leave a message and we'll respond first thing in the morning! 🕘</p>
                          </div>
                          <div className="border-l-4 border-green-400 pl-4">
                            <p><strong>Q:</strong> How can I track my order?</p>
                            <p><strong>A:</strong> You can track your order using the tracking link sent to your email. If you need help finding it, please share your order number and I'll assist you! 📦</p>
                          </div>
                          <div className="border-l-4 border-blue-400 pl-4">
                            <p><strong>Q:</strong> Do you offer refunds?</p>
                            <p><strong>A:</strong> Yes! We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, contact us within 30 days for a full refund. 💯</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Testing Section */}
                  <section id="testing" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Zap className="h-8 w-8 mr-3 text-yellow-400" />
                      Step 5: Testing Your Setup
                    </h2>
                    <div className="text-white/80 space-y-4">
                      <p>Before going live, thoroughly test your automation:</p>

                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h4 className="font-bold text-white mb-4">Testing Process</h4>
                        <ol className="list-decimal list-inside space-y-3">
                          <li><strong>Use the FAQ Test Feature</strong> in your dashboard</li>
                          <li><strong>Send test messages</strong> to your Instagram account from another account</li>
                          <li><strong>Monitor the Live Messages</strong> page to see real-time activity</li>
                          <li><strong>Adjust FAQ responses</strong> based on test results</li>
                        </ol>
                      </div>
                    </div>
                  </section>

                  {/* Going Live Section */}
                  <section id="going-live" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Globe className="h-8 w-8 mr-3 text-green-400" />
                      Step 6: Going Live
                    </h2>
                    <div className="text-white/80 space-y-4">
                      <p>Once you're satisfied with your setup:</p>

                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <ol className="list-decimal list-inside space-y-3">
                          <li><strong>Enable Auto-Reply</strong> in your dashboard</li>
                          <li><strong>Monitor initial responses</strong> closely</li>
                          <li><strong>Adjust FAQs</strong> based on real customer interactions</li>
                          <li><strong>Review analytics</strong> regularly to optimize performance</li>
                        </ol>
                      </div>
                    </div>
                  </section>

                  {/* Advanced Features Section */}
                  <section id="advanced" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <BarChart3 className="h-8 w-8 mr-3 text-purple-400" />
                      Advanced Features
                    </h2>
                    <div className="text-white/80 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-3">🌍 Multilingual Support</h4>
                          <p className="text-sm">AutoniqueAI automatically detects customer language and responds accordingly:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>Spanish customers get Spanish responses</li>
                            <li>Hindi customers get Hindi responses</li>
                            <li>English customers get English responses</li>
                            <li>Supports 50+ languages automatically</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-3">📊 Analytics and Monitoring</h4>
                          <p className="text-sm">Track your automation performance with:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>Response Rate: % of messages that received auto-replies</li>
                            <li>Message Volume: Daily, weekly, monthly counts</li>
                            <li>FAQ Usage: Which FAQs are used most frequently</li>
                            <li>Customer Satisfaction: Monitor response effectiveness</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Troubleshooting Section */}
                  <section id="troubleshooting" className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Shield className="h-8 w-8 mr-3 text-red-400" />
                      Troubleshooting Common Issues
                    </h2>
                    <div className="text-white/80 space-y-6">
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-2">❌ Issue: "No Facebook Pages Found"</h4>
                          <p className="text-sm"><strong>Solution:</strong> Ensure your Instagram account is connected to a Facebook Page and you have admin access to both.</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-2">❌ Issue: "Webhook Connection Failed"</h4>
                          <p className="text-sm"><strong>Solution:</strong> Check that your Instagram account is a Business account (not Personal or Creator).</p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-2">❌ Issue: "Messages Not Auto-Replying"</h4>
                          <div className="text-sm">
                            <p><strong>Solution:</strong></p>
                            <ol className="list-decimal list-inside mt-2 space-y-1">
                              <li>Verify FAQ setup is complete</li>
                              <li>Check that auto-reply is enabled</li>
                              <li>Ensure your FAQs cover the customer's question</li>
                            </ol>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                          <h4 className="font-bold text-white mb-2">❌ Issue: "Permission Denied"</h4>
                          <p className="text-sm"><strong>Solution:</strong> Re-authorize the Facebook connection and ensure all required permissions are granted.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Final CTA */}
                  <section className="text-center py-8">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-8">
                      <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Instagram Customer Service?</h3>
                      <p className="text-white/80 mb-6">
                        Start your free 60-day trial and join thousands of businesses already using AutoniqueAI to scale their social media presence.
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
                        <Link href="/pricing">
                          <motion.button
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/30 backdrop-blur-xl transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Pricing
                          </motion.button>
                        </Link>
                      </div>
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
