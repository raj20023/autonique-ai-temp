import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { businessApi, OnboardingFormData, OnboardingStatus } from '../services/businessApi';
import { isAuthenticated } from '../utils/auth';

export const useBusinessOnboarding = () => {
  const queryClient = useQueryClient();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Get onboarding status
  const { data: onboardingStatus, isLoading: statusLoading } = useQuery<OnboardingStatus>(
    'onboarding-status',
    () => businessApi.getOnboardingStatus(),
    {
      enabled: isAuthenticated(),
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation(
    (data: OnboardingFormData) => businessApi.completeOnboarding(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('onboarding-status');
        queryClient.invalidateQueries('business-profile');
        setShowOnboarding(false);
      },
      onError: (error) => {
        console.error('Failed to complete onboarding:', error);
      }
    }
  );

  // Check if onboarding should be shown
  useEffect(() => {
    if (onboardingStatus && !onboardingStatus.completed && isAuthenticated()) {
      // Show onboarding if user is authenticated and hasn't completed it
      // But respect the skip flag
      const hasSkipped = localStorage.getItem('onboarding_skipped');
      if (!hasSkipped) {
        setShowOnboarding(true);
      }
    }
  }, [onboardingStatus]);

  const completeOnboarding = (data: OnboardingFormData) => {
    completeOnboardingMutation.mutate(data);
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    // Optionally, you could set a flag in localStorage to remember the skip
    localStorage.setItem('onboarding_skipped', 'true');
  };

  const forceShowOnboarding = () => {
    setShowOnboarding(true);
    // Clear any skip flags
    localStorage.removeItem('onboarding_skipped');
  };

  return {
    showOnboarding,
    onboardingStatus,
    statusLoading,
    completeOnboarding,
    skipOnboarding,
    forceShowOnboarding,
    isCompleting: completeOnboardingMutation.isLoading,
    completionError: completeOnboardingMutation.error
  };
};
