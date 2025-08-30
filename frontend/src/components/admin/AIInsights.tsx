import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, Target,
  Zap, Eye, ChevronRight, X, CheckCircle, Clock
} from 'lucide-react';
import { AIInsight } from '../../services/analytics';

interface AIInsightsProps {
  insights: AIInsight[];
  onDismiss?: (id: string) => void;
  onAction?: (id: string) => void;
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights, onDismiss, onAction }) => {
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'opportunity': return <Lightbulb className="h-5 w-5" />;
      case 'prediction': return <TrendingUp className="h-5 w-5" />;
      case 'anomaly': return <Eye className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string, impact: string) => {
    const baseColors = {
      warning: 'from-red-500 to-orange-500',
      opportunity: 'from-green-500 to-emerald-500',
      prediction: 'from-blue-500 to-indigo-500',
      anomaly: 'from-purple-500 to-pink-500'
    };

    const intensities = {
      low: 'opacity-60',
      medium: 'opacity-80',
      high: 'opacity-90',
      critical: 'opacity-100'
    };

    return `bg-gradient-to-r ${baseColors[type as keyof typeof baseColors]} ${intensities[impact as keyof typeof intensities]}`;
  };

  const handleDismiss = (id: string) => {
    setDismissedInsights(prev => new Set([...prev, id]));
    onDismiss?.(id);
  };

  const visibleInsights = insights.filter(insight => !dismissedInsights.has(insight.id));

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-8 w-8" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
            <p className="text-purple-100">Real-time intelligence for smarter decisions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{visibleInsights.length}</div>
            <div className="text-sm text-purple-200">Active Insights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {visibleInsights.filter(i => i.actionable).length}
            </div>
            <div className="text-sm text-purple-200">Actionable</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(visibleInsights.reduce((acc, i) => acc + i.confidence, 0) / visibleInsights.length * 100)}%
            </div>
            <div className="text-sm text-purple-200">Avg Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {visibleInsights.filter(i => i.impact === 'high' || i.impact === 'critical').length}
            </div>
            <div className="text-sm text-purple-200">High Impact</div>
          </div>
        </div>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {visibleInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Insight Header */}
              <div className={`${getInsightColor(insight.type, insight.impact)} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getInsightIcon(insight.type)}
                    <div>
                      <h3 className="font-semibold">{insight.title}</h3>
                      <div className="flex items-center space-x-2 text-sm opacity-90">
                        <span className="capitalize">{insight.type}</span>
                        <span>•</span>
                        <span className="capitalize">{insight.impact} Impact</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDismiss(insight.id)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Insight Content */}
              <div className="p-4">
                <p className="text-gray-700 mb-4">{insight.description}</p>
                
                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Confidence</span>
                    <span>{Math.round(insight.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${insight.confidence * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(insight.timestamp).toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {insight.actionable && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAction?.(insight.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Take Action
                      </motion.button>
                    )}
                    <button
                      onClick={() => setSelectedInsight(insight)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  
                  {insight.impact === 'critical' && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      URGENT
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detailed Insight Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`${getInsightColor(selectedInsight.type, selectedInsight.impact)} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getInsightIcon(selectedInsight.type)}
                    <h2 className="text-xl font-bold">{selectedInsight.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedInsight(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 text-lg mb-6">{selectedInsight.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Confidence Level</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(selectedInsight.confidence * 100)}%
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Impact Level</h4>
                    <div className={`text-2xl font-bold capitalize ${
                      selectedInsight.impact === 'critical' ? 'text-red-600' :
                      selectedInsight.impact === 'high' ? 'text-orange-600' :
                      selectedInsight.impact === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {selectedInsight.impact}
                    </div>
                  </div>
                </div>

                {selectedInsight.actionable && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Recommended Actions
                    </h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Review the affected metrics in detail</li>
                      <li>• Implement suggested optimizations</li>
                      <li>• Monitor results over the next 24-48 hours</li>
                      <li>• Set up alerts for similar patterns</li>
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {visibleInsights.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No new insights at the moment. Our AI is continuously monitoring your system.</p>
        </motion.div>
      )}
    </div>
  );
};

export default AIInsights;
