import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { 
  Check, 
  Crown, 
  Zap, 
  MessageCircle, 
  BarChart3, 
  Shield,
  Clock,
  Star
} from 'lucide-react';
import { BetaUserBadge, AccessStatusIndicator } from '@/components/SubscriptionBanner';
import { useSubscription } from '@/hooks/useSubscription';
import PublicLayout from '@/components/layout/PublicLayout';

interface UserProfile {
  user: {
    id: number;
    name: string;
    email?: string;
    profile_picture?: string;
    role: string;
    is_beta_user: boolean;
    beta_user_number?: number;
    created_at: string;
    last_login?: string;
  };
  subscription: {
    status?: string;
    trial_start_date?: string;
    trial_end_date?: string;
    trial_days_remaining?: number;
    subscription_start_date?: string;
    subscription_end_date?: string;
  };
  access: {
    has_access: boolean;
    reason: string;
    trial_active?: boolean;
    trial_expired?: boolean;
    days_remaining?: number;
    unlimited?: boolean;
    role?: string;
  };
  usage?: {
    total_messages: number;
    auto_replies_sent: number;
    active_faqs: number;
    connected_pages: number;
  };
}

export default function PricingPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentSubscription, getCurrentPlan, plans: apiPlans, plansLoading } = useSubscription();

  // Debug logging (can be removed in production)
  // console.log('API Plans:', apiPlans);
  // console.log('Plans Loading:', plansLoading);

  // Test direct API call with hardcoded production URL
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const testAPI = async () => {
      try {
        console.log('Testing direct API call...');
        const url = 'https://api.autonique.in/api/v1/subscription/plans';
        console.log('Full URL:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Direct API response:', data);
        setDirectApiPlans(data);
      } catch (error) {
        console.error('Direct API error:', error);
      }
    };

    // Add a small delay to ensure the component is mounted
    setTimeout(testAPI, 100);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://api.autonique.in/api/v1/user-management/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: number) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login first to subscribe to a plan');
        window.location.href = '/auth/login';
        return;
      }

      console.log('Creating order for plan:', planId);
      console.log('API URL:', 'https://api.autonique.in');

      // Create Razorpay order
      const response = await fetch('https://api.autonique.in/api/v1/subscription/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_id: planId })
      });

      console.log('Response status:', response.status);
      console.log('Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Error response:', responseText);

        // Try to parse as JSON, fallback to text
        let errorMessage = 'Failed to create order';
        try {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.detail || errorJson.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }

        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      const orderData = await response.json();

      // Initialize Razorpay
      const options = {
        key: orderData.razorpay_key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AutoniqueAI',
        description: `Subscription to ${orderData.plan_name}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch('https://api.autonique.in/api/v1/subscription/verify-payment', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (verifyResponse.ok) {
              alert('Payment successful! Your subscription is now active.');
              window.location.href = '/dashboard';
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: profile?.user.name || '',
          email: profile?.user.email || ''
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Upgrade failed:', error);
      alert(`Failed to initiate payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Plan UI configuration
  const planConfig = {
    starter: {
      icon: MessageCircle,
      color: "blue",
      features: [
        "Up to 200 auto-replies/month",
        "1 Instagram account",
        "Basic FAQ setup",
        "AI-powered responses",
        "Email support"
      ]
    },
    growth: {
      icon: BarChart3,
      color: "green",
      popular: true,
      features: [
        "Up to 1,000 auto-replies/month",
        "1 Instagram account",
        "FAQ setup + basic analytics",
        "Response rate tracking",
        "Time to first response metrics",
        "Priority support"
      ]
    },
    pro: {
      icon: Crown,
      color: "purple",
      features: [
        "Up to 5,000 auto-replies/month",
        "Up to 3 Instagram accounts",
        "Advanced analytics & insights",
        "Team handoff features",
        "Multi-brand management",
        "Dedicated support",
        "Custom integrations"
      ]
    }
  };

  // State for direct API plans
  const [directApiPlans, setDirectApiPlans] = useState([]);
  const [apiCalled, setApiCalled] = useState(false);

  // Force API call on client side with hardcoded production URL
  if (typeof window !== 'undefined' && !apiCalled) {
    setApiCalled(true);
    fetch('https://api.autonique.in/api/v1/subscription/plans')
      .then(response => response.json())
      .then(data => {
        console.log('Forced API response:', data);
        setDirectApiPlans(data);
      })
      .catch(error => {
        console.error('Forced API error:', error);
      });
  }

  // Hardcoded API plans as fallback (since API call is not working)
  const hardcodedApiPlans = [
    {
      id: 1,
      name: "Starter",
      plan_type: "starter",
      price: 499.0,
      currency: "INR",
      monthly_messages: 200,
      instagram_accounts: 1,
      basic_faq: true,
      analytics: false,
      advanced_analytics: false,
      team_handoff: false
    },
    {
      id: 2,
      name: "Growth",
      plan_type: "growth",
      price: 999.0,
      currency: "INR",
      monthly_messages: 1000,
      instagram_accounts: 1,
      basic_faq: true,
      analytics: true,
      advanced_analytics: false,
      team_handoff: false
    },
    {
      id: 3,
      name: "Pro",
      plan_type: "pro",
      price: 2999.0,
      currency: "INR",
      monthly_messages: 5000,
      instagram_accounts: 3,
      basic_faq: true,
      analytics: true,
      advanced_analytics: true,
      team_handoff: true
    }
  ];

  // Combine API data with UI configuration
  const paidPlans = (apiPlans || directApiPlans || hardcodedApiPlans)?.map((apiPlan: any) => ({
    ...apiPlan,
    ...planConfig[apiPlan.plan_type as keyof typeof planConfig],
    price: `₹${apiPlan.price.toLocaleString()}`,
    period: "/month",
    available: true,
    current: profile?.user.role === 'paid' && getCurrentPlan()?.plan_type === apiPlan.plan_type,
  })) || [];

  // Add special plans
  const specialPlans = [
    {
      name: "Free Trial",
      price: "Free",
      description: "14 days full access to Growth plan",
      features: [
        "All Growth plan features",
        "Up to 1,000 messages/month",
        "AI-powered responses",
        "FAQ management",
        "Basic analytics",
        "Email support"
      ],
      icon: Clock,
      color: "blue",
      available: true,
      current: profile?.user.role === 'free_trial' || profile?.user.role === 'normal',
      trialDays: profile?.subscription?.trial_days_remaining,
      isTrial: true
    },
    {
      name: "Beta Access",
      price: "Free",
      description: "Limited to first 20 users",
      features: [
        "Unlimited Instagram DM automation",
        "AI-powered responses",
        "FAQ management",
        "Real-time analytics",
        "Priority support",
        "Early access to new features"
      ],
      icon: Star,
      color: "purple",
      available: profile?.user.is_beta_user || false,
      current: profile?.user.role === 'beta',
      isBeta: true
    }
  ];

  const plans = [...paidPlans, ...specialPlans];

  if (loading || plansLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Pricing - AutoniqueAI</title>
        <meta name="description" content="Choose the perfect plan for your Instagram automation needs" />
        <link rel="icon" href="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg" type="image/svg+xml" />
      </Head>

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Start with our free trial or join our exclusive beta program
            </p>
            
            {profile && (
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="text-sm text-white/60">
                  Welcome back, <span className="font-semibold">{profile.user.name}</span>
                </div>
                {profile.user.is_beta_user && (
                  <BetaUserBadge betaNumber={profile.user.beta_user_number} />
                )}
                <AccessStatusIndicator access={profile.access} />
              </div>
            )}
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const Icon = (plan as any).icon || MessageCircle;
              const isCurrentPlan = (plan as any).current;
              const canUpgrade = !isCurrentPlan && (plan as any).available;
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-8 ${
                    (plan as any).popular ? 'ring-2 ring-purple-500' : ''
                  } ${!(plan as any).available ? 'opacity-60' : ''}`}
                >
                  {(plan as any).popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${(plan as any).color || 'blue'}-100 mb-4`}>
                      <Icon className={`h-8 w-8 text-${(plan as any).color || 'blue'}-600`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>

                    <div className="mb-2">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      {(plan as any).period && (
                        <span className="text-white/60">{(plan as any).period}</span>
                      )}
                    </div>

                    <p className="text-white/70">{(plan as any).description || `${plan.name} plan features`}</p>

                    {(plan as any).trialDays !== undefined && (
                      <div className="mt-2 text-sm text-purple-400 font-medium">
                        {(plan as any).trialDays} days remaining
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {((plan as any).features || []).map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    {isCurrentPlan ? (
                      <div className="w-full py-3 px-4 bg-white/10 text-white/80 rounded-lg font-medium border border-white/20">
                        Current Plan
                      </div>
                    ) : (plan as any).isTrial ? (
                      <div className="w-full py-3 px-4 bg-blue-500/20 text-blue-300 rounded-lg font-medium border border-blue-500/30">
                        {(plan as any).trialDays ? `${(plan as any).trialDays} days remaining` : 'Active Trial'}
                      </div>
                    ) : (plan as any).isBeta ? (
                      <div className="w-full py-3 px-4 bg-purple-500/20 text-purple-300 rounded-lg font-medium border border-purple-500/30">
                        {plan.available ? 'Beta Access' : 'Not Available'}
                      </div>
                    ) : canUpgrade && (plan as any).id ? (
                      <button
                        onClick={() => handleUpgrade((plan as any).id)}
                        className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-all duration-300 ${
                          (plan as any).popular
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25'
                        }`}
                      >
                        {(plan as any).popular ? 'Choose Popular' : 'Subscribe Now'}
                      </button>
                    ) : !(plan as any).available ? (
                      <div className="w-full py-3 px-4 bg-white/5 text-white/40 rounded-lg font-medium border border-white/10">
                        Not Available
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-white/5 text-white/40 rounded-lg font-medium cursor-not-allowed border border-white/10"
                      >
                        Contact Support
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why Choose AutoniqueAI?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Smart Automation
                </h3>
                <p className="text-gray-600">
                  AI-powered responses that understand context and provide helpful answers to your Instagram DMs.
                </p>
              </div>
              
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analytics & Insights
                </h3>
                <p className="text-gray-600">
                  Track engagement, response times, and customer satisfaction to optimize your Instagram presence.
                </p>
              </div>
              
              <div className="text-center">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600">
                  Enterprise-grade security with 99.9% uptime to keep your Instagram automation running smoothly.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Instagram Business?
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses already using AutoniqueAI to automate their Instagram customer service and boost sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/login">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                    Start Free Trial
                  </button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/demo">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold border border-white/30 backdrop-blur-xl transition-all duration-300">
                    View Demo
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Back to Dashboard */}
          {profile && (
            <div className="text-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-white/70 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </PublicLayout>
    </>
  );
}
