import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, TrendingUp, Heart, Zap, CheckCircle, ArrowRight, Settings, MessageCircle, Target, BarChart3, Shield, ExternalLink } from 'lucide-react';

export default function BestInstagramAutomationTools2025() {
  const [activeSection, setActiveSection] = useState('tldr');

  const tableOfContents = [
    { id: 'tldr', title: 'TL;DR — Quick Picks', icon: Clock },
    { id: 'who-this-is-for', title: 'Who This Guide Is For', icon: Users },
    { id: 'comparison-table', title: 'Comparison at a Glance', icon: BarChart3 },
    { id: 'instagram-safe', title: 'Instagram-Safe Automation', icon: Shield },
    { id: 'deep-dive', title: 'Deeper Takes on Top Tools', icon: TrendingUp },
    { id: 'how-to-choose', title: 'How to Choose', icon: Target },
    { id: 'setup-checklist', title: 'Setup Checklist', icon: CheckCircle },
    { id: 'common-mistakes', title: 'Common Mistakes', icon: Settings },
    { id: 'faq', title: 'FAQ', icon: MessageCircle }
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

  const tools = [
    {
      name: 'AutoniqueAI',
      bestFor: 'SMBs who want AI FAQ matching + human tone',
      strength: 'Instant answers in your voice; multi-account support; analytics',
      notes: 'Built specifically for IG DM automation (no-code setup)',
      color: 'purple'
    },
    {
      name: 'Chatfuel',
      bestFor: 'Templates & quick setup',
      strength: 'No-code flows for FAQs, comments, Stories, DMs; big template library',
      notes: 'Great for promotion workflows and FAQ deflection',
      color: 'blue'
    },
    {
      name: 'ManyChat',
      bestFor: 'Creators, list building',
      strength: 'Send links, collect leads, auto-reply to engage; Meta partner',
      notes: 'Known for comment-to-DM growth plays',
      color: 'green'
    },
    {
      name: 'Customers.ai (InstaChamp)',
      bestFor: 'Viral engagement & lives',
      strength: 'Auto-replies to comments/Stories; Live → DM automations',
      notes: 'Solid for campaign bursts and contests',
      color: 'orange'
    },
    {
      name: 'respond.io',
      bestFor: 'Support/sales teams',
      strength: 'Omni-channel inbox, CRM hooks, AI agents; automation',
      notes: 'Scales across WhatsApp, IG, FB in one place',
      color: 'indigo'
    },
    {
      name: 'Hootsuite',
      bestFor: 'Social ops',
      strength: 'DM automation tied to posts/reels; manage Click-to-Message ads',
      notes: 'Handy if your team already lives in Hootsuite',
      color: 'gray'
    }
  ];

  return (
    <>
      <Head>
        <title>Best Instagram Automation Tools for Small Businesses (2025)</title>
        <meta name="description" content="Compare the top Instagram DM automation tools in 2025 and pick the right one for your small business—fast replies, warm tone, and real results." />
        <meta name="keywords" content="instagram automation tools 2025, instagram dm automation, small business instagram, manychat vs chatfuel, respond.io, hootsuite instagram dms, zendesk instagram" />
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Hero Section */}
                <div className="mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Best Instagram Automation Tools for Small Businesses (2025 Update)
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    If your Instagram DMs are busy, you're leaving money on the table. The right automation tool replies instantly, routes complex questions to you, and keeps every conversation moving—without losing your voice.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    This 2025 guide breaks down the top options, when to use each, and how to stay within Instagram's rules. (Short version: you need an Instagram Professional account and must connect via Meta's official Messaging API.)
                  </p>
                </div>

                {/* Who This Guide Is For */}
                <section id="who-this-is-for" className="mb-12">
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Who this guide is for</h2>
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>Solo founders, boutiques, jewelers, home bakers, creators, and SMB teams</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>Anyone drowning in price/availability/size/shipping DMs</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>Teams that want human-sounding automation (not spammy blasts)</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* TL;DR Quick Picks */}
                <section id="tldr" className="mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">TL;DR — Quick Picks</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <h3 className="font-semibold text-purple-900 mb-2">Best for makers & boutiques</h3>
                          <p className="text-purple-800 font-medium">AutoniqueAI</p>
                          <p className="text-sm text-purple-700">AI FAQ matching, warm tone, no-code setup, built for Instagram DMs</p>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-2">Best template-driven flows</h3>
                          <p className="text-blue-800 font-medium">Chatfuel</p>
                          <p className="text-sm text-blue-700">Polished templates for FAQs, comments, Stories, DMs</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h3 className="font-semibold text-green-900 mb-2">Best for creators running promos</h3>
                          <p className="text-green-800 font-medium">ManyChat</p>
                          <p className="text-sm text-green-700">Automate links, lead capture, "comment-to-DM" growth flows</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <h3 className="font-semibold text-orange-900 mb-2">Best for live-stream/engagement hacks</h3>
                          <p className="text-orange-800 font-medium">Customers.ai (InstaChamp)</p>
                          <p className="text-sm text-orange-700">Auto-replies for comments, Stories, Live triggers</p>
                        </div>

                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <h3 className="font-semibold text-indigo-900 mb-2">Best for multi-channel support teams</h3>
                          <p className="text-indigo-800 font-medium">respond.io</p>
                          <p className="text-sm text-indigo-700">Omni-inbox + CRM integrations + AI agents</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h3 className="font-semibold text-gray-900 mb-2">Best for social teams already on a suite</h3>
                          <p className="text-gray-800 font-medium">Hootsuite / Sprout / Zendesk</p>
                          <p className="text-sm text-gray-700">DM routing inside the tools you use</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Comparison Table */}
                <section id="comparison-table" className="mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Comparison at a Glance</h2>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Tool</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Best For</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Standout Strength</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tools.map((tool, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <span className={`font-semibold text-${tool.color}-700`}>{tool.name}</span>
                              </td>
                              <td className="py-4 px-4 text-gray-700 text-sm">{tool.bestFor}</td>
                              <td className="py-4 px-4 text-gray-700 text-sm">{tool.strength}</td>
                              <td className="py-4 px-4 text-gray-600 text-sm">{tool.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Instagram-Safe Automation */}
                <section id="instagram-safe" className="mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Shield className="h-5 w-5 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">What "Instagram-safe" automation actually means</h2>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Instagram automation should work through Meta's official Messaging API (not gray-area scrapers or auto-DM spam). That requires an Instagram Professional account and connecting the account/page properly via OAuth. Tools that follow this path keep you compliant and stable as Instagram updates its platform.
                      </p>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-1 bg-yellow-100 rounded">
                            <Settings className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-yellow-900 mb-1">Pro move:</h3>
                            <p className="text-yellow-800 text-sm">
                              On mobile, enable Settings → Messages & story replies → Message controls → Connected tools → Allow access to messages so your tool can receive DMs.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Deep Dive */}
                <section id="deep-dive" className="mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Deeper takes on the top tools</h2>
                    </div>

                    <div className="space-y-8">
                      {/* AutoniqueAI */}
                      <div className="border-l-4 border-purple-400 pl-6">
                        <h3 className="text-xl font-bold text-purple-900 mb-2">AutoniqueAI — best for makers & boutiques who want human replies</h3>
                        <p className="text-gray-700 mb-3">
                          Built for Instagram DMs from the ground up: AI FAQ matching, instant replies in your tone, graceful human handoff, and multi-account support. If your inbox is mostly pricing/availability/size/shipping and you care about sounding like you, AutoniqueAI is the calm, focused choice.
                        </p>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <p className="text-purple-800 text-sm mb-2"><strong>Why SMBs pick it:</strong> 5-minute setup, human-sounding automation, zero fluff.</p>
                          <p className="text-purple-800 text-sm">
                            <strong>Try it:</strong> Start a 14-day free trial at{' '}
                            <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 underline">
                              autonique.in
                            </Link>
                          </p>
                        </div>
                      </div>

                      {/* Chatfuel */}
                      <div className="border-l-4 border-blue-400 pl-6">
                        <h3 className="text-xl font-bold text-blue-900 mb-2">Chatfuel — template king for quick wins</h3>
                        <p className="text-gray-700">
                          Chatfuel's Instagram stack covers automated replies for comments, Stories, mentions, and DMs, with a slick flow builder and loads of templates. Ideal if you want to ship promo flows and FAQ deflection fast.
                        </p>
                      </div>

                      {/* ManyChat */}
                      <div className="border-l-4 border-green-400 pl-6">
                        <h3 className="text-xl font-bold text-green-900 mb-2">ManyChat — creator-friendly growth plays</h3>
                        <p className="text-gray-700">
                          ManyChat shines for creators and promo-heavy brands: send links, answer questions, collect leads, and turn comments into DMs at scale. It's an official Meta partner and a go-to for engagement funnels.
                        </p>
                      </div>

                      {/* Customers.ai */}
                      <div className="border-l-4 border-orange-400 pl-6">
                        <h3 className="text-xl font-bold text-orange-900 mb-2">Customers.ai (InstaChamp) — campaign bursts & Live automation</h3>
                        <p className="text-gray-700">
                          InstaChamp makes it easy to auto-DM commenters, thank Story mentions, and trigger flows from Lives—great for launches and contests.
                        </p>
                      </div>

                      {/* respond.io */}
                      <div className="border-l-4 border-indigo-400 pl-6">
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">respond.io — the ops workhorse</h3>
                        <p className="text-gray-700">
                          A serious omni-channel inbox (IG, WhatsApp, FB, etc.) with automation, reporting, and deep CRM integrations (HubSpot, Salesforce, Shopify). If your team needs a shared inbox + AI agents + dashboards, this fits.
                        </p>
                      </div>

                      {/* Suite Tools */}
                      <div className="border-l-4 border-gray-400 pl-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Hootsuite / Sprout / Zendesk — when you need it inside the suite</h3>
                        <div className="space-y-3 text-gray-700">
                          <p>
                            <strong>Hootsuite</strong> now lets you automate DMs for posts/reels and manage Click-to-Message ads alongside organic. Handy for social teams already in Hootsuite.
                          </p>
                          <p>
                            <strong>Sprout Social</strong> pulls IG DMs into Smart Inbox with team routing, approvals, and collaboration.
                          </p>
                          <p>
                            <strong>Zendesk</strong> integrates Instagram Direct so your DMs flow into the helpdesk, and its docs walk you through the "Allow access to messages" switch on Instagram mobile.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* How to Choose */}
                <section id="how-to-choose" className="mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">How to choose (5 quick questions)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-2">Volume</h3>
                          <p className="text-blue-800 text-sm">Mostly FAQs and simple pre-sales?</p>
                          <p className="text-blue-700 text-sm font-medium">→ AutoniqueAI / Chatfuel / ManyChat</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h3 className="font-semibold text-green-900 mb-2">Channels</h3>
                          <p className="text-green-800 text-sm">Need WhatsApp + IG + FB in one place?</p>
                          <p className="text-green-700 text-sm font-medium">→ respond.io</p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <h3 className="font-semibold text-purple-900 mb-2">Team workflows</h3>
                          <p className="text-purple-800 text-sm">Already in Hootsuite or Sprout?</p>
                          <p className="text-purple-700 text-sm font-medium">→ Use their IG DM features</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <h3 className="font-semibold text-indigo-900 mb-2">Helpdesk</h3>
                          <p className="text-indigo-800 text-sm">Want tickets and SLAs?</p>
                          <p className="text-indigo-700 text-sm font-medium">→ Zendesk IG Direct</p>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <h3 className="font-semibold text-orange-900 mb-2">Campaigns</h3>
                          <p className="text-orange-800 text-sm">Running Lives/contests heavily?</p>
                          <p className="text-orange-700 text-sm font-medium">→ Customers.ai (InstaChamp)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Setup Checklist */}
                <section id="setup-checklist" className="mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Setup checklist (save this)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">1</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Switch to Instagram Professional</h3>
                            <p className="text-gray-600 text-sm">(Business/Creator)</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">2</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Link your Facebook Page</h3>
                            <p className="text-gray-600 text-sm">and authorize via OAuth</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">3</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">On mobile: Allow access to messages</h3>
                            <p className="text-gray-600 text-sm">(Connected tools)</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">4</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Write 10–20 FAQs</h3>
                            <p className="text-gray-600 text-sm">(pricing, delivery, sizes, availability, returns)</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">5</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Add a warm first-touch greeting</h3>
                            <p className="text-gray-600 text-sm">(your brand voice)</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">6</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Define handoff triggers</h3>
                            <p className="text-gray-600 text-sm">(custom orders, high value, or unclear intent)</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">7</div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Review weekly</h3>
                            <p className="text-gray-600 text-sm">add new FAQs from recent conversations</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Common Mistakes */}
                <section id="common-mistakes" className="mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Settings className="h-5 w-5 text-red-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Common mistakes (and easy fixes)</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="border-l-4 border-red-400 pl-4 py-2">
                        <h3 className="font-semibold text-red-900 mb-1">Using gray-area auto-DM spam tools</h3>
                        <p className="text-red-800 text-sm">Stick to API-based platforms to avoid instability.</p>
                      </div>

                      <div className="border-l-4 border-orange-400 pl-4 py-2">
                        <h3 className="font-semibold text-orange-900 mb-1">No handoff rules</h3>
                        <p className="text-orange-800 text-sm">Automation should protect your tone, not block real chats.</p>
                      </div>

                      <div className="border-l-4 border-yellow-400 pl-4 py-2">
                        <h3 className="font-semibold text-yellow-900 mb-1">Wall-of-text replies</h3>
                        <p className="text-yellow-800 text-sm">Keep it short; link details only when requested.</p>
                      </div>

                      <div className="border-l-4 border-blue-400 pl-4 py-2">
                        <h3 className="font-semibold text-blue-900 mb-1">Forgetting mobile permission</h3>
                        <p className="text-blue-800 text-sm">If DMs aren't flowing, recheck "Allow access to messages".</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="mb-12">
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q1: Do I need a special Instagram account for DM automation?</h3>
                        <p className="text-gray-700 text-sm">Yes. Use a Professional account connected via Meta's Messaging API.</p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q2: Will automation hurt engagement?</h3>
                        <p className="text-gray-700 text-sm">Not if used well. Instant, polite replies keep momentum; complex queries still route to you.</p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q3: Why aren't my DMs appearing in the tool?</h3>
                        <p className="text-gray-700 text-sm">On mobile, enable "Allow access to messages" under Connected tools.</p>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Q4: Which tool is best for multiple channels?</h3>
                        <p className="text-gray-700 text-sm">respond.io—omni-inbox + CRM integrations.</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Q5: Can I automate comment-to-DM campaigns?</h3>
                        <p className="text-gray-700 text-sm">Yes—ManyChat, Chatfuel, InstaChamp, and Hootsuite support flows tied to posts/reels/comments.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Final Word & CTA */}
                <section className="mb-8">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg text-white p-8">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4">Final word</h2>
                      <p className="text-purple-100 mb-6 max-w-3xl mx-auto text-lg">
                        Automation isn't about replacing your voice—it's about responding fast, consistently, and kindly when you can't. Pick the tool that fits your workflow, wire it up the right way, and let your inbox finally breathe.
                      </p>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold mb-3">Want human-sounding replies that feel like you?</h3>
                        <p className="text-purple-100 mb-6">
                          Start your 14-day free trial of AutoniqueAI and turn Instagram DMs into a calm, repeatable system.
                        </p>

                        <Link href="/auth/login">
                          <motion.button
                            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>Start Your Free Trial</span>
                            <ArrowRight className="h-6 w-6" />
                          </motion.button>
                        </Link>

                        <p className="text-sm text-purple-200 mt-4">No credit card required • 14-day free trial</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-white/10 rounded-lg p-4">
                          <h4 className="font-semibold mb-1">Related Guides</h4>
                          <div className="space-y-1 text-sm">
                            <Link href="/blog/setup-guide" className="block text-purple-200 hover:text-white underline">
                              Setup Guide
                            </Link>
                            <Link href="/blog/why-80-percent-leads-lost" className="block text-purple-200 hover:text-white underline">
                              Why 80% of Leads Are Lost
                            </Link>
                          </div>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                          <h4 className="font-semibold mb-1">Psychology</h4>
                          <Link href="/blog/psychology-fast-replies" className="block text-purple-200 hover:text-white underline text-sm">
                            Psychology of Fast Replies
                          </Link>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                          <h4 className="font-semibold mb-1">Success Stories</h4>
                          <Link href="/blog/chaos-to-calm" className="block text-purple-200 hover:text-white underline text-sm">
                            From Chaos to Calm
                          </Link>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4">
                          <h4 className="font-semibold mb-1">Meet Auto</h4>
                          <Link href="/blog/meet-auto" className="block text-purple-200 hover:text-white underline text-sm">
                            Our AI Mascot Story
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
