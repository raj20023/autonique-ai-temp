import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, TrendingUp, Heart, Zap, CheckCircle, ArrowRight, Moon, Coffee, Sparkles } from 'lucide-react';

export default function ChaosToCalm() {
  const [activeSection, setActiveSection] = useState('tldr');

  const tableOfContents = [
    { id: 'tldr', title: 'TL;DR', icon: Clock },
    { id: 'why-chaos', title: 'Why Instagram Feels Like Chaos', icon: TrendingUp },
    { id: 'jewelry-seller', title: 'Story 1: The Jewelry Seller', icon: Sparkles },
    { id: 'baker-story', title: 'Story 2: The Baker', icon: Coffee },
    { id: 'artist-story', title: 'Story 3: The Artist', icon: Heart },
    { id: 'what-changed', title: 'What Changed for Them', icon: Users },
    { id: 'quick-start', title: 'Quick Start Guide', icon: Zap },
    { id: 'metrics', title: 'Metrics That Prove Calm', icon: TrendingUp },
    { id: 'faq', title: 'FAQ', icon: CheckCircle },
    { id: 'conclusion', title: 'Conclusion', icon: CheckCircle }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64; // h-16 = 64px
      const elementPosition = element.offsetTop - headerHeight - 20; // 20px extra padding
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 64; // h-16 = 64px
      const offset = headerHeight + 50; // 50px buffer for better UX

      const sections = tableOfContents.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= offset && rect.bottom >= offset;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    // Set initial active section
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>From Chaos to Calm: Real Stories of Small Business Owners Who Got Their Time Back - AutoniqueAI</title>
        <meta name="description" content="Read inspiring real stories of small business owners who transformed their Instagram DM chaos into calm with AutoniqueAI. Discover how automation gave them their time back." />
        <meta name="keywords" content="small business automation, Instagram DM management, customer service stories, business growth, time management, AutoniqueAI success stories" />
        <link rel="icon" href="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/demo" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Demo & Guides</span>
              </Link>
              <div className="flex items-center space-x-4">
                <img
                  src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg"
                  alt="AutoniqueAI"
                  className="h-8 w-8"
                />
                <span className="font-bold text-gray-900">AutoniqueAI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Table of Contents - Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <article className="prose prose-lg max-w-none">
                {/* Hero Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    From Chaos to Calm: Real Stories of Small Business Owners Who Got Their Time Back
                  </h1>
                  <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                    Three founders—a jeweler, a baker, and an artist—regained control by putting their DMs on autopilot with AutoniqueAI.
                  </p>
                </motion.div>

                {/* TL;DR */}
                <section id="tldr" className="mb-12">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-blue-900 mb-3">TL;DR</h2>
                        <p className="text-blue-800 leading-relaxed">
                          When your Instagram inbox explodes, it silently taxes your time, energy, and sales. These three founders— a jeweler, a baker, and an artist—regained control by putting their DMs on autopilot with AutoniqueAI. The result: calmer days, faster replies, and more revenue without extra staff.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Why Chaos */}
                <section id="why-chaos" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Why the Instagram Inbox Feels Like Chaos (and How It Hurts Growth)</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 mb-4">
                      If you're running a small business, your Instagram inbox is probably a mix of price queries, stock checks, delivery questions, and custom requests. The problem isn't the messages—it's the lag. Slow or missed replies create doubt, and doubt kills momentum. You don't need more hours in the day; you need a system that keeps conversations moving even when you're busy.
                    </p>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-purple-800 font-medium">
                        Enter AutoniqueAI—your polite, always-on DM assistant that replies instantly in your tone, captures leads, and hands off complex chats to you when needed. Below are three short, true-to-life stories of how it feels to go from overwhelmed to in control.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Story 1: Jewelry Seller */}
                <section id="jewelry-seller" className="mb-10">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Story 1: The Jewelry Seller Who Stopped Losing Sleep</h2>
                      </div>

                      <div className="space-y-4">
                        <p className="text-gray-700">
                          Riya, a handcrafted jewelry founder from Jaipur, was answering DMs at midnight and waking up to 30+ more by morning.
                        </p>

                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                          <p className="text-red-800 italic">
                            "By the time I replied, they'd often bought from someone else."
                          </p>
                        </div>

                        <p className="text-gray-700">
                          She connected AutoniqueAI, added her most-asked FAQs (price ranges, plating, shipping timelines), and let Auto greet new inquiries instantly. Within a week, nights felt quiet again. Within a month, late-night stress was gone.
                        </p>

                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-800 mb-1">Result:</h4>
                              <p className="text-green-700 text-sm">Fewer abandoned conversations, more morning orders, and actual sleep.</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-800 mb-1">Riya's takeaway:</h4>
                              <p className="text-green-700 text-sm italic">"My business runs even when I rest."</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Story 2: Baker */}
                <section id="baker-story" className="mb-10">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Coffee className="h-5 w-5 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Story 2: The Baker Who Doubled Orders—Without Hiring</h2>
                      </div>

                      <div className="space-y-4">
                        <p className="text-gray-700">
                          Sameera's Pune bakery got flooded during festivals: flavors, custom cakes, delivery slots—everything at once.
                        </p>

                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                          <p className="text-orange-800 italic">
                            "I couldn't reply fast enough. People moved on."
                          </p>
                        </div>

                        <p className="text-gray-700">
                          AutoniqueAI started answering immediately with friendly prompts like, "We'd love to bake for you! Which flavor are you craving today?" Customers stayed engaged, not ignored.
                        </p>

                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-800 mb-1">Result:</h4>
                              <p className="text-green-700 text-sm">Higher repeat orders and fewer missed opportunities—no new hires needed.</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-800 mb-1">Sameera's takeaway:</h4>
                              <p className="text-green-700 text-sm italic">"It felt like a 24/7 assistant who talks exactly like me."</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Story 3: Artist */}
                <section id="artist-story" className="mb-10">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Heart className="h-5 w-5 text-pink-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Story 3: The Artist Who Finally Took a Vacation</h2>
                      </div>

                      <div className="space-y-4">
                        <p className="text-gray-700">
                          Anaya, a Bengaluru illustrator, hadn't taken a proper break in two years. She feared missing commission leads.
                        </p>

                        <p className="text-gray-700">
                          She wrote warm, clear FAQs ("How commissions work," timelines, pricing guides), connected AutoniqueAI, and switched off notifications. She spent a week in Goa.
                        </p>

                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-800 mb-1">Result:</h4>
                              <p className="text-green-700 text-sm">Leads stayed warm, inbox stayed tidy, and no panic on return.</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-800 mb-1">Anaya's takeaway:</h4>
                              <p className="text-green-700 text-sm italic">"Automation didn't replace me—it gave me permission to be human again."</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* What Changed */}
                <section id="what-changed" className="mb-10">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">What Changed for Them (and Can Change for You)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Instant replies, human tone</h3>
                            <p className="text-gray-600 text-sm">AutoniqueAI mirrors your brand voice while answering FAQs and qualifying buyers.</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">No more message anxiety</h3>
                            <p className="text-gray-600 text-sm">New DMs are greeted, guided, and routed—day or night.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Focus without FOMO</h3>
                            <p className="text-gray-600 text-sm">Work, ship, rest—knowing every inquiry is acknowledged.</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Cleaner pipeline</h3>
                            <p className="text-gray-600 text-sm">Conversations stay organized, and hot leads get handed to you at the right time.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Quick Start */}
                <section id="quick-start" className="mb-10">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Quick Start: Turn Your Inbox into a Calm, Repeatable System</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                            <div>
                              <h3 className="font-semibold text-gray-900">List your top FAQs</h3>
                              <p className="text-gray-600 text-sm">pricing, shipping, sizes, customization, delivery areas</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Connect AutoniqueAI</h3>
                              <p className="text-gray-600 text-sm">to your Instagram Business account (5-minute setup)</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Add your tone</h3>
                              <p className="text-gray-600 text-sm">friendly, minimal, emoji-lite or emoji-rich—your call</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Set handoff rules</h3>
                              <p className="text-gray-600 text-sm">custom orders or high-value questions route to you</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">5</div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Review weekly</h3>
                              <p className="text-gray-600 text-sm">tune answers, add new FAQs from recent chats</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-blue-800 text-sm">
                          <strong>Want the step-by-step setup?</strong> Check out our complete setup guide:
                          <Link href="/blog/setup-guide" className="text-blue-600 hover:text-blue-700 underline ml-1">
                            Instagram Business Setup Guide
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Metrics */}
                <section id="metrics" className="mb-10">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Metrics That Prove Calm Is Profitable</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">Median reply time</h3>
                        <p className="text-gray-600 text-sm">Aim for under 1 minute (AutoniqueAI helps you get there)</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">Conversation completion rate</h3>
                        <p className="text-gray-600 text-sm">Fewer "seen but no reply" moments</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">Lead-to-order conversion</h3>
                        <p className="text-gray-600 text-sm">More chats turning into carts</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">After-hours engagement</h3>
                        <p className="text-gray-600 text-sm">Orders/messages that arrive when you're offline</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">Repeat buyer rate</h3>
                        <p className="text-gray-600 text-sm">Faster, warmer interactions → more repeat purchases</p>
                      </div>
                    </div>
                  </div>
                </section>
                {/* FAQ */}
                <section id="faq" className="mb-10">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">FAQ (Short & Helpful)</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q1: Will automation make my brand feel robotic?</h3>
                        <p className="text-gray-600 text-sm">No. AutoniqueAI uses your voice and keeps replies concise and warm. You control tone, content, and handoff.</p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q2: Can I step in mid-conversation?</h3>
                        <p className="text-gray-600 text-sm">Yes. AutoniqueAI routes complex queries to you and preserves context so you can jump in smoothly.</p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q3: Is setup technical?</h3>
                        <p className="text-gray-600 text-sm">It's straightforward: connect your Instagram Business account, select your page, add FAQs, and you're live.</p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q4: What if a customer asks something unusual?</h3>
                        <p className="text-gray-600 text-sm">Auto acknowledges quickly and forwards to you—no dead ends.</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Q5: How fast will I see results?</h3>
                        <p className="text-gray-600 text-sm">Most teams feel the difference in week one: calmer inbox, faster replies, and fewer dropped conversations.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Conclusion */}
                <section id="conclusion" className="mb-8">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg text-white p-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-4">Conclusion: Calm Is a Competitive Advantage</h2>
                      <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                        Calm isn't just a feeling—it's a system. When replies are fast, consistent, and kind, customers lean in. You sell more, stress less, and finally have the headspace to build.
                      </p>
                      <p className="text-purple-100 mb-8">
                        If you're ready to turn chaos into calm, start here:
                      </p>

                      <Link href="/auth/login">
                        <motion.button
                          className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Start your free 14-day trial of AutoniqueAI</span>
                          <ArrowRight className="h-6 w-6" />
                        </motion.button>
                      </Link>

                      <p className="text-sm text-purple-200 mt-4">and let Auto handle the inbox while you handle the business.</p>
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
