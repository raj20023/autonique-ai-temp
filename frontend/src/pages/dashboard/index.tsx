import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Instagram,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { pagesApi, faqApi } from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';

const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% from last week
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [router]);

  const { data: pages, isLoading: pagesLoading } = useQuery(
    'pages',
    () => pagesApi.getPages().then(res => res.data),
    { enabled: isLoggedIn }
  );

  const { data: faqs, isLoading: faqsLoading } = useQuery(
    'faqs',
    () => faqApi.getFAQs().then(res => res.data),
    { enabled: isLoggedIn }
  );

  if (!isLoggedIn) {
    return null;
  }

  const activeFAQs = faqs?.filter(faq => faq.is_active).length || 0;
  const connectedPages = pages?.filter(page => page.ig_business_id).length || 0;
  const webhookPages = pages?.filter(page => page.webhook_subscribed).length || 0;

  return (
    <>
      <Head>
        <title>Dashboard - InstaReply</title>
        <meta name="description" content="Manage your Instagram auto-reply system" />
      </Head>

      <DashboardLayout title="Dashboard">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-blue-100">
              Your Instagram auto-reply system is ready to help your customers 24/7.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active FAQs"
              value={activeFAQs}
              icon={MessageSquare}
              color="bg-blue-500"
              change={12}
            />
            <StatCard
              title="Connected Pages"
              value={connectedPages}
              icon={Instagram}
              color="bg-purple-500"
              change={0}
            />
            <StatCard
              title="Auto-Replies Sent"
              value="247"
              icon={TrendingUp}
              color="bg-green-500"
              change={23}
            />
            <StatCard
              title="Response Time"
              value="0.3s"
              icon={Clock}
              color="bg-orange-500"
              change={-15}
            />
          </div>

          {/* Quick Actions & Status */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/faqs')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">Add New FAQ</span>
                  </div>
                  <span className="text-sm text-gray-500">→</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/faqs?tab=upload')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Upload FAQ CSV</span>
                  </div>
                  <span className="text-sm text-gray-500">→</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/faqs?tab=test')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Test Bot Response</span>
                  </div>
                  <span className="text-sm text-gray-500">→</span>
                </button>
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
                  <span className={`text-sm font-medium ${
                    webhookPages > 0 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {webhookPages > 0 ? 'Active' : 'Setup Required'}
                  </span>
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
                  <span className={`text-sm font-medium ${
                    activeFAQs > 0 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {activeFAQs > 0 ? `${activeFAQs} FAQs` : 'No FAQs'}
                  </span>
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

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
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
    </>
  );
}
