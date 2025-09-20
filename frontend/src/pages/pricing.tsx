import { useState, useEffect } from 'react';
import Head from 'next/head';
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
  const { currentSubscription, getCurrentPlan } = useSubscription();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user-management/profile`, {
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
      // Create Razorpay order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subscription/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_id: planId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create order');
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
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subscription/verify-payment`, {
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

  const plans = [
    {
      id: 1,
      name: "Starter",
      price: "₹499",
      period: "/month",
      description: "Perfect for small businesses starting out",
      features: [
        "Up to 200 auto-replies/month",
        "1 Instagram account",
        "Basic FAQ setup",
        "AI-powered responses",
        "Email support"
      ],
      icon: MessageCircle,
      color: "blue",
      available: true,
      current: profile?.user.role === 'paid' && getCurrentPlan()?.plan_type === 'starter',
      planType: 'starter'
    },
    {
      id: 2,
      name: "Growth",
      price: "₹999",
      period: "/month",
      description: "Most popular - ideal for growing businesses",
      features: [
        "Up to 1,000 auto-replies/month",
        "1 Instagram account",
        "FAQ setup + basic analytics",
        "Response rate tracking",
        "Time to first response metrics",
        "Priority support"
      ],
      icon: BarChart3,
      color: "green",
      available: true,
      current: profile?.user.role === 'paid' && getCurrentPlan()?.plan_type === 'growth',
      popular: true,
      planType: 'growth'
    },
    {
      id: 3,
      name: "Pro",
      price: "₹2,999",
      period: "/month",
      description: "For agencies and serious sellers",
      features: [
        "Up to 5,000 auto-replies/month",
        "Up to 3 Instagram accounts",
        "Advanced analytics & insights",
        "Team handoff features",
        "Multi-brand management",
        "Dedicated support",
        "Custom integrations"
      ],
      icon: Crown,
      color: "purple",
      available: true,
      current: profile?.user.role === 'paid' && getCurrentPlan()?.plan_type === 'pro',
      planType: 'pro'
    },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with our free trial or join our exclusive beta program
            </p>
            
            {profile && (
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="text-sm text-gray-600">
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
              const Icon = plan.icon;
              const isCurrentPlan = plan.current;
              const canUpgrade = !isCurrentPlan && plan.available;
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                    plan.popular ? 'ring-2 ring-blue-500' : ''
                  } ${!plan.available ? 'opacity-60' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${plan.color}-100 mb-4`}>
                      <Icon className={`h-8 w-8 text-${plan.color}-600`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-gray-600">{plan.period}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-600">{plan.description}</p>
                    
                    {plan.trialDays !== undefined && (
                      <div className="mt-2 text-sm text-blue-600 font-medium">
                        {plan.trialDays} days remaining
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    {isCurrentPlan ? (
                      <div className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium">
                        Current Plan
                      </div>
                    ) : plan.isTrial ? (
                      <div className="w-full py-3 px-4 bg-blue-100 text-blue-600 rounded-lg font-medium">
                        {plan.trialDays ? `${plan.trialDays} days remaining` : 'Active Trial'}
                      </div>
                    ) : plan.isBeta ? (
                      <div className="w-full py-3 px-4 bg-purple-100 text-purple-600 rounded-lg font-medium">
                        {plan.available ? 'Beta Access' : 'Not Available'}
                      </div>
                    ) : canUpgrade && plan.id ? (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        className={`w-full py-3 px-4 text-white rounded-lg font-medium transition-colors ${
                          plan.popular
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {plan.popular ? 'Choose Popular' : 'Subscribe Now'}
                      </button>
                    ) : !plan.available ? (
                      <div className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium">
                        Not Available
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
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

          {/* Back to Dashboard */}
          <div className="text-center mt-8">
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
