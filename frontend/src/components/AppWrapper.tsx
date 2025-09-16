import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';
import { useBusinessOnboarding } from '../hooks/useBusinessOnboarding';
import BusinessOnboarding from './BusinessOnboarding';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    forceShowOnboarding,
    isCompleting
  } = useBusinessOnboarding();

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);

    // Debug event listener
    const handleShowOnboarding = () => {
      console.log('🔧 Debug event received, forcing onboarding');
      forceShowOnboarding();
    };

    window.addEventListener('showOnboarding', handleShowOnboarding);

    return () => {
      window.removeEventListener('showOnboarding', handleShowOnboarding);
    };
  }, [forceShowOnboarding]);

  // Don't show onboarding on certain pages
  const excludedPaths = ['/auth/login', '/auth/callback', '/', '/pricing', '/terms', '/privacy'];
  const shouldShowOnboarding = isClient &&
    showOnboarding &&
    isAuthenticated() &&
    !excludedPaths.includes(router.pathname) &&
    !router.pathname.startsWith('/auth');

  // Debug logging
  console.log('🔍 AppWrapper Debug:', {
    isClient,
    showOnboarding,
    isAuthenticated: isClient ? isAuthenticated() : false,
    currentPath: router.pathname,
    isExcluded: excludedPaths.includes(router.pathname),
    shouldShowOnboarding
  });

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
