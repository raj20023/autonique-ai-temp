import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Instagram,
  Activity,
  Users,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface Message {
  id: number;
  timestamp: string;
  page_name: string;
  instagram_username: string;
  customer_message: string;
  our_response: string;
  auto_replied: boolean;
  reply_sent_at: string | null;
  similarity_score: number;
  ig_user_id: string;
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

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('https://api.autonique.in/api/v1/live/live-messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setLastUpdated(data.last_updated);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('https://api.autonique.in/api/v1/live/message-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchMessages(), fetchStats()]);
      setLoading(false);
    };

    loadData();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchMessages();
      fetchStats();
    }, 10000);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading live message monitoring...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Activity className="h-6 w-6 text-blue-500 mr-2" />
                  AutoniqueAI Live Message Monitor
                </h1>
                <p className="text-gray-600 mt-1">
                  Real-time Instagram message processing for Facebook App Review
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">{formatTime(lastUpdated)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages (24h)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.message_activity.last_24_hours}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.success_rate}%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <Instagram className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.connected_accounts}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-lg font-bold text-gray-900">{stats.system_status}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Connected Accounts */}
        {stats && stats.instagram_accounts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Instagram Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.instagram_accounts.map((account, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Instagram className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">@{account.instagram_username}</p>
                    <p className="text-sm text-gray-600">{account.page_name}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    account.webhook_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {account.webhook_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Messages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Live Message Activity</h2>
            <p className="text-sm text-gray-600">Real-time Instagram message processing (Last 24 hours)</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {messages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No messages in the last 24 hours</p>
                <p className="text-sm text-gray-500">Send a message to your Instagram account to see live processing</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(message.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            @{message.instagram_username}
                          </p>
                          <span className="text-sm text-gray-500">•</span>
                          <p className="text-sm text-gray-500">{formatTime(message.timestamp)}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{message.status}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Customer:</span> "{message.customer_message}"
                          </p>
                        </div>
                        
                        {message.our_response && (
                          <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">AutoniqueAI:</span> "{message.our_response}"
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {message.similarity_score && (
                        <p className="text-xs text-gray-500 mt-2">
                          FAQ Match Score: {(message.similarity_score * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Footer Note for Reviewers */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Activity className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">For Facebook App Reviewers</h3>
              <p className="text-sm text-blue-700 mt-1">
                This page demonstrates real-time Instagram message processing by AutoniqueAI. 
                All messages shown here are actual customer interactions processed through our 
                Instagram auto-reply system using the requested Facebook permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
