import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Sparkles, 
  MessageCircle, 
  Clock, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Rocket,
  Heart,
  Zap
} from 'lucide-react';

interface OnboardingData {
  // Step 1: Business Basics
  business_name: string;
  business_type: string;
  industry: string;
  
  // Step 2: Brand Personality
  business_description: string;
  brand_personality: string;
  target_audience: string;
  
  // Step 3: Communication Style
  communication_tone: string;
  response_style: string;
  greeting_style: string;
  closing_style: string;
  use_emojis: boolean;
  
  // Step 4: Business Operations
  business_hours: string;
  location: string;
  website: string;
  
  // Step 5: Customer Service
  typical_customer_questions: string;
  common_issues: string;
  special_offers: string;
  mention_business_name: boolean;
}

interface BusinessOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const BusinessOnboarding: React.FC<BusinessOnboardingProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    business_name: '',
    business_type: '',
    industry: '',
    business_description: '',
    brand_personality: '',
    target_audience: '',
    communication_tone: '',
    response_style: '',
    greeting_style: '',
    closing_style: '',
    use_emojis: true,
    business_hours: '',
    location: '',
    website: '',
    typical_customer_questions: '',
    common_issues: '',
    special_offers: '',
    mention_business_name: true
  });

  const totalSteps = 5;

  const updateFormData = (field: keyof OnboardingData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const businessTypes = [
    'Restaurant/Food', 'Fashion/Clothing', 'Beauty/Cosmetics', 'Technology', 'Health/Fitness',
    'Education', 'Real Estate', 'Travel', 'Photography', 'Art/Design', 'Consulting', 'Other'
  ];

  const personalities = [
    'Friendly & Approachable', 'Professional & Formal', 'Fun & Playful', 'Luxury & Sophisticated',
    'Casual & Relaxed', 'Energetic & Enthusiastic', 'Caring & Supportive', 'Creative & Artistic'
  ];

  const tones = [
    'Warm & Friendly', 'Professional', 'Casual & Conversational', 'Enthusiastic',
    'Helpful & Supportive', 'Confident & Authoritative', 'Empathetic & Understanding'
  ];

  const responseStyles = [
    'Detailed & Informative', 'Concise & To-the-point', 'Conversational & Engaging',
    'Step-by-step Instructions', 'Emoji-rich & Visual', 'FAQ-style Answers'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Building2 className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Tell us about your business! 🏢</h2>
              <p className="text-white/70">Let's start with the basics so we can personalize your AI assistant</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">What's your business name? ✨</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => updateFormData('business_name', e.target.value)}
                  placeholder="e.g., Bella's Boutique, TechFlow Solutions..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">What type of business is it? 🎯</label>
                <select
                  value={formData.business_type}
                  onChange={(e) => updateFormData('business_type', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose your business type...</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type} className="bg-gray-800">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Describe your business in one sentence 📝</label>
                <textarea
                  value={formData.business_description}
                  onChange={(e) => updateFormData('business_description', e.target.value)}
                  placeholder="e.g., We create handmade jewelry that tells your unique story..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">What's your brand personality? 💫</h2>
              <p className="text-white/70">Help us understand your vibe so your AI sounds just like you!</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">How would you describe your brand? 🎨</label>
                <div className="grid grid-cols-2 gap-3">
                  {personalities.map(personality => (
                    <button
                      key={personality}
                      onClick={() => updateFormData('brand_personality', personality)}
                      className={`p-3 rounded-xl border transition-all ${
                        formData.brand_personality === personality
                          ? 'bg-purple-500 border-purple-400 text-white'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {personality}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Who are your ideal customers? 👥</label>
                <input
                  type="text"
                  value={formData.target_audience}
                  onChange={(e) => updateFormData('target_audience', e.target.value)}
                  placeholder="e.g., Young professionals, busy moms, tech enthusiasts..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <MessageCircle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">How do you like to chat? 💬</h2>
              <p className="text-white/70">Let's set up your communication style preferences</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Communication tone 🗣️</label>
                <div className="grid grid-cols-2 gap-3">
                  {tones.map(tone => (
                    <button
                      key={tone}
                      onClick={() => updateFormData('communication_tone', tone)}
                      className={`p-3 rounded-xl border transition-all ${
                        formData.communication_tone === tone
                          ? 'bg-blue-500 border-blue-400 text-white'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Response style 📋</label>
                <select
                  value={formData.response_style}
                  onChange={(e) => updateFormData('response_style', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose your style...</option>
                  {responseStyles.map(style => (
                    <option key={style} value={style} className="bg-gray-800">{style}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.use_emojis}
                    onChange={(e) => updateFormData('use_emojis', e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  <span>Use emojis in responses 😊</span>
                </label>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Clock className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Business operations 🕒</h2>
              <p className="text-white/70">Help customers know when and where to find you</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Business hours ⏰</label>
                <input
                  type="text"
                  value={formData.business_hours}
                  onChange={(e) => updateFormData('business_hours', e.target.value)}
                  placeholder="e.g., Mon-Fri 9AM-6PM, Weekends 10AM-4PM"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Location 📍</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="e.g., New York City, Online only, Multiple locations..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Website (optional) 🌐</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="e.g., www.yourbusiness.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Users className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Customer service magic ✨</h2>
              <p className="text-white/70">Final touches to make your AI assistant amazing!</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">What do customers usually ask about? 🤔</label>
                <textarea
                  value={formData.typical_customer_questions}
                  onChange={(e) => updateFormData('typical_customer_questions', e.target.value)}
                  placeholder="e.g., Pricing, delivery times, product availability, return policy..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Any current offers or promotions? 🎉</label>
                <textarea
                  value={formData.special_offers}
                  onChange={(e) => updateFormData('special_offers', e.target.value)}
                  placeholder="e.g., 20% off first order, Free shipping over $50, Buy 2 get 1 free..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.mention_business_name}
                    onChange={(e) => updateFormData('mention_business_name', e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span>Mention business name in responses</span>
                </label>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-white font-medium">Almost done!</span>
                </div>
                <p className="text-white/70 text-sm">
                  Your AI assistant will use this information to provide personalized,
                  on-brand responses that sound just like you! 🚀
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/70">Step {currentStep} of {totalSteps}</span>
            <button
              onClick={onSkip}
              className="text-white/70 hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
              currentStep === 1
                ? 'text-white/40 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <span>{currentStep === totalSteps ? 'Complete Setup' : 'Continue'}</span>
            {currentStep === totalSteps ? (
              <Rocket className="h-5 w-5" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessOnboarding;
