import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { isAuthenticated } from '@/utils/auth';
import { userApi, pagesApi } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styles from '@/styles/settings.module.css';
import { buildFacebookOAuthUrl, getRedirectUri } from '@/config/facebook';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateUser, deleteUser, isUpdatingUser, isDeletingUser } = useAuth();
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('account');

  // Form states
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get user's pages
  const { data: pages, isLoading: pagesLoading } = useQuery(
    'pages',
    () => pagesApi.getPages().then(res => res.data),
    {
      enabled: isAuthenticated(),
      retry: false
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

  useEffect(() => {
    if (user) {
      setAccountForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleAccountUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(accountForm);
    toast.success('Account updated successfully!');
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      deleteUser();
      toast.success('Account deleted successfully');
      router.push('/');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000); // Reset after 5 seconds
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const reconnectInstagram = () => {
    try {
      const redirectUri = getRedirectUri();
      const loginUrl = buildFacebookOAuthUrl(redirectUri);

      window.location.href = loginUrl;
    } catch (error) {
      console.error('Failed to build OAuth URL:', error);

      // Fallback to hardcoded URL if centralized config fails
      const fallbackUrl = 'https://www.facebook.com/v23.0/dialog/oauth?client_id=2032087817551720&redirect_uri=https%3A%2F%2Fautonique.in%2Fauth%2Fcallback&scope=pages_messaging%2Cinstagram_basic%2Cinstagram_manage_messages%2Cpages_show_list%2Cbusiness_management%2Cpages_manage_metadata&response_type=code&auth_type=rerequest&display=popup';

      window.location.href = fallbackUrl;
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access settings.</div>;
  }

  const tabs = [
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'instagram', name: 'Instagram', icon: '📱' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <nav className="bg-white rounded-lg shadow p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                  
                  <form onSubmit={handleAccountUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={accountForm.name}
                        onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isUpdatingUser}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isUpdatingUser ? 'Updating...' : 'Update Account'}
                      </button>
                    </div>
                  </form>

                  <hr className="my-8" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Account Actions</h3>
                    
                    <button
                      onClick={handleLogout}
                      className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                    >
                      Logout
                    </button>

                    <div>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeletingUser}
                        className={`px-6 py-2 rounded-md ${
                          showDeleteConfirm
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        } disabled:opacity-50`}
                      >
                        {isDeletingUser
                          ? 'Deleting...'
                          : showDeleteConfirm
                          ? 'Click again to confirm deletion'
                          : 'Delete Account'
                        }
                      </button>
                      {showDeleteConfirm && (
                        <p className="text-sm text-red-600 mt-2">
                          ⚠️ This action cannot be undone. All your data will be permanently deleted.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Instagram Tab */}
              {activeTab === 'instagram' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Instagram Accounts</h2>
                  
                  {pagesLoading ? (
                    <div className="text-center py-8">Loading Instagram accounts...</div>
                  ) : pages && pages.length > 0 ? (
                    <div className="space-y-4">
                      {pages.map((page: any) => (
                        <div key={page.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{page.page_name}</h3>
                              <p className="text-sm text-gray-600">
                                @{page.instagram_username || 'Not connected'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Status: {page.webhook_subscribed ? '✅ Active' : '⚠️ Setup Required'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!page.webhook_subscribed && (
                                <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                  Setup Webhook
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No Instagram accounts connected</p>
                      <button
                        onClick={reconnectInstagram}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                      >
                        Connect Instagram Account
                      </button>
                    </div>
                  )}

                  <hr className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Reconnect Instagram</h3>
                    <p className="text-gray-600 mb-4">
                      If you're experiencing issues with your Instagram connection, you can reconnect your account.
                    </p>
                    <button
                      onClick={reconnectInstagram}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                      Reconnect Instagram
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive email updates about your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Message Alerts</h3>
                        <p className="text-sm text-gray-600">Get notified when auto-replies are sent</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">System Updates</h3>
                        <p className="text-sm text-gray-600">Important updates about the service</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Data Usage</h3>
                      <p className="text-gray-600 mb-4">
                        We only use your Instagram data to provide auto-reply services. Your messages and customer data are never shared with third parties.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Data Retention</h3>
                      <p className="text-gray-600 mb-4">
                        Message data is stored for 30 days to improve response quality. You can request data deletion at any time.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Account Security</h3>
                      <p className="text-gray-600 mb-4">
                        Your account is secured through Facebook OAuth. We recommend keeping your Facebook account secure with two-factor authentication.
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">⚠️ Data Export</h4>
                      <p className="text-yellow-700 mb-3">
                        You can request an export of all your data at any time.
                      </p>
                      <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                        Request Data Export
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
