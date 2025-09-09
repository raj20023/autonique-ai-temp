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
import AutoMascot, { AutoLoader } from '@/components/ui/AutoMascot';
import { useAutoExpressions } from '@/contexts/AutoContext';

// API function to get user statistics
const getUserStats = async () => {
  const response = await fetch('/api/stats');
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



  const { data: stats } = useQuery(
    'stats',
    getUserStats,
    {
      enabled: isClient && isLoggedIn,
      retry: 1,
      refetchOnWindowFocus: false,
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

  return (
    <>
      <Head>
        <title>Dashboard - AutoniqueAI</title>
        <meta name="description" content="Manage your Instagram auto-reply system" />
      </Head>

      <SubscriptionBanner />

      <DashboardLayout title="Dashboard">
        <div className="space-y-8">
          {/* Modern Welcome Section with Auto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <AutoMascot 
                  expression="happy" 
                  size="xl" 
                  animated={true}
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <p className="text-lg text-gray-600">
                    Auto is ready to help manage your Instagram automation
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-2xl font-bold text-gray-900">
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

          {/* Clean Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active FAQs</p>
                  <p className="text-3xl font-bold text-gray-900">{activeFAQs}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Pages</p>
                  <p className="text-3xl font-bold text-gray-900">{connectedPages}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Instagram className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Auto Replies</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.auto_replies_sent || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.avg_response_time || "< 1s"}</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <AutoMascot expression="working" size="md" animated={true} />
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    router.push('/dashboard/faqs');
                    showSuccess();
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Manage FAQs</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>

                <button
                  onClick={() => {
                    router.push('/settings');
                    showSuccess();
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Instagram className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">Connect Instagram</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>

                <button
                  onClick={() => {
                    window.open('/live-monitor', '_blank');
                    showSuccess();
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">Live Monitor</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <AutoMascot expression="curious" size="md" animated={true} />
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>

              <div className="space-y-4">
                {stats?.recent_activity ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Auto replies sent today</span>
                      <span className="font-semibold text-gray-900">{stats.recent_activity.auto_replies_today || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Messages processed</span>
                      <span className="font-semibold text-gray-900">{stats.recent_activity.messages_processed || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">System status</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AutoMascot expression="sleepy" size="lg" animated={true} />
                    <p className="text-gray-500 mt-4">No recent activity</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
