import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Crown, Clock, CreditCard, Settings, TrendingUp, Shield, AlertTriangle,
  Brain, Zap, Globe, BarChart3, PieChart, LineChart, Map, Cpu, Database, Wifi,
  Eye, Target, Lightbulb, Rocket, Star, Sparkles, Command, Search, Filter,
  Download, Upload, RefreshCw, Play, Pause, SkipForward, Volume2, Maximize2
} from 'lucide-react';

interface AdminStats {
  total_users: number;
  beta_users: number;
  trial_users: number;
  paid_users: number;
  active_users: number;
  beta_slots_remaining: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_beta_user: boolean;
  beta_user_number?: number;
  subscription_status?: string;
  trial_days_remaining?: number;
  created_at: string;
  last_login?: string;
  has_access: boolean;
  access_reason: string;
  usage_stats?: {
    messages_sent: number;
    messages_received: number;
    api_calls_made: number;
  };
}

interface AdminSettings {
  beta_users_limit: string;
  trial_days: string;
  monthly_message_limit_trial: string;
  monthly_message_limit_paid: string;
  app_maintenance_mode: string;
  auto_approve_beta: string;
}

export default function AdvancedAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ai-insights');
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editableSettings, setEditableSettings] = useState<AdminSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Advanced analytics state
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.autonique.in/api/v1/user-management/admin/check', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setIsAdmin(true);
        await fetchAdminData();
      } else {
        setError('Admin access denied');
      }
    } catch (error) {
      console.error('Failed to check admin access:', error);
      setError('Failed to verify admin access');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const API_URL = 'https://api.autonique.in';
      const token = localStorage.getItem('access_token');

      // Fetch stats
      const statsResponse = await fetch(`${API_URL}/api/v1/user-management/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Fetch users
      const usersResponse = await fetch(`${API_URL}/api/v1/user-management/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      // Fetch settings
      const settingsResponse = await fetch(`${API_URL}/api/v1/user-management/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setSettings(settingsData.settings);
        setEditableSettings(settingsData.settings);
      }

    } catch (error) {
      console.error('❌ Failed to fetch admin data:', error);
      setError('Failed to fetch admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId: number, newRole: string) => {
    try {
      const API_URL = 'https://api.autonique.in';
      const response = await fetch(`${API_URL}/api/v1/user-management/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        alert(`User role changed to ${newRole} successfully!`);
        fetchAdminData();
      } else {
        const errorText = await response.text();
        console.error('Role change failed:', response.status, errorText);
        alert(`Failed to change user role: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to change user role:', error);
      alert('Failed to change user role');
    }
  };

  const toggleUserStatus = async (userId: number, newStatus: boolean) => {
    try {
      const API_URL = 'https://api.autonique.in';
      const response = await fetch(`${API_URL}/api/v1/user-management/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: newStatus })
      });

      if (response.ok) {
        alert(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchAdminData();
      } else {
        const errorText = await response.text();
        console.error('Status change failed:', response.status, errorText);
        alert(`Failed to change user status: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to change user status:', error);
      alert('Failed to change user status');
    }
  };

  const saveSettings = async () => {
    if (!editableSettings) return;
    
    setSavingSettings(true);
    try {
      const API_URL = 'https://api.autonique.in';
      
      const settingsToSave = [
        { key: 'beta_users_limit', value: editableSettings.beta_users_limit },
        { key: 'trial_days', value: editableSettings.trial_days },
        { key: 'monthly_message_limit_trial', value: editableSettings.monthly_message_limit_trial },
        { key: 'monthly_message_limit_paid', value: editableSettings.monthly_message_limit_paid },
        { key: 'auto_approve_beta', value: editableSettings.auto_approve_beta || 'false' },
        { key: 'maintenance_mode', value: editableSettings.app_maintenance_mode || 'false' }
      ];

      for (const setting of settingsToSave) {
        const response = await fetch(`${API_URL}/api/v1/user-management/admin/settings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(setting)
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${setting.key}`);
        }
      }

      setSettings(editableSettings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const resetSettings = () => {
    if (settings) {
      setEditableSettings({ ...settings });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>🚀 Ultimate AI Command Center - AutoniqueAI</title>
        <meta name="description" content="Revolutionary AI-powered admin dashboard with real-time analytics" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Futuristic Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                  >
                    <Command className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      AI Command Center
                    </h1>
                    <p className="text-blue-200 mt-1">
                      Next-generation admin dashboard with AI insights
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-6"
              >
                {/* Real-time Status */}
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 bg-green-400 rounded-full"
                  />
                  <span className="text-green-300 font-medium">AI Active</span>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      realTimeEnabled 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {realTimeEnabled ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchAdminData}
                    className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Advanced Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users, metrics, insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>

                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-500/30 text-blue-300'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-500/30 text-blue-300'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Users className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Advanced Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8"
          >
            <div className="flex space-x-2 overflow-x-auto">
              {[
                { id: 'ai-insights', label: '🧠 AI Insights', icon: Brain },
                { id: 'real-time', label: '⚡ Real-time', icon: Zap },
                { id: 'analytics', label: '📊 Analytics', icon: BarChart3 },
                { id: 'users', label: '👥 Users', icon: Users },
                { id: 'system', label: '🖥️ System', icon: Cpu },
                { id: 'security', label: '🛡️ Security', icon: Shield },
                { id: 'settings', label: '⚙️ Settings', icon: Settings }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* AI Insights Tab */}
              {activeTab === 'ai-insights' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
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
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-sm text-purple-200">Active Insights</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-sm text-purple-200">Actionable</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">87%</div>
                        <div className="text-sm text-purple-200">Avg Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">1</div>
                        <div className="text-sm text-purple-200">High Impact</div>
                      </div>
                    </div>
                  </div>

                  {/* Mock AI Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Lightbulb className="h-6 w-6 text-yellow-400" />
                          <h3 className="text-lg font-semibold text-white">Opportunity Detected</h3>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Medium Impact
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">
                        User engagement increased 34% in the last hour. Consider scaling resources.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">Confidence: 89%</div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">
                          Take Action
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-6 w-6 text-orange-400" />
                          <h3 className="text-lg font-semibold text-white">Potential Churn Risk</h3>
                        </div>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          High Impact
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">
                        3 beta users showing decreased activity patterns similar to churned users.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">Confidence: 76%</div>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
                          Review Users
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Real-time Dashboard */}
              {activeTab === 'real-time' && (
                <div className="space-y-6">
                  {/* Real-time KPIs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: 'Active Users', value: Math.floor(Math.random() * 50) + 20, max: 100, color: '#3b82f6' },
                      { title: 'Messages/min', value: Math.floor(Math.random() * 100) + 50, max: 200, color: '#10b981' },
                      { title: 'System Health', value: Math.floor(Math.random() * 20) + 80, max: 100, color: '#f59e0b' },
                      { title: 'Uptime %', value: 99.97, max: 100, color: '#8b5cf6' }
                    ].map((kpi, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                      >
                        <div className="relative w-24 h-24 mx-auto mb-4">
                          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#374151"
                              strokeWidth="2"
                            />
                            <motion.path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={kpi.color}
                              strokeWidth="2"
                              strokeDasharray={`${(kpi.value / kpi.max) * 100}, 100`}
                              initial={{ strokeDasharray: "0, 100" }}
                              animate={{ strokeDasharray: `${(kpi.value / kpi.max) * 100}, 100` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.span
                              className="text-xl font-bold text-white"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              {Math.round((kpi.value / kpi.max) * 100)}%
                            </motion.span>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-gray-300">{kpi.title}</h4>
                        <p className="text-lg font-semibold text-white">{kpi.value.toLocaleString()}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Live Activity Feed */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-6 w-6 text-green-400" />
                        <h3 className="text-xl font-semibold text-white">Live Activity</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-400 font-medium">Live</span>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {[
                        { time: '10:23:45', event: 'User authentication successful', type: 'success' },
                        { time: '10:23:42', event: 'API request processed', type: 'info' },
                        { time: '10:23:38', event: 'Database query executed', type: 'info' },
                        { time: '10:23:35', event: 'Cache miss detected', type: 'warning' },
                        { time: '10:23:30', event: 'New user registration', type: 'success' },
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <div className="text-sm text-white">{activity.event}</div>
                            <div className="text-xs text-gray-400">{activity.time}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Monthly Recurring Revenue</h3>
                      <p className="text-3xl font-bold">$28,500</p>
                      <p className="text-green-100 text-sm">+23% from last month</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Customer Lifetime Value</h3>
                      <p className="text-3xl font-bold">$2,400</p>
                      <p className="text-purple-100 text-sm">+15% from last month</p>
                    </motion.div>

                    <motion.div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">Churn Rate</h3>
                      <p className="text-3xl font-bold">5.0%</p>
                      <p className="text-orange-100 text-sm">-2% from last month</p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Users className="h-6 w-6 mr-2" />
                      User Management ({users.length} users)
                    </h3>

                    {users.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-300">No users found</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-white/20">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {users.map((user) => (
                              <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-white/5 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{user.name}</div>
                                  <div className="text-sm text-gray-300">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                    user.role === 'paid' ? 'bg-green-100 text-green-800' :
                                    user.role === 'beta' ? 'bg-blue-100 text-blue-800' :
                                    user.role === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {user.role === 'normal' ? 'Normal' : user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <select
                                      value={user.role}
                                      onChange={(e) => changeUserRole(user.id, e.target.value)}
                                      className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-900"
                                    >
                                      <option value="normal">Normal</option>
                                      <option value="beta">Beta</option>
                                      <option value="paid">Paid</option>
                                      <option value="admin">Admin</option>
                                    </select>
                                    <button
                                      onClick={() => toggleUserStatus(user.id, !user.is_active)}
                                      className={`px-2 py-1 text-xs rounded ${
                                        user.is_active
                                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                                      }`}
                                    >
                                      {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Cpu className="h-8 w-8" />
                        </motion.div>
                        <div>
                          <h2 className="text-2xl font-bold">System Monitor</h2>
                          <p className="text-gray-300">Real-time infrastructure monitoring</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-300">System Time</div>
                        <div className="text-xl font-mono">
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">99.97%</div>
                        <div className="text-sm text-gray-300">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">120ms</div>
                        <div className="text-sm text-gray-300">Response Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">850</div>
                        <div className="text-sm text-gray-300">Requests/min</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">0.2%</div>
                        <div className="text-sm text-gray-300">Error Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'CPU Usage', value: 45, unit: '%', color: 'blue' },
                      { title: 'Memory Usage', value: 68, unit: '%', color: 'green' },
                      { title: 'Network Latency', value: 120, unit: 'ms', color: 'purple' }
                    ].map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-white">{metric.title}</h3>
                          <Cpu className={`h-6 w-6 text-${metric.color}-400`} />
                        </div>

                        <div className="text-3xl font-bold text-white mb-2">
                          {metric.value}
                          <span className="text-lg text-gray-400 ml-1">{metric.unit}</span>
                        </div>

                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full bg-${metric.color}-500`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(metric.value, 100)}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-6">
                      <Shield className="h-6 w-6 text-blue-400" />
                      <h3 className="text-xl font-semibold text-white">Security Status</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <Shield className="h-4 w-4 mr-1" />
                          LOW
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Threat Level</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">15</div>
                        <div className="text-sm text-gray-300">Blocked Attacks</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">3</div>
                        <div className="text-sm text-gray-300">Suspicious Activities</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">0</div>
                        <div className="text-sm text-gray-300">Vulnerabilities</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && settings && editableSettings && (
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-white flex items-center">
                        <Settings className="h-6 w-6 mr-2" />
                        System Settings
                      </h3>
                      <div className="space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resetSettings}
                          className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30"
                        >
                          Reset
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={saveSettings}
                          disabled={savingSettings}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                          {savingSettings ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Beta Users Limit
                        </label>
                        <input
                          type="number"
                          value={editableSettings.beta_users_limit}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            beta_users_limit: e.target.value
                          })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Trial Days
                        </label>
                        <input
                          type="number"
                          value={editableSettings.trial_days}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            trial_days: e.target.value
                          })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Maintenance Mode
                        </label>
                        <select
                          value={editableSettings.app_maintenance_mode}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            app_maintenance_mode: e.target.value
                          })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="false">Disabled</option>
                          <option value="true">Enabled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Auto Approve Beta
                        </label>
                        <select
                          value={editableSettings.auto_approve_beta || 'false'}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            auto_approve_beta: e.target.value
                          })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="false">Manual Approval</option>
                          <option value="true">Auto Approve</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
