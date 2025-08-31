import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Instagram, CheckCircle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function InstagramSetup() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectInstagram = () => {
    setLoading(true);
    
    // Simple Instagram connection - user selects their Instagram account
    const instagramAuthUrl = `https://www.facebook.com/v23.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Finstagram-callback&scope=instagram_basic%2Cinstagram_manage_messages&response_type=code&auth_type=rerequest&display=popup`;
    
    // Open Instagram auth in popup
    const popup = window.open(
      instagramAuthUrl,
      'instagram-auth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // Listen for popup completion
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        setLoading(false);
        // Check if connection was successful
        checkInstagramConnection();
      }
    }, 1000);
  };

  const checkInstagramConnection = async () => {
    try {
      const response = await fetch('https://api.autonique.in/api/v1/pages/instagram-details', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.instagram_username) {
          setConnected(true);
          setError(null);
        }
      }
    } catch (error) {
      console.error('Failed to check Instagram connection:', error);
    }
  };

  useEffect(() => {
    checkInstagramConnection();
  }, []);

  return (
    <>
      <Head>
        <title>Connect Instagram - AutoniqueAI</title>
        <meta name="description" content="Connect your Instagram account for automated DM management" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-6"
            >
              <Instagram className="h-12 w-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Connect Your Instagram Account
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect your Instagram Business account to start automating your DMs and engaging with your audience.
            </p>
          </motion.div>

          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8"
          >
            {connected ? (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Instagram Connected!</h2>
                <p className="text-gray-300 mb-6">
                  Your Instagram account is successfully connected and ready for automation.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center mx-auto"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </motion.button>
              </div>
            ) : (
              <div className="text-center">
                <Instagram className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Connect Instagram</h2>
                <p className="text-gray-300 mb-6">
                  Click the button below to connect your Instagram Business account. You'll be able to select which Instagram account to use for automation.
                </p>
                
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center text-red-300">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {error}
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connectInstagram}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center mx-auto disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Instagram className="h-5 w-5 mr-2" />
                      Connect Instagram Account
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: '🤖',
                title: 'Automated DMs',
                description: 'Automatically respond to Instagram messages with AI-powered responses'
              },
              {
                icon: '⚡',
                title: 'Instant Replies',
                description: 'Never miss a message with lightning-fast automated responses'
              },
              {
                icon: '📊',
                title: 'Analytics',
                description: 'Track engagement and response rates with detailed analytics'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 max-w-2xl mx-auto">
              <Sparkles className="h-6 w-6 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Why This Approach?</h3>
              <p className="text-gray-300 text-sm">
                We use a simplified connection method that lets you directly select your Instagram account during the authentication process. 
                This avoids complex Facebook Business Manager requirements and gets you up and running quickly!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
