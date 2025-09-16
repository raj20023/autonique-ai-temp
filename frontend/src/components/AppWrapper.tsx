import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';
import { useBusinessOnboarding } from '../hooks/useBusinessOnboarding';
import BusinessOnboarding from './BusinessOnboarding';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const router = useRouter();
  const {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    isCompleting
  } = useBusinessOnboarding();

  // Don't show onboarding on certain pages
  const excludedPaths = ['/auth/login', '/auth/callback', '/', '/pricing', '/terms', '/privacy'];
  const shouldShowOnboarding = showOnboarding && 
    isAuthenticated() && 
    !excludedPaths.includes(router.pathname) &&
    !router.pathname.startsWith('/auth');

  return (
    <>
      {children}
      {shouldShowOnboarding && (
        <BusinessOnboarding
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
    </>
  );
};

export default AppWrapper;
