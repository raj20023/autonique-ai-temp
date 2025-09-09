import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Instagram,
  Activity,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface Message {
  timestamp: string;
  instagram_account: string;
  page_name: string;
  customer_message: string;
  our_response: string;
  auto_replied: boolean;
  reply_sent_at: string | null;
  status: string;
}

interface Stats {
  message_activity: {
    last_hour: number;
    last_24_hours: number;
    last_week: number;
  };
  success_rate: number;
  successful_replies_24h: number;
  connected_accounts: number;
  instagram_accounts: Array<{
    page_name: string;
    instagram_username: string;
    webhook_active: boolean;
  }>;
  system_status: string;
  last_updated: string;
}

export default function LiveMonitor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      let response;

      if (token) {
        // Use authenticated endpoint for real user data
        setIsAuthenticated(true);
        response = await fetch('https://api.autonique.in/api/v1/live/live-messages-data', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Use public demo endpoint for reviewers
        setIsAuthenticated(false);
        response = await fetch('https://api.autonique.in/live-messages-demo');
      }

      if (response.ok) {
        const data = await response.json();



        // Set messages
        setMessages(data.messages || []);
        setLastUpdated(data.last_updated);

        // Set stats from the response data
        setStats({
          message_activity: {
            last_hour: Math.floor(data.total_messages / 24), // Estimate
            last_24_hours: data.total_messages,
            last_week: data.total_messages * 7 // Estimate
          },
          success_rate: data.success_rate,
          successful_replies_24h: data.successful_replies,
          connected_accounts: data.connected_accounts,
          instagram_accounts: data.instagram_accounts || [],
          system_status: data.system_status,
          last_updated: data.last_updated
        });
      }
    } catch (error) {
      setIsAuthenticated(false);
      // Set default values to prevent undefined errors
      setStats({
        message_activity: {
          last_hour: 0,
          last_24_hours: 0,
          last_week: 0
        },
        success_rate: 0,
        successful_replies_24h: 0,
        connected_accounts: 0,
        instagram_accounts: [],
        system_status: "Error loading data",
        last_updated: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
      setLoading(false);
    };

    loadData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('✅')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status.includes('❌')) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50/30 to-orange-100/50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Loading Live Monitor</h2>
          <p className="text-neutral-600">Connecting to real-time message stream...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Live Monitor - AutoniqueAI</title>
        <meta name="description" content="Real-time monitoring of Instagram message automation" />
        <link rel="icon" href="/logos/favicon_auto.svg" type="image/svg+xml" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50/30 to-orange-100/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/10 to-orange-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-300/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl scale-110"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/50">
                      <img
                        src="/logos/favicon_auto.svg"
                        alt="AutoniqueAI"
                        className="h-8 w-8"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-900 flex items-center">
                      <Activity className="h-8 w-8 text-orange-500 mr-3" />
                      Live Message Monitor
                    </h1>
                    <div className="flex items-center space-x-3 mt-2">
                      <motion.span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          isAuthenticated
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {isAuthenticated ? '🔐 Your Account' : '🎭 Demo Mode'}
                      </motion.span>
                      <motion.div
                        className="flex items-center space-x-2 text-green-600"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Live</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
                  {isAuthenticated
                    ? 'Real-time Instagram message processing and AI-powered auto-replies for your connected accounts'
                    : 'Live demonstration of Instagram message processing for Facebook App Review - showcasing real-time automation capabilities'
                  }
                </p>
              </div>
              <div className="text-right bg-neutral-50/80 backdrop-blur-sm rounded-2xl p-4 border border-neutral-200/50">
                <p className="text-sm font-medium text-neutral-500 mb-1">Last Updated</p>
                <p className="text-lg font-bold text-neutral-900">{formatTime(lastUpdated)}</p>
                <motion.div
                  className="flex items-center justify-end space-x-1 mt-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-neutral-500">Auto-refresh</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Messages (24h)",
              value: stats?.message_activity?.last_24_hours || 0,
              icon: MessageSquare,
              color: "from-blue-500 to-blue-600",
              bgColor: "from-blue-50 to-blue-100",
              delay: 0
            },
            {
              title: "Success Rate",
              value: `${stats?.success_rate || 0}%`,
              icon: TrendingUp,
              color: "from-green-500 to-green-600",
              bgColor: "from-green-50 to-green-100",
              delay: 0.1
            },
            {
              title: "Connected Accounts",
              value: stats?.connected_accounts || 0,
              icon: Instagram,
              color: "from-purple-500 to-purple-600",
              bgColor: "from-purple-50 to-purple-100",
              delay: 0.2
            },
            {
              title: "System Status",
              value: stats?.system_status || 'Loading...',
              icon: Activity,
              color: "from-orange-500 to-orange-600",
              bgColor: "from-orange-50 to-orange-100",
              delay: 0.3
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: stat.delay, duration: 0.6, ease: "easeOut" }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-neutral-600 mb-2">{stat.title}</p>
                    <motion.p
                      className="text-3xl font-bold text-neutral-900"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: stat.delay }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connected Accounts */}
        {stats && stats.instagram_accounts && stats.instagram_accounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Connected Instagram Accounts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.instagram_accounts.map((account, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="group bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-neutral-900 text-lg">@{account.instagram_username}</p>
                      <p className="text-sm text-neutral-600 font-medium">{account.page_name}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <motion.span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        account.webhook_active
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {account.webhook_active ? '✅ Active' : '❌ Inactive'}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Live Messages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Live Message Activity</h2>
                <p className="text-white/90 text-lg">Real-time Instagram message processing (Last 24 hours)</p>
              </div>
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <MessageSquare className="h-10 w-10 text-orange-600" />
                </motion.div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Recent Messages</h3>
                <p className="text-neutral-600 mb-4">No messages processed in the last 24 hours</p>
                <p className="text-sm text-neutral-500 bg-neutral-50 rounded-xl p-4 max-w-md mx-auto">
                  💡 Send a message to your connected Instagram account to see live processing in action
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {messages.map((message, index) => (
                  <motion.div
                    key={`${message.timestamp}-${index}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="p-6 hover:bg-neutral-50/50 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className="flex-shrink-0 mt-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        {getStatusIcon(message.status)}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                              <Instagram className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-neutral-900">
                                @{message.instagram_account}
                              </p>
                              <p className="text-sm text-neutral-500">{formatTime(message.timestamp)}</p>
                            </div>
                          </div>
                          <motion.span
                            className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            {message.status}
                          </motion.span>
                        </div>

                        <div className="space-y-3">
                          <motion.div
                            className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200/50"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">C</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-blue-900 mb-1">Customer Message</p>
                                <p className="text-blue-800 leading-relaxed">"{message.customer_message}"</p>
                              </div>
                            </div>
                          </motion.div>

                          {message.our_response ? (
                            <motion.div
                              className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200/50"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-white text-xs font-bold">AI</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-green-900 mb-1">AutoniqueAI Response</p>
                                  <p className="text-green-800 leading-relaxed">"{message.our_response}"</p>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-4 border border-yellow-200/50"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-start space-x-3">
                                <motion.div
                                  className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Clock className="h-3 w-3 text-white" />
                                </motion.div>
                                <div>
                                  <p className="text-sm font-medium text-yellow-900 mb-1">Processing</p>
                                  <p className="text-yellow-800 italic">AI response generation in progress...</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-neutral-100">
                          <div className="flex items-center space-x-4 text-xs text-neutral-500">
                            <span className="bg-neutral-100 px-2 py-1 rounded-lg">📄 {message.page_name}</span>
                            {message.reply_sent_at && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                                ✅ Sent: {formatTime(message.reply_sent_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer Note for Reviewers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200/50 rounded-3xl p-8 backdrop-blur-sm"
        >
          <div className="flex items-start space-x-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Activity className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-3">📋 For Facebook App Reviewers</h3>
              <div className="space-y-2 text-blue-800">
                <p className="leading-relaxed">
                  This live monitor demonstrates <strong>real-time Instagram message processing</strong> by AutoniqueAI.
                  All messages displayed here are actual customer interactions processed through our
                  Instagram auto-reply system using the requested Facebook permissions.
                </p>
                <div className="bg-white/50 rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-blue-900 mb-2">🔧 Technical Implementation:</h4>
                  <ul className="text-sm space-y-1 text-blue-700">
                    <li>• <strong>Webhook Integration:</strong> Real-time message reception via Facebook Graph API</li>
                    <li>• <strong>AI Processing:</strong> Intelligent FAQ matching and response generation</li>
                    <li>• <strong>Auto-Reply System:</strong> Instant customer service automation</li>
                    <li>• <strong>Live Monitoring:</strong> Real-time activity tracking and analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
