import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  Users,
  Crown,
  Clock,
  CreditCard,
  Settings,
  TrendingUp,
  Shield,
  AlertTriangle
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
  auto_approve_beta?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editableSettings, setEditableSettings] = useState<AdminSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('🔑 Token found:', !!token);

      // Use the same hardcoded API URL as the main app
      const API_URL = 'https://api.autonique.in';
      console.log('🌐 API URL:', API_URL);

      if (!token) {
        setError('No authentication token found. Please login.');
        setLoading(false);
        return;
      }

      // First, let's check current user info
      console.log('👤 Checking current user...');
      const userResponse = await fetch(`${API_URL}/api/v1/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('👤 User response status:', userResponse.status);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('👤 Current user:', userData);
        console.log('👤 User role:', userData.role);

        if (userData.role !== 'admin') {
          setError(`Access denied. Your role is '${userData.role}' but admin role is required. Please contact support if you should have admin access.`);
          setLoading(false);
          return;
        }

        console.log('✅ User verified as admin');
      } else {
        const errorText = await userResponse.text();
        console.error('👤 User check failed:', errorText);

        if (userResponse.status === 401) {
          setError('Authentication expired. Please login again.');
        } else {
          setError(`Failed to verify user information: ${userResponse.status}`);
        }
        setLoading(false);
        return;
      }

      // Try to fetch admin stats to check if user is admin
      console.log('📊 Checking admin stats access...');
      const response = await fetch(`${API_URL}/api/v1/user-management/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('📊 Admin stats response status:', response.status);

      if (response.status === 403) {
        const errorText = await response.text();
        console.error('📊 Admin access denied:', errorText);
        setError('Admin access required. You do not have permission to view this page.');
        setLoading(false);
        return;
      }

      if (response.status === 401) {
        const errorText = await response.text();
        console.error('📊 Authentication failed:', errorText);
        setError('Authentication failed. Please login again.');
        setLoading(false);
        return;
      }

      if (response.ok) {
        console.log('✅ Admin access verified!');
        setIsAdmin(true);
        fetchAdminData();
      } else {
        const errorText = await response.text();
        console.error('📊 Unexpected response:', errorText);
        setError(`Failed to verify admin access: ${response.status} - ${errorText}`);
        setLoading(false);
      }

    } catch (error) {
      console.error('❌ Admin access check failed:', error);
      setError(`Failed to verify admin access: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Use the same hardcoded API URL as the main app
      const API_URL = 'https://api.autonique.in';

      console.log('🔍 Fetching admin data...');

      // Fetch stats
      const statsResponse = await fetch(`${API_URL}/api/v1/user-management/admin/stats`, { headers });
      console.log('📊 Stats response:', statsResponse.status);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('📊 Stats data:', statsData);
        setStats(statsData);
      } else {
        console.error('📊 Stats failed:', await statsResponse.text());
      }

      // Fetch users
      const usersResponse = await fetch(`${API_URL}/api/v1/user-management/admin/users`, { headers });
      console.log('👥 Users response:', usersResponse.status);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('👥 Users data:', usersData);
        setUsers(usersData.users || []);
      } else {
        console.error('👥 Users failed:', await usersResponse.text());
      }

      // Fetch settings
      const settingsResponse = await fetch(`${API_URL}/api/v1/user-management/admin/settings`, { headers });
      console.log('⚙️ Settings response:', settingsResponse.status);
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        console.log('⚙️ Settings data:', settingsData);
        setSettings(settingsData.settings);
        setEditableSettings(settingsData.settings); // Initialize editable settings
      } else {
        console.error('⚙️ Settings failed:', await settingsResponse.text());
      }

    } catch (error) {
      console.error('❌ Failed to fetch admin data:', error);
      setError('Failed to fetch admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const upgradeUser = async (userId: number) => {
    try {
      const API_URL = 'https://api.autonique.in';
      const response = await fetch(`${API_URL}/api/v1/user-management/admin/users/${userId}/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        alert('User upgraded successfully!');
        fetchAdminData();
      } else {
        const errorText = await response.text();
        console.error('Upgrade failed:', response.status, errorText);
        alert(`Failed to upgrade user: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to upgrade user:', error);
      alert('Failed to upgrade user');
    }
  };

  const toggleUserStatus = async (userId: number, activate: boolean) => {
    try {
      const API_URL = 'https://api.autonique.in';
      const action = activate ? 'activate' : 'deactivate';
      const response = await fetch(`${API_URL}/api/v1/user-management/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        alert(`User ${action}d successfully!`);
        fetchAdminData();
      } else {
        const errorText = await response.text();
        console.error(`${action} failed:`, response.status, errorText);
        alert(`Failed to ${action} user: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error(`Failed to ${activate ? 'activate' : 'deactivate'} user:`, error);
      alert(`Failed to ${activate ? 'activate' : 'deactivate'} user`);
    }
  };

  const saveSettings = async () => {
    if (!editableSettings) return;

    setSavingSettings(true);
    try {
      const API_URL = 'https://api.autonique.in';

      // Save each setting individually
      const settingsToSave = [
        { key: 'beta_slots_limit', value: editableSettings.beta_users_limit },
        { key: 'trial_duration_days', value: editableSettings.trial_days },
        { key: 'auto_approve_beta', value: editableSettings.auto_approve_beta || 'false' },
        { key: 'maintenance_mode', value: editableSettings.app_maintenance_mode || 'false' }
      ];

      for (const setting of settingsToSave) {
        const response = await fetch(`${API_URL}/api/v1/user-management/admin/settings/${setting.key}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ value: setting.value })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Failed to save ${setting.key}:`, errorText);
          throw new Error(`Failed to save ${setting.key}`);
        }
      }

      // Update the main settings state
      setSettings(editableSettings);
      alert('Settings saved successfully!');

    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  const resetSettings = () => {
    setEditableSettings(settings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
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
        <title>Admin Dashboard - AutoniqueAI</title>
        <meta name="description" content="Admin dashboard for user management" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="h-8 w-8 mr-3 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage users, subscriptions, and system settings</p>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <Crown className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Beta Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.beta_users}/20</p>
                    <p className="text-xs text-gray-500">{stats.beta_slots_remaining} slots left</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Trial Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.trial_users}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Paid Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.paid_users}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', name: 'Overview', icon: TrendingUp },
                  { id: 'users', name: 'Users', icon: Users },
                  { id: 'settings', name: 'Settings', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">User Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Beta Users:</span>
                          <span className="text-sm font-medium">{stats?.beta_users || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Trial Users:</span>
                          <span className="text-sm font-medium">{stats?.trial_users || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Paid Users:</span>
                          <span className="text-sm font-medium">{stats?.paid_users || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Active Users:</span>
                          <span className="text-sm font-medium">{stats?.active_users || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Beta Slots Left:</span>
                          <span className="text-sm font-medium">{stats?.beta_slots_remaining || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    User Management ({users.length} users)
                  </h3>

                  {users.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No users found</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Users will appear here once they register
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {user.is_beta_user && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Beta #{user.beta_user_number}
                                  </span>
                                )}
                                <span className="text-sm text-gray-900 capitalize">{user.role.replace('_', ' ')}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.has_access ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.has_access ? 'Active' : 'Limited'}
                              </span>
                              {user.trial_days_remaining !== undefined && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {user.trial_days_remaining} days left
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>Sent: {user.usage_stats?.messages_sent || 0}</div>
                              <div>Received: {user.usage_stats?.messages_received || 0}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {user.role !== 'paid' && (
                                <button
                                  onClick={() => {
                                    console.log('Upgrading user:', user);
                                    upgradeUser(user.id);
                                  }}
                                  className="text-green-600 hover:text-green-900 mr-2"
                                >
                                  Upgrade
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  console.log('Toggling user status:', user);
                                  toggleUserStatus(user.id, !user.is_active);
                                }}
                                className={user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                              >
                                {user.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && settings && editableSettings && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
                    <div className="space-x-2">
                      <button
                        onClick={resetSettings}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Reset
                      </button>
                      <button
                        onClick={saveSettings}
                        disabled={savingSettings}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {savingSettings ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Beta Users Limit
                        </label>
                        <input
                          type="number"
                          value={editableSettings.beta_users_limit}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            beta_users_limit: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trial Days
                        </label>
                        <input
                          type="number"
                          value={editableSettings.trial_days}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            trial_days: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trial Message Limit
                        </label>
                        <input
                          type="number"
                          value={editableSettings.monthly_message_limit_trial}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            monthly_message_limit_trial: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Paid Message Limit
                        </label>
                        <input
                          type="number"
                          value={editableSettings.monthly_message_limit_paid}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            monthly_message_limit_paid: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maintenance Mode
                        </label>
                        <select
                          value={editableSettings.app_maintenance_mode}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            app_maintenance_mode: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="false">Disabled</option>
                          <option value="true">Enabled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Auto Approve Beta Users
                        </label>
                        <select
                          value={editableSettings.auto_approve_beta || 'false'}
                          onChange={(e) => setEditableSettings({
                            ...editableSettings,
                            auto_approve_beta: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="false">Manual Approval</option>
                          <option value="true">Auto Approve</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-green-800">
                          Settings are now editable. Make changes and click "Save Changes" to apply.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <a
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
