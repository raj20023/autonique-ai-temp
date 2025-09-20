import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface SubscriptionStatus {
  has_access: boolean;
  reason: string;
  trial_active?: boolean;
  trial_expired?: boolean;
  days_remaining?: number;
  unlimited?: boolean;
}

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
  access: SubscriptionStatus;
  usage?: {
    total_messages: number;
    auto_replies_sent: number;
    active_faqs: number;
    connected_pages: number;
  };
}

export default function SubscriptionBanner() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

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

  const handleUpgrade = () => {
    // Redirect to pricing page or payment flow
    window.location.href = '/pricing';
  };

  const dismissBanner = () => {
    setIsVisible(false);
  };

  if (loading || !profile || !isVisible) {
    return null;
  }

  const { user, access } = profile;

  // Don't show banner for admin users or active paid users
  if (user.role === 'admin' || (user.role === 'paid' && access.has_access)) {
    return null;
  }

  // Don't show banner for beta users who still have access
  if (user.role === 'beta' && access.has_access) {
    return null;
  }

  // Show different banners based on status
  const renderBanner = () => {
    if (access.trial_expired) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Trial Expired</p>
                  <p className="text-sm opacity-90">
                    Your 14-day free trial has ended. Upgrade to continue using AutoniqueAI.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Upgrade Now
                </button>
                <button
                  onClick={dismissBanner}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (access.trial_active && access.days_remaining !== undefined) {
      const isUrgent = access.days_remaining <= 3;
      const bgColor = isUrgent ? 'bg-orange-500' : 'bg-blue-500';
      
      return (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${bgColor} text-white`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5" />
                <div>
                  <p className="font-semibold">
                    {access.days_remaining} day{access.days_remaining !== 1 ? 's' : ''} left in trial
                  </p>
                  <p className="text-sm opacity-90">
                    {isUrgent 
                      ? 'Your trial is ending soon! Upgrade to keep your AI assistant running.'
                      : 'Enjoying AutoniqueAI? Upgrade to unlock unlimited access.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUpgrade}
                  className="bg-white text-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Upgrade
                </button>
                <button
                  onClick={dismissBanner}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {renderBanner()}
    </AnimatePresence>
  );
}

// Beta User Badge Component
export function BetaUserBadge({ betaNumber }: { betaNumber?: number }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
      <Crown className="h-3 w-3 mr-1" />
      Beta User {betaNumber ? `#${betaNumber}` : ''}
    </div>
  );
}

// Access Status Indicator
export function AccessStatusIndicator({ access }: { access: SubscriptionStatus }) {
  if (access.has_access) {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </div>
    );
  }

  return (
    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      <AlertTriangle className="h-3 w-3 mr-1" />
      {access.trial_expired ? 'Expired' : 'Limited'}
    </div>
  );
}
