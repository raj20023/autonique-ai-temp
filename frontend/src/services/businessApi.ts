// Temporarily use local backend for testing the enum fix
const API_BASE_URL = 'http://localhost:8000';

export interface BusinessProfile {
  id: number;
  user_id: number;
  business_name?: string;
  business_type?: string;
  industry?: string;
  business_description?: string;
  brand_personality?: string;
  target_audience?: string;
  communication_tone?: string;
  preferred_language?: string;
  response_style?: string;
  business_hours?: string;
  location?: string;
  website?: string;
  typical_customer_questions?: string;
  common_issues?: string;
  special_offers?: string;
  greeting_style?: string;
  closing_style?: string;
  use_emojis?: boolean;
  mention_business_name?: boolean;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface OnboardingFormData {
  business_name?: string;
  business_type?: string;
  industry?: string;
  business_description?: string;
  brand_personality?: string;
  target_audience?: string;
  communication_tone?: string;
  response_style?: string;
  greeting_style?: string;
  closing_style?: string;
  use_emojis?: boolean;
  business_hours?: string;
  location?: string;
  website?: string;
  typical_customer_questions?: string;
  common_issues?: string;
  special_offers?: string;
  mention_business_name?: boolean;
}

export interface OnboardingStatus {
  completed: boolean;
  has_profile: boolean;
  completed_at?: string;
}

class BusinessApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getProfile(): Promise<BusinessProfile | null> {
    const response = await fetch(`${API_BASE_URL}/api/v1/business/profile`, {
      headers: this.getAuthHeaders()
    });

    if (response.status === 404) {
      return null; // No profile exists yet
    }

    if (!response.ok) {
      throw new Error('Failed to fetch business profile');
    }

    return response.json();
  }

  async createProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const response = await fetch(`${API_BASE_URL}/api/v1/business/profile`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to create business profile');
    }

    return response.json();
  }

  async updateProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const response = await fetch(`${API_BASE_URL}/api/v1/business/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update business profile');
    }

    return response.json();
  }

  async completeOnboarding(data: OnboardingFormData): Promise<{ message: string; profile: BusinessProfile }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/business/onboarding/complete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to complete onboarding');
    }

    return response.json();
  }

  async getOnboardingStatus(): Promise<OnboardingStatus> {
    const response = await fetch(`${API_BASE_URL}/api/v1/business/onboarding/status`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch onboarding status');
    }

    return response.json();
  }

  async getBusinessContext(): Promise<{ context: string; has_context: boolean; business_name?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/business/context`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch business context');
    }

    return response.json();
  }
}

export const businessApi = new BusinessApi();
