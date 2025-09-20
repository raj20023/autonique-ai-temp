// Subscription API service - use hardcoded production URL (Railway env vars don't work well with frontend)
const API_BASE_URL = 'https://api.autonique.in';

export interface Plan {
  id: number;
  name: string;
  plan_type: 'starter' | 'growth' | 'pro';
  price: number;
  currency: string;
  monthly_messages: number;
  instagram_accounts: number;
  basic_faq: boolean;
  analytics: boolean;
  advanced_analytics: boolean;
  team_handoff: boolean;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  razorpay_subscription_id?: string;
  razorpay_plan_id?: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  start_date?: string;
  end_date?: string;
  next_billing_date?: string;
  messages_used_this_month: number;
  last_usage_reset: string;
  created_at: string;
  updated_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  plan: Plan;
}

export interface Payment {
  id: number;
  subscription_id: number;
  user_id: number;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  billing_start?: string;
  billing_end?: string;
  payment_method?: string;
  failure_reason?: string;
  created_at: string;
  updated_at?: string;
  paid_at?: string;
}

export interface UsageStats {
  messages_used: number;
  messages_limit: number;
  usage_percentage: number;
  days_remaining: number;
  next_reset_date: string;
}

export interface CreateOrderRequest {
  plan_id: number;
  payment_method?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  plan_name: string;
  plan_price: number;
  razorpay_key: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  subscription_id: number;
  plan_name: string;
  valid_until: string;
}

class SubscriptionApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getPlans(): Promise<Plan[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/plans`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }
    
    return response.json();
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/current`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No subscription found is normal for new users
      }
      throw new Error('Failed to fetch subscription');
    }

    return response.json();
  }

  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/create-order`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create order');
    }
    
    return response.json();
  }

  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/verify-payment`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Payment verification failed');
    }
    
    return response.json();
  }

  async upgradeSubscription(newPlanId: number): Promise<CreateOrderResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/upgrade`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ new_plan_id: newPlanId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create upgrade order');
    }
    
    return response.json();
  }

  async cancelSubscription(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/cancel`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to cancel subscription');
    }
    
    return response.json();
  }

  async getUsageStats(): Promise<UsageStats> {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/usage`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch usage stats');
    }
    
    return response.json();
  }

  async getPaymentHistory(): Promise<Payment[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/subscription/payments`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch payment history');
    }
    
    return response.json();
  }

  // Helper method to initiate Razorpay payment
  async initiatePayment(planId: number, userDetails: { name: string; email: string }): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Create order
        const orderData = await this.createOrder({ plan_id: planId });
        
        // Initialize Razorpay
        const options = {
          key: orderData.razorpay_key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'AutoniqueAI',
          description: `Subscription to ${orderData.plan_name}`,
          order_id: orderData.order_id,
          handler: async (response: any) => {
            try {
              // Verify payment
              await this.verifyPayment({
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
        
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const subscriptionApi = new SubscriptionApi();
