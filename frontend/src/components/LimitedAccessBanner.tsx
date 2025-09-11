import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Eye, 
  AlertTriangle, 
  Crown, 
  X, 
  Upgrade,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface LimitedAccessInfo {
  can_access: string[];
  cannot_access: string[];
  limits: {
    max_faqs?: number;
    max_messages_per_day?: number;
    dashboard_access?: string;
  };
}

interface AccessStatus {
  has_access: boolean;
  reason: string;
  trial_expired?: boolean;
  limited_access?: boolean;
  role: string;
}

interface LimitedAccessBannerProps {
  show?: boolean;
  onUpgrade?: () => void;
  onDismiss?: () => void;
}

export default function LimitedAccessBanner({ 
  show = true, 
  onUpgrade,
  onDismiss 
}: LimitedAccessBannerProps) {
  const [limitedAccess, setLimitedAccess] = useState<LimitedAccessInfo | null>(null);
  const [accessStatus, setAccessStatus] = useState<AccessStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    fetchLimitedAccessInfo();
  }, []);

  const fetchLimitedAccessInfo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('https://api.autonique.in/api/v1/user-management/limited-access', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setLimitedAccess(data.limited_access);
        setAccessStatus(data.access_status);
      }
    } catch (error) {
      console.error('Failed to fetch limited access info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    onUpgrade?.();
    window.location.href = '/pricing';
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (loading || !accessStatus || !isVisible) {
    return null;
  }

  // Only show for expired trial users with limited access
  if (!accessStatus.limited_access || accessStatus.has_access) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Lock className="h-6 w-6 mt-1" />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-lg mb-2">
                  Trial Expired - Limited Access Mode
                </h3>
                
                <p className="text-sm opacity-90 mb-3">
                  Your 14-day free trial has ended. You now have limited access to AutoniqueAI features.
                </p>

                {limitedAccess && (
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {/* What you can still access */}
                    <div className="bg-white/10 rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        You Can Still:
                      </h4>
                      <ul className="space-y-1 text-xs">
                        {limitedAccess.can_access.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Eye className="h-3 w-3 mr-2 flex-shrink-0" />
                            {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What's restricted */}
                    <div className="bg-white/10 rounded-lg p-3">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <XCircle className="h-4 w-4 mr-1" />
                        Upgrade Needed For:
                      </h4>
                      <ul className="space-y-1 text-xs">
                        {limitedAccess.cannot_access.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Lock className="h-3 w-3 mr-2 flex-shrink-0" />
                            {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpgrade}
                className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Crown className="h-4 w-4" />
                <span>Upgrade Now</span>
              </motion.button>
              
              <button
                onClick={handleDismiss}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Limited Access Indicator for UI elements
export function LimitedAccessIndicator({ 
  feature, 
  className = '' 
}: { 
  feature: string;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 ${className}`}>
      <Lock className="h-3 w-3 mr-1" />
      Limited Access
    </div>
  );
}

// Feature Lock Overlay
export function FeatureLockOverlay({ 
  children, 
  isLocked = false,
  onUpgrade 
}: { 
  children: React.ReactNode;
  isLocked?: boolean;
  onUpgrade?: () => void;
}) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 text-center max-w-sm mx-4"
        >
          <Lock className="h-8 w-8 text-orange-500 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Premium Feature</h3>
          <p className="text-sm text-gray-600 mb-4">
            Upgrade to access this feature and unlock unlimited potential.
          </p>
          <button
            onClick={onUpgrade}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Upgrade Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
