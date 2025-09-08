import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  MessageCircle,
  Zap,
  Shield,
  BarChart3,
  Instagram,
  ArrowRight,
  CheckCircle,
  Clock,
  Brain,
  Menu
} from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import Button from '@/components/ui/Button';

const features = [
  {
    icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
    title: 'AI-Powered Auto-Reply',
    description: 'Intelligent responses to Instagram DMs using advanced AI and FAQ matching for natural conversations'
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-600" />,
    title: 'Lightning Fast Setup',
    description: 'Connect your Instagram Business account in under 2 minutes with secure Facebook OAuth integration'
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-600" />,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, secure token storage, and GDPR-compliant data handling'
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    title: 'Advanced Analytics',
    description: 'Real-time insights, response rates, customer satisfaction metrics, and engagement analytics'
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    title: '24/7 Automation',
    description: 'Never miss a customer inquiry with round-the-clock automated responses and smart escalation'
  },
  {
    icon: <Brain className="h-6 w-6 text-blue-600" />,
    title: 'Smart Learning',
    description: 'AI continuously learns from your responses to improve accuracy and maintain your brand voice'
  }
];

const benefits = [
  'Save 10+ hours weekly on customer service',
  'Increase response rate by 300%',
  'Improve customer satisfaction scores',
  'Scale your business without hiring',
  'Never miss a potential sale',
  'Maintain consistent brand voice'
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
        <title>AutoniqueAI - AI-Powered Instagram Customer Service Automation</title>
        <meta name="description" content="Transform your Instagram customer service with Neural AI Technology. Save 10+ hours weekly while providing instant, intelligent responses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="/logos/full_logo_light_theam.png"
                  alt="AutoniqueAI"
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.src = "/logos/logo_icon.png";
                    e.currentTarget.className = "h-8 w-8";
                  }}
                />
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Features
                </Link>
                <Link href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Benefits
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Pricing
                </Link>
                <Button
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Start Free Trial
                </Button>
              </div>
              
              <button className="md:hidden p-2">
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              {/* Logo */}
              <div className="mb-8">
                <img
                  src="/logos/logo_icon.png"
                  alt="AutoniqueAI"
                  className="h-16 w-16 mx-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Transform Your Instagram
                <br />
                <span className="text-blue-600">Customer Service</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Transform your Instagram customer service with Neural AI Technology.
                <br />
                Save 10+ hours weekly while providing instant, intelligent responses.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center space-x-2"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Start AI Journey</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  Watch Neural Demo
                </Button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center space-x-3 text-gray-600 bg-white/90 px-6 py-4 rounded-xl border border-gray-200 shadow-sm inline-flex">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">14-day free trial • No credit card required</span>
              </div>

              {/* Social Proof */}
              <div className="mt-16 flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-12 text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-3">
                    {[
                      'bg-blue-500',
                      'bg-green-500',
                      'bg-purple-500',
                      'bg-pink-500'
                    ].map((bg, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 ${bg} rounded-full border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">1000+ businesses</p>
                    <p className="text-sm">trust AutoniqueAI</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-5 h-5 text-yellow-400 fill-current">⭐</div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">4.9/5 rating</p>
                    <p className="text-sm">from 500+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Businesses
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to automate and scale your Instagram customer service
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Why Choose AutoniqueAI?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Join thousands of businesses already saving time and improving customer satisfaction
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-4">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    See AutoniqueAI in action
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Watch how our AI seamlessly handles customer inquiries, providing instant, accurate responses that feel natural and helpful.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Customer Service?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join 1000+ businesses already saving 10+ hours weekly with intelligent automation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg flex items-center space-x-2"
              >
                <Instagram className="h-5 w-5" />
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="text-blue-100 text-sm">
                ✨ Setup takes less than 2 minutes
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <img
                src="/logos/full_logo_dark_theam.png"
                alt="AutoniqueAI"
                className="h-8 w-auto mx-auto mb-4"
                onError={(e) => {
                  e.currentTarget.src = "/logos/logo_icon.png";
                  e.currentTarget.className = "h-8 w-8 mx-auto mb-4";
                }}
              />
              <p className="text-gray-400">
                © 2024 AutoniqueAI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
