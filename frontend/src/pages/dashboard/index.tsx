import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Instagram,
  Plus,
  Activity,
  ArrowRight
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { isAuthenticated } from '@/utils/auth';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import LimitedAccessBanner from '@/components/LimitedAccessBanner';
import SubscriptionDashboard from '@/components/SubscriptionDashboard';
import AutoMascot, { AutoLoader } from '@/components/ui/AutoMascot';
import { useAutoExpressions } from '@/contexts/AutoContext';
import { useSubscription } from '@/hooks/useSubscription';

// API function to get user statistics
const getUserStats = async () => {
  const token = localStorage.getItem('access_token');
  const API_URL = 'http://localhost:8000';

  const response = await fetch(`${API_URL}/api/v1/users/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const { showSuccess } = useAutoExpressions();
  const { currentSubscription, usageStats } = useSubscription();



  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery(
    'stats',
    getUserStats,
    {
      enabled: isClient && isLoggedIn,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );



  useEffect(() => {
    setIsClient(true);
  }, []);

  // Epic redirect loading
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10">
          <AutoLoader 
            expression="working" 
            size="lg" 
            className="mx-auto mb-4" 
          />
          <p className="text-xl font-bold text-white">Auto is redirecting you...</p>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return null;
  }

  const activeFAQs = stats?.active_faqs || 0;
  const connectedPages = stats?.connected_pages || 0;
  const messagesUsed = usageStats?.messages_used || 0;
  const messagesLimit = usageStats?.messages_limit || 0;

  return (
    <>
      <Head>
        <title>Dashboard - AutoniqueAI</title>
        <meta name="description" content="Manage your Instagram auto-reply system" />
        <link rel="icon" href="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg" type="image/svg+xml" />
      </Head>

      <SubscriptionBanner />
      <LimitedAccessBanner />

      <DashboardLayout title="Dashboard">
        {/* Gradient Background */}
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden -m-6 p-6">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0">
            {/* Simple grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          </div>

          <div className="relative z-10 space-y-8">
            {/* Modern Welcome Section with Auto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <AutoMascot
                    expression="happy"
                    size="lg"
                    animated={true}
                  />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                      Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-base sm:text-lg text-white/80 drop-shadow-md">
                      Auto is ready to help manage your Instagram automation
                    </p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-right">
                    <p className="text-sm text-white/60">Today</p>
                    <p className="text-2xl font-bold text-white drop-shadow-lg">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Beautiful Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-2xl p-6 group hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Active FAQs</p>
                    <p className="text-3xl font-bold text-white drop-shadow-lg">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        activeFAQs
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-2xl p-6 group hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Connected Pages</p>
                    <p className="text-3xl font-bold text-white drop-shadow-lg">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        connectedPages
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-2xl p-6 group hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Auto Replies</p>
                    <p className="text-3xl font-bold text-white drop-shadow-lg">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats?.auto_replies_sent || 0
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-2xl p-6 group hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">Response Time</p>
                    <p className="text-3xl font-bold text-white drop-shadow-lg">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats?.avg_response_time || "< 1s"
                      )}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-2xl p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <AutoMascot expression="working" size="md" animated={true} />
                  <h2 className="text-xl font-semibold text-white drop-shadow-lg">Quick Actions</h2>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      router.push('/dashboard/faqs');
                      showSuccess();
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group border border-white/10 hover:border-white/30"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-white">Manage FAQs</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => {
                      router.push('/settings');
                      showSuccess();
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group border border-white/10 hover:border-white/30"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Instagram className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-white">Connect Instagram</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => {
                      window.open('/live-monitor', '_blank');
                      showSuccess();
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group border border-white/10 hover:border-white/30"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-white">Live Monitor</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-2xl p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <AutoMascot expression="curious" size="md" animated={true} />
                  <h2 className="text-xl font-semibold text-white drop-shadow-lg">Recent Activity</h2>
                </div>

                <div className="space-y-4">
                  {statsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                          <span className="text-sm text-white/70 animate-pulse">Loading...</span>
                          <span className="font-semibold text-white animate-pulse">...</span>
                        </div>
                      ))}
                    </div>
                  ) : statsError ? (
                    <div className="text-center py-8">
                      <AutoMascot expression="error" size="lg" animated={true} />
                      <p className="text-red-400 mt-4">Failed to load statistics</p>
                      <p className="text-white/60 text-sm mt-2">Please check your connection and try again</p>
                    </div>
                  ) : stats?.recent_activity ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                        <span className="text-sm text-white/70">Auto replies this week</span>
                        <span className="font-semibold text-white">{stats.recent_activity.auto_replies_this_week || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                        <span className="text-sm text-white/70">Messages this week</span>
                        <span className="font-semibold text-white">{stats.recent_activity.messages_this_week || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                        <span className="text-sm text-white/70">Total messages</span>
                        <span className="font-semibold text-white">{stats.total_messages || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
                        <span className="text-sm text-white/70">System status</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                          {statsError ? 'Error' : 'Active'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AutoMascot expression="sleepy" size="lg" animated={true} />
                      <p className="text-white/60 mt-4">No recent activity</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
