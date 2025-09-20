import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { subscriptionApi, Plan, Subscription, UsageStats, Payment } from '@/services/subscriptionApi';
import { isAuthenticated } from '@/utils/auth';
import toast from 'react-hot-toast';

export const useSubscription = () => {
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get all available plans
  const { 
    data: plans, 
    isLoading: plansLoading, 
    error: plansError 
  } = useQuery<Plan[]>(
    'subscription-plans',
    () => subscriptionApi.getPlans(),
    {
      enabled: isClient,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2
    }
  );

  // Get current subscription
  const { 
    data: currentSubscription, 
    isLoading: subscriptionLoading, 
    error: subscriptionError,
    refetch: refetchSubscription
  } = useQuery<Subscription>(
    'current-subscription',
    () => subscriptionApi.getCurrentSubscription(),
    {
      enabled: isClient && isAuthenticated(),
      retry: false,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Get usage statistics
  const { 
    data: usageStats, 
    isLoading: usageLoading, 
    error: usageError,
    refetch: refetchUsage
  } = useQuery<UsageStats>(
    'usage-stats',
    () => subscriptionApi.getUsageStats(),
    {
      enabled: isClient && isAuthenticated() && !!currentSubscription,
      staleTime: 1 * 60 * 1000, // 1 minute
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );

  // Get payment history
  const { 
    data: paymentHistory, 
    isLoading: paymentsLoading, 
    error: paymentsError 
  } = useQuery<Payment[]>(
    'payment-history',
    () => subscriptionApi.getPaymentHistory(),
    {
      enabled: isClient && isAuthenticated(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Subscribe to plan mutation
  const subscribeMutation = useMutation(
    ({ planId, userDetails }: { planId: number; userDetails: { name: string; email: string } }) =>
      subscriptionApi.initiatePayment(planId, userDetails),
    {
      onSuccess: () => {
        toast.success('Payment successful! Your subscription is now active.');
        queryClient.invalidateQueries('current-subscription');
        queryClient.invalidateQueries('usage-stats');
        queryClient.invalidateQueries('payment-history');
      },
      onError: (error: any) => {
        if (error.message !== 'Payment cancelled by user') {
          toast.error(`Payment failed: ${error.message}`);
        }
      }
    }
  );

  // Upgrade subscription mutation
  const upgradeMutation = useMutation(
    ({ newPlanId, userDetails }: { newPlanId: number; userDetails: { name: string; email: string } }) =>
      subscriptionApi.upgradeSubscription(newPlanId).then(orderData => {
        return new Promise<void>((resolve, reject) => {
          const options = {
            key: orderData.razorpay_key,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'AutoniqueAI',
            description: `Upgrade to ${orderData.plan_name}`,
            order_id: orderData.order_id,
            handler: async (response: any) => {
              try {
                await subscriptionApi.verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            prefill: {
              name: userDetails.name,
              email: userDetails.email
            },
            theme: {
              color: '#3B82F6'
            },
            modal: {
              ondismiss: () => {
                reject(new Error('Payment cancelled by user'));
              }
            }
          };
          
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        });
      }),
    {
      onSuccess: () => {
        toast.success('Upgrade successful! Your new plan is now active.');
        queryClient.invalidateQueries('current-subscription');
        queryClient.invalidateQueries('usage-stats');
        queryClient.invalidateQueries('payment-history');
      },
      onError: (error: any) => {
        if (error.message !== 'Payment cancelled by user') {
          toast.error(`Upgrade failed: ${error.message}`);
        }
      }
    }
  );

  // Cancel subscription mutation
  const cancelMutation = useMutation(
    () => subscriptionApi.cancelSubscription(),
    {
      onSuccess: () => {
        toast.success('Subscription cancelled successfully');
        queryClient.invalidateQueries('current-subscription');
        queryClient.invalidateQueries('usage-stats');
      },
      onError: (error: any) => {
        toast.error(`Failed to cancel subscription: ${error.message}`);
      }
    }
  );

  // Helper functions
  const isSubscriptionActive = () => {
    return currentSubscription?.status === 'active';
  };

  const canSendMessages = () => {
    if (!usageStats) return false;
    return usageStats.messages_used < usageStats.messages_limit;
  };

  const getUsagePercentage = () => {
    if (!usageStats) return 0;
    return Math.min(usageStats.usage_percentage, 100);
  };

  const getDaysRemaining = () => {
    if (!usageStats) return 0;
    return usageStats.days_remaining;
  };

  const getCurrentPlan = () => {
    return currentSubscription?.plan;
  };

  const getPlanById = (planId: number) => {
    return plans?.find(plan => plan.id === planId);
  };

  const canUpgradeTo = (planId: number) => {
    const currentPlan = getCurrentPlan();
    const targetPlan = getPlanById(planId);
    
    if (!currentPlan || !targetPlan) return false;
    return targetPlan.price > currentPlan.price;
  };

  const subscribe = (planId: number, userDetails: { name: string; email: string }) => {
    subscribeMutation.mutate({ planId, userDetails });
  };

  const upgrade = (newPlanId: number, userDetails: { name: string; email: string }) => {
    upgradeMutation.mutate({ newPlanId, userDetails });
  };

  const cancel = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      cancelMutation.mutate();
    }
  };

  return {
    // Data
    plans,
    currentSubscription,
    usageStats,
    paymentHistory,
    
    // Loading states
    plansLoading,
    subscriptionLoading,
    usageLoading,
    paymentsLoading,
    isSubscribing: subscribeMutation.isLoading,
    isUpgrading: upgradeMutation.isLoading,
    isCancelling: cancelMutation.isLoading,
    
    // Error states
    plansError,
    subscriptionError,
    usageError,
    paymentsError,
    
    // Actions
    subscribe,
    upgrade,
    cancel,
    refetchSubscription,
    refetchUsage,
    
    // Helper functions
    isSubscriptionActive,
    canSendMessages,
    getUsagePercentage,
    getDaysRemaining,
    getCurrentPlan,
    getPlanById,
    canUpgradeTo,
  };
};
