import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Instagram,
  CheckCircle,
  AlertCircle,
  Plus,
  Activity
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { pagesApi } from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';
import toast from 'react-hot-toast';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { BetaUserBadge, AccessStatusIndicator } from '@/components/SubscriptionBanner';
import { AutoLoader } from '@/components/ui/AutoMascot';

// API function to get user statistics
const getUserStats = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('https://api.autonique.in/api/v1/users/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return response.json();
};

const StatCard = ({ title, value, icon: Icon, gradient, change, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="group relative"
    whileHover={{ y: -5, scale: 1.02 }}
  >
    {/* Glowing Background */}
    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>

    {/* Card */}
    <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 group-hover:border-white/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white/70 mb-2">{title}</p>
          <motion.p
            className="text-3xl font-black text-white mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {value}
          </motion.p>
          {change !== null && change !== undefined && (
            <p className={`text-sm font-medium ${change > 0 ? 'text-emerald-400' : change < 0 ? 'text-red-400' : 'text-white/60'}`}>
              {change > 0 ? '+' : ''}{change}% neural boost
            </p>
          )}
        </div>
        <motion.div
          className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}
          animate={{
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
        >
          <Icon className="h-8 w-8 text-white" />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  // Always call hooks at the top level
  const { data: pages } = useQuery(
    'pages',
    () => pagesApi.getPages().then(res => res.data),
    { enabled: isLoggedIn && isClient }
  );

  // Fetch Instagram account details for dashboard display
  const { data: instagramData } = useQuery(
    'instagramDetails',
    async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://api.autonique.in/api/v1/pages/instagram-details', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch Instagram details');
      return response.json();
    },
    { enabled: isLoggedIn && isClient }
  );



  // Fetch user statistics
  const { data: stats } = useQuery(
    'userStats',
    getUserStats,
    {
      enabled: isLoggedIn && isClient,
      refetchInterval: 30000 // Refresh every 30 seconds
    }
  );

  const subscribeWebhookMutation = useMutation(
    (pageId: number) => pagesApi.subscribeWebhook(pageId),
    {
      onSuccess: () => {
        toast.success('Webhook subscription activated!');
        queryClient.invalidateQueries('pages');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'Failed to subscribe to webhooks');
      }
    }
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isClient, router]);

  // Epic loading state while client-side hydration happens
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Cosmic Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="text-center relative z-10">
          <motion.div
            className="w-20 h-20 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              background: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)',
              mask: 'radial-gradient(circle at center, transparent 60%, black 60%)',
            }}
          />
          <p className="text-2xl font-bold text-white">Initializing Neural Network...</p>
        </div>
      </div>
    );
  }

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

  if (!isLoggedIn) {
    return null;
  }

  const activeFAQs = stats?.active_faqs || 0;
  const connectedPages = stats?.connected_pages || 0;
  const webhookPages = pages?.filter(page => page.webhook_subscribed).length || 0;

  return (
    <>
      <Head>
        <title>Dashboard - AutoniqueAI</title>
        <meta name="description" content="Manage your Instagram auto-reply system" />
      </Head>

      <SubscriptionBanner />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Epic Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <DashboardLayout title="Neural Command Center">
          <div className="space-y-12 relative z-10">
            {/* Epic Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative group"
            >
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

              <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl p-10 border border-white/20 shadow-2xl">
                <motion.h1
                  className="text-4xl lg:text-5xl font-black mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    Welcome back,
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    {user?.name}! 🚀
                  </span>
                </motion.h1>
                <motion.p
                  className="text-xl text-white/80 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Your <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-bold">Neural AI Network</span> is revolutionizing customer engagement 24/7.
                </motion.p>
              </div>
            </motion.div>

            {/* Professional Stats Grid - Cohesive Color Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                title="Neural FAQs"
                value={activeFAQs}
                icon={MessageSquare}
                gradient="from-indigo-500 to-indigo-600"
                change={null}
                index={0}
              />
              <StatCard
                title="Connected Accounts"
                value={connectedPages}
                icon={Instagram}
                gradient="from-indigo-600 to-purple-600"
                change={null}
                index={1}
              />
              <StatCard
                title="AI Responses Sent"
                value={stats?.auto_replies_sent || 0}
                icon={TrendingUp}
                gradient="from-purple-600 to-violet-600"
                change={stats?.recent_activity?.auto_reply_change_percent || null}
                index={2}
              />
              <StatCard
                title="Response Speed"
                value={stats?.avg_response_time || "< 1s"}
                icon={Clock}
                gradient="from-violet-600 to-purple-700"
                change={null}
                index={3}
              />
            </div>



            {/* Revolutionary Quick Actions & Status */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Epic Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative group"
              >
                {/* Professional Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

                <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-white mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Quick Actions
                  </h2>

                  <div className="space-y-6">
                    <motion.button
                      onClick={() => router.push('/dashboard/faqs')}
                      className="group/btn w-full flex items-center justify-between p-6 backdrop-blur-xl bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20"
                      whileHover={{ x: 10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center"
                          animate={{ rotate: [0, 5, 0, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Plus className="h-6 w-6 text-white" />
                        </motion.div>
                        <span className="font-bold text-white text-lg group-hover/btn:text-transparent group-hover/btn:bg-gradient-to-r group-hover/btn:from-indigo-400 group-hover/btn:to-purple-400 group-hover/btn:bg-clip-text transition-all duration-300">
                          Create FAQ
                        </span>
                      </div>
                      <motion.span
                        className="text-white/60 text-xl"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        →
                      </motion.span>
                    </motion.button>

                    <motion.button
                      onClick={() => router.push('/dashboard/faqs?tab=upload')}
                      className="group/btn w-full flex items-center justify-between p-6 backdrop-blur-xl bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20"
                      whileHover={{ x: 10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center"
                          animate={{ rotate: [0, 5, 0, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                          <MessageSquare className="h-6 w-6 text-white" />
                        </motion.div>
                        <span className="font-bold text-white text-lg group-hover/btn:text-transparent group-hover/btn:bg-gradient-to-r group-hover/btn:from-purple-400 group-hover/btn:to-violet-400 group-hover/btn:bg-clip-text transition-all duration-300">
                          Upload Dataset
                        </span>
                      </div>
                      <motion.span
                        className="text-white/60 text-xl"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      >
                        →
                      </motion.span>
                    </motion.button>

                    <div className="text-center py-8">
                      <p className="text-lg text-white/80 mb-6 font-semibold">
                        Your <span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">AI System</span> is revolutionizing engagement!
                      </p>

                      <motion.a
                        href="/live-monitor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-violet-500/25"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Activity className="h-5 w-5 mr-3" />
                        Live Monitor
                      </motion.a>

                      <p className="text-sm text-white/50 mt-4">
                        Real-time activity monitoring
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-900">Instagram Connection</span>
                  </div>
                  <span className="text-green-600 text-sm">Active</span>
                </div>





              </div>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-900">Instagram Connection</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {webhookPages > 0 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                    <span className="text-gray-900">Webhook Subscription</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      webhookPages > 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {webhookPages > 0 ? 'Active' : 'Setup Required'}
                    </span>
                    {webhookPages === 0 && (
                      <button
                        onClick={() => {
                          if (pages && pages.length > 0) {
                            subscribeWebhookMutation.mutate(pages[0].id);
                          } else {
                            toast.error('No Instagram pages found. Please reconnect your account.');
                          }
                        }}
                        disabled={subscribeWebhookMutation.isLoading}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {subscribeWebhookMutation.isLoading ? 'Setting up...' : 'Setup'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {activeFAQs > 0 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                    <span className="text-gray-900">FAQ Database</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      activeFAQs > 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {activeFAQs > 0 ? `${activeFAQs} FAQs` : 'No FAQs'}
                    </span>
                    {activeFAQs === 0 && (
                      <button
                        onClick={() => router.push('/dashboard/faqs')}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Add FAQs
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-900">AI Processing</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Operational</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Instagram Accounts */}
          {instagramData?.instagram_accounts && instagramData.instagram_accounts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Instagram Accounts</h2>
              <div className="space-y-4">
                {instagramData.instagram_accounts.map((account: any) => (
                  <div key={account.page_id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {account.profile_picture_url ? (
                        <img
                          src={account.profile_picture_url}
                          alt={account.instagram_username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Instagram className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        @{account.instagram_username}
                      </p>
                      <p className="text-xs text-gray-500">{account.instagram_display_name}</p>
                      {account.error && (
                        <p className="text-xs text-red-500">{account.error}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {account.webhook_subscribed ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          Setup Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Auto-reply sent</p>
                  <p className="text-xs text-gray-500">Responded to "What are your hours?" - 2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New customer message</p>
                  <p className="text-xs text-gray-500">Received inquiry about pricing - 5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">FAQ updated</p>
                  <p className="text-xs text-gray-500">Modified shipping policy FAQ - 1 hour ago</p>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
