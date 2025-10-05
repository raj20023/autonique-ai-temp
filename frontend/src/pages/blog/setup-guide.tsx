import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
  Settings,
  Smartphone,
  Chrome,
  Play,
  Save,
  AlertTriangle
} from 'lucide-react';

export default function SetupGuideBlog() {
  const [activeSection, setActiveSection] = useState('introduction');

  const tableOfContents = [
    { id: 'introduction', title: 'Introduction', icon: MessageSquare },
    { id: 'prerequisites', title: 'Prerequisites', icon: CheckCircle },
    { id: 'step1', title: 'Step 1: Link Instagram to Facebook', icon: Facebook },
    { id: 'step2', title: 'Step 2: Login to Facebook', icon: Chrome },
    { id: 'step3', title: 'Step 3: Open AutoniqueAI', icon: Globe },
    { id: 'step4', title: 'Step 4: Start Free Trial', icon: Play },
    { id: 'step5', title: 'Step 5: Launch Instagram Empire', icon: Zap },
    { id: 'step6', title: 'Step 6: Select Facebook Page', icon: Settings },
    { id: 'step7', title: 'Step 7: Choose Business Account', icon: User },
    { id: 'step8', title: 'Step 8: Connect & Save', icon: Save },
    { id: 'step9', title: 'Step 9: Enable Message Access', icon: Smartphone },
    { id: 'extra-setup', title: 'Extra Setup', icon: AlertTriangle },
    { id: 'final-thoughts', title: 'Final Thoughts', icon: CheckCircle }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <Head>
        <title>How to Set Up AutoniqueAI With Your Instagram Business Account (Step-by-Step Guide)</title>
        <meta name="description" content="Learn how to set up AutoniqueAI with your Instagram Business Account in 9 easy steps. Automate Instagram DMs, save time, and never miss a customer." />
        <meta name="keywords" content="AutoniqueAI setup, Instagram automation, Instagram DM automation, Instagram business account, social media automation, customer service automation" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="How to Set Up AutoniqueAI With Your Instagram Business Account" />
        <meta property="og:description" content="Learn how to set up AutoniqueAI with your Instagram Business Account in 9 easy steps. Automate Instagram DMs, save time, and never miss a customer." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://autonique.in/blog/setup-guide" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Set Up AutoniqueAI With Your Instagram Business Account" />
        <meta name="twitter:description" content="Learn how to set up AutoniqueAI with your Instagram Business Account in 9 easy steps. Automate Instagram DMs, save time, and never miss a customer." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
        </div>
        
        {/* Navigation */}
        <nav className="relative z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/demo" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-300">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Demo & Guides</span>
              </Link>
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors duration-300">
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
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                            activeSection === item.id
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
              <article className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
                
                {/* Article Header */}
                <header className="mb-8">
                  <motion.h1
                    className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    How to Set Up AutoniqueAI With Your Instagram Business Account (Step-by-Step Guide)
                  </motion.h1>

                  <motion.p
                    className="text-xl text-gray-600 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Learn how to set up AutoniqueAI with your Instagram Business Account in 9 easy steps. Automate Instagram DMs, save time, and never miss a customer.
                  </motion.p>

                  <motion.div
                    className="flex items-center space-x-6 text-gray-600 text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Updated January 2025</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>10 min read</span>
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
                    <motion.h2
                      className="text-3xl font-bold text-gray-900 mb-6 flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <MessageSquare className="h-8 w-8 text-purple-600" />
                      </div>
                      <span>Introduction</span>
                    </motion.h2>
                    <motion.div
                      className="text-gray-700 space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-lg leading-relaxed">
                        If you run a business on Instagram, you already know how overwhelming DMs can get. Customers want instant replies — but you can't be online 24/7.
                      </p>
                      <p className="text-lg leading-relaxed">
                        That's exactly where <strong className="text-purple-600">AutoniqueAI</strong> helps. It's an AI-powered Instagram DM automation tool that replies instantly, saves time, and makes sure you never lose a sale because of a missed message.
                      </p>
                      <p className="text-lg leading-relaxed">
                        In this step-by-step guide, I'll show you exactly how to set up AutoniqueAI with your Instagram Business Account — even if you're not tech-savvy.
                      </p>
                    </motion.div>
                  </section>



                  {/* Prerequisites Section */}
                  <section id="prerequisites" className="mb-12">
                    <motion.h2
                      className="text-3xl font-bold text-gray-900 mb-6 flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <span>Prerequisites for Connecting AutoniqueAI to Instagram</span>
                    </motion.h2>
                    <div className="text-gray-700 space-y-4">
                      <p className="text-gray-800 font-medium">Before we start, make sure you have:</p>

                      <motion.div
                        className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <ol className="list-decimal list-inside space-y-3 text-gray-800 text-lg">
                          <li className="text-gray-800"><strong className="text-gray-900">An Instagram Business Account</strong></li>
                          <li className="text-gray-800"><strong className="text-gray-900">A Facebook Page linked with that Instagram account</strong></li>
                        </ol>
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong className="text-blue-700">Note:</strong> Required because Instagram automation only works for business accounts connected with a Facebook page.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/business+account.jpg"
                              alt="Instagram business account setup screen"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Screenshot of Instagram "Switch to Business Account" screen</p>
                      </motion.div>
                    </div>
                  </section>

                  {/* Step-by-Step Guide Header */}
                  <motion.section
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Step-by-Step Guide: Connect AutoniqueAI With Instagram</h2>
                      <p className="text-gray-700 text-lg">
                        Follow these 9 simple steps to set up your Instagram automation
                      </p>
                    </div>
                  </motion.section>

                  {/* Step 1 */}
                  <section id="step1" className="mb-12">
                    <motion.h2
                      className="text-3xl font-bold text-gray-900 mb-6 flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Facebook className="h-8 w-8 text-blue-600" />
                      </div>
                      <span>Step 1: Link Your Instagram Business Account to a Facebook Page</span>
                    </motion.h2>
                    <div className="text-gray-700 space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Open Instagram Settings.</li>
                        <li className="text-gray-800">Connect your account to the Facebook Page that represents your business.</li>
                      </ul>

                      <motion.div
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+1.jpg"
                              alt="Connect Instagram Business Account with Facebook Page"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Instagram screen showing "Connect to Facebook Page"</p>
                      </motion.div>
                    </div>
                  </section>

                  {/* Step 2 */}
                  <section id="step2" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Chrome className="h-8 w-8 text-blue-600" />
                      </div>
                      Step 2: Log Into Facebook on Chrome
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Open Google Chrome.</li>
                        <li className="text-gray-800">Log in with the Facebook account that manages your business page.</li>
                      </ul>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+2.jpg"
                              alt="Login Facebook Chrome Browser"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Chrome browser showing Facebook login page</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 3 */}
                  <section id="step3" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <Globe className="h-8 w-8 text-green-600" />
                      </div>
                      Step 3: Open AutoniqueAI Website
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Visit <a href="https://autonique.in" className="text-purple-600 hover:text-purple-700 underline">autonique.in</a> in the same browser.</li>
                      </ul>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+3.jpg"
                              alt="AutoniqueAI homepage for Instagram automation"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">AutoniqueAI homepage screenshot</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 4 */}
                  <section id="step4" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <Play className="h-8 w-8 text-purple-600" />
                      </div>
                      Step 4: Click Start Free Trial
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Hit the <strong className="text-gray-900">Start Free Trial</strong> button.</li>
                        <li className="text-gray-800">This opens the login screen.</li>
                      </ul>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+4.jpg"
                              alt="Start free trial on AutoniqueAI website"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Highlighted Start Free Trial button</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 5 */}
                  <section id="step5" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                        <Zap className="h-8 w-8 text-yellow-600" />
                      </div>
                      Step 5: Launch Instagram Empire
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Scroll down and click <strong className="text-gray-900">Launch Instagram Empire</strong>.</li>
                        <li className="text-gray-800">If you're not logged into Facebook, it will ask you to log in.</li>
                      </ul>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+5.jpg"
                              alt="AutoniqueAI launch Instagram empire button"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Launch Instagram Empire button</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 6 */}
                  <section id="step6" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <Settings className="h-8 w-8 text-purple-600" />
                      </div>
                      Step 6: Select Your Facebook Page
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Choose the Facebook Page linked to your Instagram business account.</li>
                        <li className="text-gray-800">Click <strong className="text-gray-900">Continue</strong>.</li>
                      </ul>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+6.jpg"
                              alt="Select Facebook Page for AutoniqueAI connection"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Facebook authentication screen with pages listed</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 7 */}
                  <section id="step7" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                      Step 7: Choose Your Business Account
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Pick the Facebook Business Account that manages your page.</li>
                      </ul>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+7.jpg"
                              alt="Select Facebook Business Account for Instagram automation"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Facebook screen showing Business Account selection</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 8 */}
                  <section id="step8" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <Save className="h-8 w-8 text-green-600" />
                      </div>
                      Step 8: Connect Instagram Account & Save
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Select your Instagram Business Account.</li>
                        <li className="text-gray-800">Click <strong className="text-gray-900">Save</strong>.</li>
                        <li className="text-gray-800">You'll see a confirmation message.</li>
                        <li className="text-gray-800">AutoniqueAI will redirect you to the dashboard, and your 14-day free trial starts automatically.</li>
                      </ul>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+8.jpg"
                              alt="AutoniqueAI Instagram connection success screen"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Success confirmation screen</p>
                      </div>
                    </div>
                  </section>

                  {/* Step 9 */}
                  <section id="step9" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-pink-100 rounded-lg mr-3">
                        <Smartphone className="h-8 w-8 text-pink-600" />
                      </div>
                      Step 9: Add FAQs & Enable Message Access on Instagram
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <ol className="list-decimal list-inside space-y-3 text-gray-800">
                          <li className="text-gray-800">Inside your AutoniqueAI Dashboard, add the FAQs you want automated replies for.</li>
                          <li className="text-gray-800">On your Instagram mobile app (not desktop):
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-800">
                              <li className="text-gray-800">Go to <strong className="text-gray-900">Settings & Activity → Message and Story Replies → Message Requests</strong>.</li>
                              <li className="text-gray-800">Enable <strong className="text-gray-900">Allow Access to Messages</strong>.</li>
                            </ul>
                          </li>
                        </ol>
                      </div>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Step+9.jpg"
                              alt="Allow access to messages in Instagram settings"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">Instagram phone settings for message access</p>
                      </div>
                    </div>
                  </section>

                  {/* Extra Setup Section */}
                  <section id="extra-setup" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg mr-3">
                        <AlertTriangle className="h-8 w-8 text-orange-600" />
                      </div>
                      Extra Setup (Precautionary Step)
                    </h2>
                    <div className="text-gray-700 space-y-4">
                      <p className="text-gray-800 font-medium">If AutoniqueAI isn't showing your Instagram as "Active":</p>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <ul className="list-disc list-inside space-y-2 text-gray-800">
                          <li className="text-gray-800">Go to <strong className="text-gray-900">Dashboard → Settings → Instagram</strong></li>
                          <li className="text-gray-800">Click <strong className="text-gray-900">Setup Webhook</strong> to activate</li>
                          <li className="text-gray-800">If it's still inactive, contact support at <a href="mailto:autonique.ai@gmail.com" className="text-purple-600 hover:text-purple-700 underline">autonique.ai@gmail.com</a></li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-48 h-96 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300">
                            <Image
                              src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/how-to-setup-autoniqueai/Extra+Step.jpg"
                              alt="AutoniqueAI dashboard Instagram settings tab"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 font-medium">AutoniqueAI dashboard settings tab</p>
                      </div>
                    </div>
                  </section>

                  {/* Final Thoughts Section */}
                  <section id="final-thoughts" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      Final Thoughts
                    </h2>
                    <div className="text-gray-700 space-y-6">
                      <p className="text-lg">
                        And that's it — you've successfully connected AutoniqueAI to your Instagram Business Account.
                      </p>

                      <motion.div
                        className="bg-green-50 border border-green-200 rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">From here, your DMs are on autopilot:</h3>
                        <ul className="space-y-3">
                          <motion.li
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">FAQs answered instantly</span>
                          </motion.li>
                          <motion.li
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">Customers engaged 24/7</span>
                          </motion.li>
                          <motion.li
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">More leads and sales without extra effort</span>
                          </motion.li>
                        </ul>
                      </motion.div>

                      <motion.div
                        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <p className="text-center text-lg font-semibold text-gray-900 mb-4">
                          No more missed messages. No more stress. Just smooth automation that saves you hours every week.
                        </p>
                        <div className="text-center">
                          <Link href="/auth/login">
                            <motion.button
                              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>Start your free trial now at AutoniqueAI</span>
                            </motion.button>
                          </Link>
                        </div>
                      </motion.div>
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
