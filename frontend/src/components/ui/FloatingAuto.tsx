import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import AutoMascot, { AutoExpression } from './AutoMascot';
import { useAuto } from '@/contexts/AutoContext';

interface FloatingAutoProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showMessage?: boolean;
  message?: string;
  onInteraction?: () => void;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

export default function FloatingAuto({
  position = 'bottom-right',
  showMessage = false,
  message = "Hi! I'm Auto, your AI assistant. How can I help?",
  onInteraction
}: FloatingAutoProps) {
  const { currentExpression, isVisible } = useAuto();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onInteraction?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {/* Message Bubble */}
        {(showMessage || isExpanded) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 max-w-xs"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 relative">
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 left-6 transform translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AutoMascot 
                  expression={currentExpression}
                  size="sm"
                  animated={true}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {message}
                  </p>
                  {isExpanded && (
                    <div className="mt-3 space-y-2">
                      <button className="w-full text-left text-xs text-blue-600 hover:text-blue-700 transition-colors">
                        💬 Chat with Auto
                      </button>
                      <button className="w-full text-left text-xs text-blue-600 hover:text-blue-700 transition-colors">
                        ❓ Get Help
                      </button>
                      <button className="w-full text-left text-xs text-blue-600 hover:text-blue-700 transition-colors">
                        📚 View FAQs
                      </button>
                    </div>
                  )}
                </div>
                {isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto Avatar Button */}
      <motion.button
        onClick={handleClick}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 10px 25px rgba(59, 130, 246, 0.3)',
            '0 10px 25px rgba(147, 51, 234, 0.3)',
            '0 10px 25px rgba(59, 130, 246, 0.3)',
          ],
        }}
        transition={{
          boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <AutoMascot 
          expression={currentExpression}
          size="md"
          animated={true}
          className="text-white"
        />
        
        {/* Notification dot for new messages/updates */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              Chat with Auto
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Specialized floating Auto for different contexts
export function DashboardFloatingAuto() {
  return (
    <FloatingAuto
      position="bottom-right"
      message="Hi! I'm Auto. Need help managing your Instagram automation?"
      onInteraction={() => {
        // Could open help modal or chat
        console.log('Dashboard Auto interaction');
      }}
    />
  );
}

export function FAQFloatingAuto() {
  return (
    <FloatingAuto
      position="bottom-right"
      message="I can help you create better FAQs! What questions do your customers ask most?"
      onInteraction={() => {
        // Could suggest FAQ templates
        console.log('FAQ Auto interaction');
      }}
    />
  );
}

export function ErrorFloatingAuto() {
  return (
    <FloatingAuto
      position="bottom-right"
      message="Oops! Something went wrong. Let me help you fix this."
      onInteraction={() => {
        // Could show error recovery options
        console.log('Error Auto interaction');
      }}
    />
  );
}
