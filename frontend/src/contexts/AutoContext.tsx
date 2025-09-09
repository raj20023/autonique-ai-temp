import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AutoExpression } from '@/components/ui/AutoMascot';

interface AutoContextType {
  currentExpression: AutoExpression;
  setExpression: (expression: AutoExpression) => void;
  showAuto: (expression: AutoExpression, duration?: number) => void;
  hideAuto: () => void;
  isVisible: boolean;
}

const AutoContext = createContext<AutoContextType | undefined>(undefined);

interface AutoProviderProps {
  children: ReactNode;
}

export function AutoProvider({ children }: AutoProviderProps) {
  const [currentExpression, setCurrentExpression] = useState<AutoExpression>('normal');
  const [isVisible, setIsVisible] = useState(true);

  const setExpression = (expression: AutoExpression) => {
    setCurrentExpression(expression);
    setIsVisible(true);
  };

  const showAuto = (expression: AutoExpression, duration?: number) => {
    setCurrentExpression(expression);
    setIsVisible(true);
    
    if (duration) {
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
  };

  const hideAuto = () => {
    setIsVisible(false);
  };

  // Auto expressions based on page/context
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/') {
      setExpression('hello');
    } else if (path === '/auth/login') {
      setExpression('excited');
    } else if (path.includes('/dashboard/faqs')) {
      setExpression('faq');
    } else if (path.includes('/dashboard')) {
      setExpression('happy');
    } else {
      setExpression('normal');
    }
  }, []);

  // Listen for errors globally
  useEffect(() => {
    const handleError = () => {
      showAuto('error', 3000);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  const value = {
    currentExpression,
    setExpression,
    showAuto,
    hideAuto,
    isVisible,
  };

  return (
    <AutoContext.Provider value={value}>
      {children}
    </AutoContext.Provider>
  );
}

export function useAuto() {
  const context = useContext(AutoContext);
  if (context === undefined) {
    throw new Error('useAuto must be used within an AutoProvider');
  }
  return context;
}

// Hook for specific Auto expressions
export function useAutoExpressions() {
  const { showAuto } = useAuto();

  return {
    showSuccess: () => showAuto('happy', 2000),
    showError: () => showAuto('error', 3000),
    showLoading: () => showAuto('working'),
    showCurious: () => showAuto('curious', 2000),
    showShocked: () => showAuto('shocked', 2000),
    showSleepy: () => showAuto('sleepy'),
    showExcited: () => showAuto('excited', 2000),
  };
}
