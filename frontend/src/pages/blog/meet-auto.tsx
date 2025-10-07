import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, Heart, Brain, Sparkles, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';

export default function MeetAutoBlog() {
  const [activeSection, setActiveSection] = useState('introduction');

  const tableOfContents = [
    { id: 'introduction', title: 'Introduction', icon: Bot },
    { id: 'idea-behind-auto', title: 'The Idea Behind Auto', icon: Brain },
    { id: 'what-makes-different', title: 'What Makes Auto Different', icon: Sparkles },
    { id: 'psychology-friendly', title: 'Psychology of Friendly Assistant', icon: Heart },
    { id: 'how-auto-helps', title: 'How Auto Helps Your Business', icon: Zap },
    { id: 'why-customers-love', title: 'Why Customers Love Him', icon: Users },
    { id: 'hidden-meaning', title: 'The Hidden Meaning Behind His Name', icon: Bot },
    { id: 'future-of-auto', title: 'The Future of Auto', icon: Sparkles },
    { id: 'personal-note', title: 'A Personal Note', icon: Heart }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
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
        <title>Meet Auto: The Friendly AI Who Helps You Run Your Instagram - AutoniqueAI</title>
        <meta name="description" content="Meet Auto, the heart and voice of AutoniqueAI. Learn how this friendly AI assistant makes automation feel human while helping you manage Instagram DMs effortlessly." />
        <meta name="keywords" content="Auto AI, Instagram automation, friendly chatbot, AI assistant, AutoniqueAI mascot, customer service AI" />
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
                    Meet Auto: The Friendly AI Who Helps You Run Your Instagram
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    If you've ever wished for a clone to handle your Instagram DMs while you focused on your craft, meet Auto — your friendly digital teammate.
                  </p>
                </motion.div>

                {/* Introduction */}
                <section id="introduction" className="mb-12">
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Auto isn't just software.
                    </p>
                    <p className="text-lg leading-relaxed">
                      He's the heart and voice of AutoniqueAI — designed to make your brand feel more human, not less.
                    </p>
                    
                    {/* Hero Image */}
                    <div className="my-8 flex justify-center">
                      <Image 
                        src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Meet+auto/image1.png"
                        alt="Auto AI mascot hero illustration"
                        width={400}
                        height={400}
                        className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300"
                      />
                    </div>
                  </div>
                </section>

                {/* The Idea Behind Auto */}
                <section id="idea-behind-auto" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                    <span>The Idea Behind Auto</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      When we started building AutoniqueAI, we noticed something odd:
                    </p>
                    <p className="text-lg leading-relaxed">
                      Every automation tool out there felt cold. Efficient, yes. But lifeless.
                    </p>
                    <p className="text-lg leading-relaxed">
                      We didn't want that.
                    </p>
                    <p className="text-lg leading-relaxed">
                      We wanted something that made automation feel like a friend helping you out — not a robot taking your place.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-800 font-semibold">
                        So we built Auto.
                      </p>
                    </div>
                    <p className="text-lg leading-relaxed">
                      He's not just lines of code — he's a personality.
                    </p>
                    <p className="text-lg leading-relaxed">
                      He celebrates your wins, guides you when you're stuck, and handles your customers' questions with empathy and speed.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Auto is clever, caring, and a little witty, just like the business owners who use him.
                    </p>

                    {/* Concept Image */}
                    <div className="my-8 flex justify-center">
                      <Image 
                        src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Meet+auto/image2.png"
                        alt="Auto AI concept sketch and behind-the-scenes development"
                        width={400}
                        height={400}
                        className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300"
                      />
                    </div>
                  </div>
                </section>

                {/* What Makes Auto Different */}
                <section id="what-makes-different" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <Sparkles className="h-8 w-8 text-yellow-600" />
                    </div>
                    <span>What Makes Auto Different</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Most chatbots sound robotic. Auto doesn't.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Here's what sets him apart:
                    </p>
                    <ul className="space-y-3 text-lg">
                      <li className="flex items-start space-x-3">
                        <span className="text-purple-600 font-bold">•</span>
                        <span className="text-gray-800">Understands meaning, not just keywords.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-purple-600 font-bold">•</span>
                        <span className="text-gray-800">Replies in your tone.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-purple-600 font-bold">•</span>
                        <span className="text-gray-800">Knows when to pause.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-purple-600 font-bold">•</span>
                        <span className="text-gray-800">Learns over time.</span>
                      </li>
                    </ul>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        Think of him as your digital team member who never takes a break — but still remembers your style.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Psychology Behind Friendly Assistant */}
                <section id="psychology-friendly" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-pink-100 rounded-lg mr-3">
                      <Heart className="h-8 w-8 text-pink-600" />
                    </div>
                    <span>The Psychology Behind a Friendly Assistant</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      When customers receive a warm, consistent message — even from AI — it triggers familiarity bias.
                    </p>
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        That's the brain's way of saying: <strong className="text-pink-700">"I know this tone. I trust this brand."</strong>
                      </p>
                    </div>
                    <p className="text-lg leading-relaxed">
                      And when that happens?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <p className="text-green-700 font-bold">Sales rise.</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <p className="text-blue-700 font-bold">Stress drops.</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <p className="text-purple-700 font-bold">Conversations feel natural.</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
                      <p className="text-gray-800 font-semibold text-center">
                        That's the magic balance Auto brings: <strong className="text-purple-700">human warmth, machine consistency.</strong>
                      </p>
                    </div>

                    {/* Emotional Connection Image */}
                    <div className="my-8 flex justify-center">
                      <Image
                        src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Meet+auto/image4.png"
                        alt="Emotional connection between Auto AI and customers"
                        width={400}
                        height={400}
                        className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300"
                      />
                    </div>
                  </div>
                </section>

                {/* How Auto Helps Your Business */}
                <section id="how-auto-helps" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Zap className="h-8 w-8 text-green-600" />
                    </div>
                    <span>How Auto Helps You Run Your Business</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Auto quietly handles what used to take hours:
                    </p>
                    <ul className="space-y-3 text-lg">
                      <li className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-gray-800">Replies instantly to FAQs about prices, sizes, delivery.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-gray-800">Greets new customers politely — 24/7.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-gray-800">Escalates special messages to you.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-gray-800">Keeps your inbox clean and organized.</span>
                      </li>
                    </ul>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        It's like hiring a friendly assistant who never sleeps, never complains, and never forgets a customer.
                      </p>
                    </div>
                    <p className="text-lg leading-relaxed">
                      So while you're making products, designing jewelry, or baking orders — Auto's taking care of the conversations that convert.
                    </p>

                    {/* Productivity Image */}
                    <div className="my-8 flex justify-center">
                      <Image
                        src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Meet+auto/image5.png"
                        alt="Productivity contrast showing Auto AI handling customer service"
                        width={400}
                        height={400}
                        className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300"
                      />
                    </div>
                  </div>
                </section>

                {/* Why Customers Love Him */}
                <section id="why-customers-love" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                      <Users className="h-8 w-8 text-red-600" />
                    </div>
                    <span>Why Customers Love Him (Even When They Don't Know It's Him)</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Customers often message brands expecting silence.
                    </p>
                    <p className="text-lg leading-relaxed">
                      When they get an instant, kind response — they don't think, "Oh, this must be AI."
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-gray-800 font-semibold">
                        They think, <strong className="text-red-700">"Wow, this brand really cares."</strong>
                      </p>
                    </div>
                    <p className="text-lg leading-relaxed">
                      That's the quiet power of Auto.
                    </p>
                    <p className="text-lg leading-relaxed">
                      He makes your customers feel valued, seen, and respected — in seconds.
                    </p>
                    <p className="text-lg leading-relaxed">
                      And you?
                    </p>
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-800 font-bold text-center text-xl">
                        You finally get to breathe.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Hidden Meaning Behind His Name */}
                <section id="hidden-meaning" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <Bot className="h-8 w-8 text-indigo-600" />
                    </div>
                    <span>The Hidden Meaning Behind His Name</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      We named him Auto because he represents more than automation.
                    </p>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <p className="text-gray-800 font-semibold">
                        He represents <strong className="text-indigo-700">autonomy</strong> — freedom from stress, clutter, and missed opportunities.
                      </p>
                    </div>
                    <p className="text-lg leading-relaxed">
                      Auto's goal isn't to take control of your business — it's to give you control back.
                    </p>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-gray-800 font-semibold">
                        That's what AutoniqueAI stands for:
                      </p>
                      <p className="text-purple-700 font-bold text-lg mt-2">
                        Helping small business owners run their digital empire with confidence and calm.
                      </p>
                    </div>

                    {/* Brand Message Image */}
                    <div className="my-8 flex justify-center">
                      <Image
                        src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/blogs/Meet+auto/image6.png"
                        alt="AutoniqueAI brand message and mission poster"
                        width={400}
                        height={400}
                        className="rounded-2xl shadow-lg border-4 border-gray-200 hover:shadow-xl transition-shadow duration-300"
                      />
                    </div>
                  </div>
                </section>

                {/* Future of Auto */}
                <section id="future-of-auto" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-cyan-100 rounded-lg mr-3">
                      <Sparkles className="h-8 w-8 text-cyan-600" />
                    </div>
                    <span>The Future of Auto</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      Auto is growing fast — soon, he'll understand multiple languages, integrate with WhatsApp, and even analyze customer sentiment to help you respond better.
                    </p>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <p className="text-gray-800">
                        But no matter how smart he gets, his core will stay the same — <strong className="text-cyan-700">warm, helpful, and truly human.</strong>
                      </p>
                    </div>
                    <p className="text-lg leading-relaxed">
                      Because technology is best when it makes people feel more connected, not more distant.
                    </p>
                  </div>
                </section>

                {/* Personal Note */}
                <section id="personal-note" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <Heart className="h-8 w-8 text-orange-600" />
                    </div>
                    <span>A Personal Note</span>
                  </h2>
                  <div className="text-gray-700 space-y-4">
                    <p className="text-lg leading-relaxed">
                      If you've ever felt burned out trying to keep up with your DMs, Auto was made for you.
                    </p>
                    <p className="text-lg leading-relaxed">
                      He's here to take a little off your plate, so you can focus on what matters most — building, creating, living.
                    </p>
                    <p className="text-lg leading-relaxed">
                      The best part? You can meet him right now.
                    </p>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                      <p className="text-gray-800 text-lg font-medium mb-4 text-center">
                        Launch your free trial at AutoniqueAI —
                      </p>
                      <p className="text-gray-800 text-lg text-center mb-6">
                        and let Auto show you what effortless customer connection feels like.
                      </p>
                      <div className="text-center">
                        <Link href="/auth/login">
                          <motion.button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>Meet Auto Today</span>
                            <ArrowRight className="h-5 w-5" />
                          </motion.button>
                        </Link>
                      </div>
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
