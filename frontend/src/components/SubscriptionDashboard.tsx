import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

const SubscriptionDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    currentSubscription,
    usageStats,
    paymentHistory,
    subscriptionLoading,
    usageLoading,
    paymentsLoading,
    isSubscriptionActive,
    canSendMessages,
    getUsagePercentage,
    getDaysRemaining,
    getCurrentPlan,
    cancel,
    isCancelling
  } = useSubscription();

  if (subscriptionLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const plan = getCurrentPlan();
  const isActive = isSubscriptionActive();
  const usagePercentage = getUsagePercentage();
  const daysRemaining = getDaysRemaining();

  // Show "No Active Subscription" if no subscription exists OR if subscription is inactive/cancelled
  if (!currentSubscription || !isActive) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-4">
            {!currentSubscription
              ? "Subscribe to a plan to start using AutoniqueAI"
              : "Your subscription has been cancelled. Subscribe to a new plan to continue using AutoniqueAI"
            }
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Plans
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    );
  }



  const getStatusColor = () => {
    if (!isActive) return 'text-red-600 bg-red-100';
    if (daysRemaining <= 3) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getUsageColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 75) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Subscription Overview</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan?.name}</h3>
            <p className="text-2xl font-bold text-blue-600">₹{plan?.price}</p>
            <p className="text-sm text-gray-600">per month</p>
          </div>

          {/* Days Remaining */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{daysRemaining}</p>
            <p className="text-sm text-gray-600">days remaining</p>
          </div>

          {/* Next Billing */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Next Billing</p>
            <p className="text-sm text-gray-600">
              {currentSubscription.next_billing_date 
                ? new Date(currentSubscription.next_billing_date).toLocaleDateString()
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Usage Statistics */}
      {usageStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Usage This Month</h2>
            <MessageSquare className="h-6 w-6 text-gray-600" />
          </div>

          <div className="space-y-4">
            {/* Usage Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Messages Sent</span>
                <span>{usageStats.messages_used} / {usageStats.messages_limit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getUsageColor()}`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {usagePercentage.toFixed(1)}% of monthly limit used
              </p>
            </div>

            {/* Usage Warning */}
            {usagePercentage >= 80 && (
              <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    {usagePercentage >= 95 ? 'Usage Limit Almost Reached' : 'High Usage Warning'}
                  </p>
                  <p className="text-xs text-orange-600">
                    {usagePercentage >= 95 
                      ? 'Consider upgrading your plan to avoid service interruption'
                      : 'You\'re approaching your monthly message limit'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Can't Send Messages Warning */}
            {!canSendMessages() && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">Monthly Limit Reached</p>
                  <p className="text-xs text-red-600">
                    Upgrade your plan or wait for next billing cycle to send more messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Plan Features */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm text-gray-700">{plan.monthly_messages} messages/month</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm text-gray-700">{plan.instagram_accounts} Instagram account(s)</span>
            </div>
            {plan.basic_faq && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Basic FAQ setup</span>
              </div>
            )}
            {plan.analytics && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Analytics & insights</span>
              </div>
            )}
            {plan.advanced_analytics && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Advanced analytics</span>
              </div>
            )}
            {plan.team_handoff && (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">Team handoff</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Subscription</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </a>
          
          {isActive && (
            <button
              onClick={cancel}
              disabled={isCancelling}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionDashboard;
