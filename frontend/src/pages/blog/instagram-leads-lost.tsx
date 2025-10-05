import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  TrendingDown,
  Bot,
  BarChart3,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function InstagramLeadsLostBlog() {
  const [activeSection, setActiveSection] = useState('introduction');

  const tableOfContents = [
    { id: 'introduction', title: 'Introduction', icon: MessageSquare },
    { id: 'harsh-reality', title: 'The Harsh Reality', icon: TrendingDown },
    { id: 'impossible-manual', title: 'Why Manual Fails', icon: Clock },
    { id: 'smart-fix', title: 'The Smart Fix', icon: Bot },
    { id: 'real-example', title: 'Real Example', icon: MessageSquare },
    { id: 'data-behind', title: 'The Data Behind Fast Replies', icon: BarChart3 },
    { id: 'how-autoniqueai', title: 'How AutoniqueAI Solves It', icon: Bot },
    { id: 'pro-tip', title: 'Pro Tip: Keep It Human', icon: Lightbulb },
    { id: 'conclusion', title: 'Conclusion', icon: CheckCircle }
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Why 80% of Instagram Leads Are Lost in the DMs — And How to Stop It</title>
        <meta name="description" content="Most businesses lose 80% of Instagram leads in their DMs. Learn why it happens and how AutoniqueAI helps you capture every opportunity, 24/7." />
        <meta name="keywords" content="Instagram DMs, lead generation, Instagram automation, customer service, AutoniqueAI, social media marketing" />
        <meta property="og:title" content="Why 80% of Instagram Leads Are Lost in the DMs — And How to Stop It" />
        <meta property="og:description" content="Most businesses lose 80% of Instagram leads in their DMs. Learn why it happens and how AutoniqueAI helps you capture every opportunity, 24/7." />
        <meta property="og:type" content="article" />
        <link rel="canonical" href="https://autonique.in/blog/instagram-leads-lost" />
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
            {/* Table of Contents Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{item.title}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
                {/* Header */}
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.h1
                    className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Why 80% of Instagram Leads Are Lost in the DMs — And How to Stop It
                  </motion.h1>

                  <motion.p
                    className="text-xl text-gray-600 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Most businesses lose 80% of Instagram leads in their DMs. Learn why it happens and how AutoniqueAI helps you capture every opportunity, 24/7.
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap justify-center gap-4 text-sm text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span>📅 Published: December 2024</span>
                    <span>⏱️ 8 min read</span>
                    <span>🏷️ Instagram Marketing</span>
                  </motion.div>
                </motion.div>

                {/* Introduction */}
                <section id="introduction" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <MessageSquare className="h-8 w-8 text-purple-600" />
                    </div>
                    <span>Introduction</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Instagram is where your next customer lives.
                    </p>
                    <p className="text-lg leading-relaxed">
                      They browse, like, comment — and then they DM.
                    </p>
                    <p className="text-lg leading-relaxed">
                      But here's the truth: nearly <strong className="text-purple-600">80% of potential leads never turn into sales</strong> simply because they're lost inside Instagram DMs.
                    </p>
                    <p className="text-lg leading-relaxed">
                      It's not because your product isn't great.
                    </p>
                    <p className="text-lg leading-relaxed">
                      It's because your reply time, message overload, and inconsistency silently kill conversions.
                    </p>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <p className="text-gray-800 font-medium mb-3">In this post, we'll break down:</p>
                      <ul className="list-disc list-inside space-y-2 text-gray-800">
                        <li className="text-gray-800">Why DMs are the hidden graveyard of sales,</li>
                        <li className="text-gray-800">What mistakes most small businesses make,</li>
                        <li className="text-gray-800">And how to fix it (without hiring extra staff).</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* The Harsh Reality */}
                <section id="harsh-reality" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                      <TrendingDown className="h-8 w-8 text-red-600" />
                    </div>
                    <span>The Harsh Reality: Missed DMs = Missed Money</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-center mb-4">
                        <Image
                          src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Instagram+Leads+Are+Lost+in+the+DMs/inbox+overflowing.png"
                          alt="Instagram DMs overloaded with unread messages"
                          width={800}
                          height={600}
                          className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300 max-w-full h-auto"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-600 font-medium">Instagram DMs overloaded with unread messages</p>
                    </div>

                    <p className="text-lg leading-relaxed">
                      Every time someone messages your business, they're already interested.
                    </p>
                    <p className="text-lg leading-relaxed">
                      They've seen your posts, your stories, maybe even added items to their cart.
                    </p>
                    <p className="text-lg leading-relaxed">
                      But if that message isn't answered quickly…
                    </p>
                    <p className="text-lg leading-relaxed font-semibold text-red-600">
                      They move on.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        According to social response data, brands that reply within <strong className="text-blue-700">5 minutes are 8x more likely to convert leads</strong> than those that reply later.
                      </p>
                    </div>
                    <p className="text-lg leading-relaxed">
                      And let's be honest — you're not replying in 5 minutes when you're:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-800">
                      <li className="text-gray-800">Managing packaging,</li>
                      <li className="text-gray-800">Handling suppliers,</li>
                      <li className="text-gray-800">Or simply asleep.</li>
                    </ul>
                    <p className="text-lg leading-relaxed font-semibold text-purple-600">
                      That's where those 80% lost leads come from — unanswered, delayed, or inconsistent DMs.
                    </p>
                  </div>
                </section>

                {/* Why It's Impossible to Keep Up (Manually) */}
                <section id="impossible-manual" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                    <span>Why It's Impossible to Keep Up (Manually)</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-center mb-4">
                        <Image
                          src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Instagram+Leads+Are+Lost+in+the+DMs/owner+overwhelmed.png"
                          alt="Small business owner overwhelmed by Instagram messages"
                          width={800}
                          height={600}
                          className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300 max-w-full h-auto"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-600 font-medium">Small business owner overwhelmed by Instagram messages</p>
                    </div>

                    <p className="text-lg leading-relaxed">
                      You start with good intentions — "I'll reply to everyone tonight."
                    </p>
                    <p className="text-lg leading-relaxed">
                      But soon, it's 11 PM, and you have 47 unread messages.
                    </p>
                    <p className="text-gray-800 font-medium">Here's what happens next:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-800">
                      <li className="text-gray-800">You reply late → they already bought elsewhere.</li>
                      <li className="text-gray-800">You forget → they assume you're unprofessional.</li>
                      <li className="text-gray-800">You send inconsistent info → they get confused and leave.</li>
                    </ul>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        <strong className="text-red-700">The painful truth:</strong> humans can't scale like that.
                      </p>
                      <p className="text-gray-800 mt-2">
                        <strong className="text-green-700">But automation can.</strong>
                      </p>
                    </div>
                  </div>
                </section>

                {/* The Smart Fix */}
                <section id="smart-fix" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Bot className="h-8 w-8 text-green-600" />
                    </div>
                    <span>The Smart Fix: Automate Conversations, Not Connection</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Automation doesn't mean replacing your personal touch — it means protecting it.
                    </p>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-center mb-4">
                        <Image
                          src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Instagram+Leads+Are+Lost+in+the+DMs/Auto+replying.png"
                          alt="AutoniqueAI mascot Auto replying instantly to customer messages"
                          width={800}
                          height={600}
                          className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300 max-w-full h-auto"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-600 font-medium">AutoniqueAI mascot Auto replying instantly to customer messages</p>
                    </div>

                    <p className="text-lg leading-relaxed">
                      Think of <strong className="text-purple-600">AutoniqueAI</strong> as your DM assistant that never sleeps.
                    </p>
                    <p className="text-gray-800 font-medium">Here's how it helps:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-800">
                      <li className="text-gray-800">Replies instantly to FAQs like prices, sizes, or availability.</li>
                      <li className="text-gray-800">Greets customers warmly, keeping your tone consistent.</li>
                      <li className="text-gray-800">Routes complex messages to you when needed.</li>
                      <li className="text-gray-800">Tracks conversations so you never lose context.</li>
                    </ul>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        Instead of juggling DMs all day, you just manage real conversations that matter — <strong className="text-purple-700">the ones where the customer is ready to buy.</strong>
                      </p>
                    </div>
                  </div>
                </section>

                {/* Real Example */}
                <section id="real-example" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <span>Real Example: The Missed Sale That Could've Been Saved</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      A small jewelry store owner once got this DM:
                    </p>
                    <div className="bg-gray-100 border-l-4 border-gray-400 p-4 italic">
                      <p className="text-gray-800">"Hi! Do you deliver to Pune?"</p>
                    </div>
                    <p className="text-lg leading-relaxed">
                      She saw it 5 hours later. The buyer had already found another store.
                    </p>
                    <p className="text-lg leading-relaxed font-semibold text-blue-600">
                      Now imagine if AutoniqueAI had replied instantly:
                    </p>
                    <div className="bg-green-100 border-l-4 border-green-400 p-4">
                      <p className="text-gray-800">"Hi 💎 Yes, we deliver across India! Would you like to see our latest gold-plated collection?"</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        <strong className="text-yellow-700">That's not just automation — that's revenue recovery.</strong>
                      </p>
                    </div>
                  </div>
                </section>

                {/* The Data Behind Fast Replies */}
                <section id="data-behind" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <BarChart3 className="h-8 w-8 text-indigo-600" />
                    </div>
                    <span>The Data Behind Fast Replies</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-center mb-4">
                        <Image
                          src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Instagram+Leads+Are+Lost+in+the+DMs/Simple+infographic.png"
                          alt="Chart showing higher sales conversion for faster Instagram replies"
                          width={800}
                          height={600}
                          className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300 max-w-full h-auto"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-600 font-medium">Chart showing higher sales conversion for faster Instagram replies</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <p className="text-green-700 font-bold text-lg">Replies within 5 minutes</p>
                        <p className="text-green-600 text-2xl font-bold">8x conversion boost</p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <p className="text-yellow-700 font-bold text-lg">Replies after 1 hour</p>
                        <p className="text-yellow-600 text-2xl font-bold">70% chance lead drops off</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-700 font-bold text-lg">Replies after 6 hours</p>
                        <p className="text-red-600 text-2xl font-bold">90% chance lost sale</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        <strong className="text-purple-700">When your inbox is busy, even a few missed DMs a day can cost thousands per month.</strong>
                      </p>
                    </div>
                  </div>
                </section>

                {/* How AutoniqueAI Solves It */}
                <section id="how-autoniqueai" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Bot className="h-8 w-8 text-purple-600" />
                    </div>
                    <span>How AutoniqueAI Solves It (Without Tech Hassle)</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      <strong className="text-purple-600">AutoniqueAI</strong> is built for real business owners — no coding, no setup headaches.
                    </p>
                    <p className="text-gray-800 font-medium">It:</p>
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <ol className="list-decimal list-inside space-y-3 text-gray-800">
                        <li className="text-gray-800">Connects directly with your Instagram Business Account.</li>
                        <li className="text-gray-800">Understands your FAQs using AI-powered matching.</li>
                        <li className="text-gray-800">Replies instantly, even when you're offline.</li>
                        <li className="text-gray-800">Saves customer details, so you can follow up anytime.</li>
                      </ol>
                    </div>
                    <div className="text-center">
                      <Link href="/auth/login">
                        <motion.button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Set up AutoniqueAI in 5 minutes</span>
                          <ArrowRight className="h-5 w-5" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </section>

                {/* Pro Tip */}
                <section id="pro-tip" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <Lightbulb className="h-8 w-8 text-yellow-600" />
                    </div>
                    <span>Pro Tip: Keep It Human</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Automation works best when it feels human.
                    </p>
                    <p className="text-lg leading-relaxed">
                      That's why <strong className="text-purple-600">AutoniqueAI</strong> lets you customize tone, emoji, and response style, so every reply sounds like you.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        <strong className="text-blue-700">No cold, robotic messages.</strong> Just genuine, consistent communication — at scale.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Conclusion */}
                <section id="conclusion" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <span>Conclusion</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      If your Instagram is busy but sales aren't growing, it's not your product — it's your DMs.
                    </p>
                    <p className="text-lg leading-relaxed">
                      The faster you respond, the faster you sell.
                    </p>
                    <p className="text-lg leading-relaxed">
                      And with <strong className="text-purple-600">AutoniqueAI</strong>, you don't have to choose between sleep and sales.
                    </p>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <p className="text-gray-800 text-lg font-medium mb-2">
                        Your customers deserve instant attention.
                      </p>
                      <p className="text-gray-800 text-lg font-medium mb-4">
                        Your business deserves tools that make it possible.
                      </p>
                      <div className="text-center">
                        <Link href="/auth/login">
                          <motion.button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>Start your free trial of AutoniqueAI today</span>
                            <ArrowRight className="h-5 w-5" />
                          </motion.button>
                        </Link>
                      </div>
                      <p className="text-center text-gray-600 text-sm mt-3 italic">
                        (Because great conversations shouldn't be missed.)
                      </p>
                    </div>
                  </div>
                </section>
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
