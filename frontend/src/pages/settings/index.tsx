import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  User,
  Instagram,
  Bell,
  Shield,
  LogOut,
  Trash2,
  RefreshCw,
  Download,
  Check,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isAuthenticated } from '@/utils/auth';
import { userApi, pagesApi } from '@/utils/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useBusinessOnboarding } from '@/hooks/useBusinessOnboarding';
import { buildFacebookOAuthUrl, getRedirectUri } from '@/config/facebook';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import AutoMascot from '@/components/ui/AutoMascot';
import { useAutoExpressions } from '@/contexts/AutoContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateUser, deleteUser, isUpdatingUser, isDeletingUser } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const { showSuccess, showError } = useAutoExpressions();
  const { forceShowOnboarding } = useBusinessOnboarding();
  const [isOpeningOnboarding, setIsOpeningOnboarding] = useState(false);

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
    { id: 'account', name: 'Account', icon: User, description: 'Manage your account information' },
    { id: 'business', name: 'Business Profile', icon: Building2, description: 'Business information and AI personality' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, description: 'Connected Instagram accounts' },
    { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Notification preferences' },
    { id: 'privacy', name: 'Privacy', icon: Shield, description: 'Privacy and security settings' }
  ];

  return (
    <DashboardLayout title="Settings">
      {/* Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden -m-6 p-6">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedContainer animation="fadeIn">
            {/* Header with Auto */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <AutoMascot expression="curious" size="lg" animated={true} />
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Settings</h1>
                  <p className="text-white/80 drop-shadow-md">Auto is here to help you manage your account and preferences</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-2xl p-0 overflow-hidden">
                  <nav className="space-y-1">
                    {tabs.map((tab, index) => {
                      const Icon = tab.icon;
                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                              : 'text-white/80 hover:bg-white/10'
                          }`}
                          whileHover={{ x: activeTab === tab.id ? 0 : 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <div className="flex-1">
                            <div className="font-medium">{tab.name}</div>
                            <div className={`text-xs ${activeTab === tab.id ? 'text-white/80' : 'text-white/60'}`}>
                              {tab.description}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>
              </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <AnimatedContainer animation="slideUp" className="space-y-6">
                  {/* Account Information */}
                  <Card variant="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <User className="h-5 w-5 text-orange-400" />
                        <span>Account Information</span>
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        Update your personal information and account details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAccountUpdate} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={accountForm.name}
                              onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-white placeholder-white/60 backdrop-blur-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={accountForm.email}
                              onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-white placeholder-white/60 backdrop-blur-sm"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          loading={isUpdatingUser}
                          variant="primary"
                          icon={<Check className="h-4 w-4" />}
                        >
                          {isUpdatingUser ? 'Updating...' : 'Update Account'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Account Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-neutral-900">Account Actions</CardTitle>
                      <CardDescription>
                        Manage your account settings and data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={handleLogout}
                          variant="secondary"
                          icon={<LogOut className="h-4 w-4" />}
                        >
                          Sign Out
                        </Button>

                        <Button
                          onClick={handleDeleteAccount}
                          loading={isDeletingUser}
                          variant={showDeleteConfirm ? "danger" : "outline"}
                          icon={<Trash2 className="h-4 w-4" />}
                        >
                          {isDeletingUser
                            ? 'Deleting...'
                            : showDeleteConfirm
                            ? 'Click again to confirm'
                            : 'Delete Account'
                          }
                        </Button>
                      </div>

                      {showDeleteConfirm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-red-50 border border-red-200 rounded-xl p-4"
                        >
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800">
                                This action cannot be undone
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                All your data will be permanently deleted including your Instagram connections and FAQ settings.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              )}

              {/* Business Profile Tab */}
              {activeTab === 'business' && (
                <AnimatedContainer animation="slideUp" className="space-y-6">
                  <Card variant="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Building2 className="h-5 w-5 text-purple-400" />
                        <span>Business Profile</span>
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        Customize your AI assistant's personality and responses to match your brand
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                        <div className="flex items-center space-x-3 mb-4">
                          <Building2 className="h-8 w-8 text-purple-400" />
                          <div>
                            <h3 className="text-lg font-semibold text-white">Business Information</h3>
                            <p className="text-white/70 text-sm">Help your AI understand your business better</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setIsOpeningOnboarding(true);
                            // Small delay to show loading state
                            setTimeout(() => {
                              forceShowOnboarding();
                              setIsOpeningOnboarding(false);
                              showSuccess();
                              toast.success('Opening business profile form...');
                            }, 100);
                          }}
                          variant="outline"
                          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                          disabled={isOpeningOnboarding}
                        >
                          {isOpeningOnboarding ? 'Opening...' : 'Update Business Profile'}
                        </Button>
                      </div>

                      <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                        <h4 className="text-white font-medium mb-3">What this helps with:</h4>
                        <ul className="space-y-2 text-white/70 text-sm">
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                            <span>Personalized AI responses that match your brand voice</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                            <span>Better customer service with business context</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                            <span>Automatic mention of business hours and offers</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                            <span>Consistent communication tone across all messages</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              )}

              {/* Instagram Tab */}
              {activeTab === 'instagram' && (
                <AnimatedContainer animation="slideUp" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Instagram className="h-5 w-5 text-orange-500" />
                        <span>Connected Instagram Accounts</span>
                      </CardTitle>
                      <CardDescription>
                        Manage your connected Instagram Business accounts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pagesLoading ? (
                        <div className="text-center py-12">
                          <motion.div
                            className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <p className="text-neutral-600">Loading Instagram accounts...</p>
                        </div>
                      ) : pages && pages.length > 0 ? (
                        <div className="space-y-4">
                          {pages.map((page: any, index: number) => (
                            <motion.div
                              key={page.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                    <Instagram className="h-7 w-7 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg text-neutral-900">{page.page_name}</h3>
                                    <p className="text-neutral-600">@{page.instagram_username || 'Not connected'}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      {page.webhook_subscribed ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center space-x-1">
                                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                          <span>Active</span>
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center space-x-1">
                                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                          <span>Setup Required</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {!page.webhook_subscribed && (
                                    <Button
                                      variant="primary"
                                      size="sm"
                                    >
                                      Setup Webhook
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6"
                          >
                            <Instagram className="h-10 w-10 text-orange-600" />
                          </motion.div>
                          <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Instagram accounts connected</h3>
                          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                            Connect your Instagram Business account to start automating your DMs and providing instant customer support.
                          </p>
                          <Button
                            onClick={reconnectInstagram}
                            variant="primary"
                            size="lg"
                            icon={<Instagram className="h-5 w-5" />}
                          >
                            Connect Instagram Business Account
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Reconnect Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <RefreshCw className="h-5 w-5 text-orange-500" />
                        <span>Reconnect Instagram</span>
                      </CardTitle>
                      <CardDescription>
                        If you're experiencing issues with your Instagram connection, you can reconnect your account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={reconnectInstagram}
                        variant="outline"
                        icon={<RefreshCw className="h-4 w-4" />}
                      >
                        Reconnect Instagram
                      </Button>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <AnimatedContainer animation="slideUp">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-orange-500" />
                        <span>Notification Preferences</span>
                      </CardTitle>
                      <CardDescription>
                        Manage how you receive notifications from AutoniqueAI
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-neutral-900">Email Notifications</h3>
                          <p className="text-sm text-neutral-600">Receive email updates about your account activity</p>
                        </div>
                        <motion.label
                          className="relative inline-flex items-center cursor-pointer"
                          whileTap={{ scale: 0.95 }}
                        >
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </motion.label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-neutral-900">Message Alerts</h3>
                          <p className="text-sm text-neutral-600">Get notified when auto-replies are sent</p>
                        </div>
                        <motion.label
                          className="relative inline-flex items-center cursor-pointer"
                          whileTap={{ scale: 0.95 }}
                        >
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </motion.label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                        <div>
                          <h3 className="font-semibold text-neutral-900">System Updates</h3>
                          <p className="text-sm text-neutral-600">Important updates about the service</p>
                        </div>
                        <motion.label
                          className="relative inline-flex items-center cursor-pointer"
                          whileTap={{ scale: 0.95 }}
                        >
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </motion.label>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <AnimatedContainer animation="slideUp" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-orange-500" />
                        <span>Privacy & Security</span>
                      </CardTitle>
                      <CardDescription>
                        Your data privacy and security information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-2">🔒 Data Usage</h3>
                          <p className="text-blue-800 text-sm">
                            We only use your Instagram data to provide auto-reply services. Your messages and customer data are never shared with third parties.
                          </p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                          <h3 className="font-semibold text-green-900 mb-2">⏰ Data Retention</h3>
                          <p className="text-green-800 text-sm">
                            Message data is stored for 30 days to improve response quality. You can request data deletion at any time.
                          </p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <h3 className="font-semibold text-purple-900 mb-2">🛡️ Account Security</h3>
                          <p className="text-purple-800 text-sm">
                            Your account is secured through Facebook OAuth. We recommend keeping your Facebook account secure with two-factor authentication.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Download className="h-5 w-5 text-orange-500" />
                        <span>Data Export</span>
                      </CardTitle>
                      <CardDescription>
                        Request an export of all your data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                        <div className="flex items-start space-x-3">
                          <Download className="h-6 w-6 text-orange-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-orange-900 mb-2">Export Your Data</h4>
                            <p className="text-orange-800 text-sm mb-4">
                              You can request an export of all your data at any time. This includes your account information, connected Instagram accounts, and FAQ settings.
                            </p>
                            <Button
                              variant="outline"
                              icon={<Download className="h-4 w-4" />}
                              className="border-orange-300 text-orange-700 hover:bg-orange-100"
                            >
                              Request Data Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              )}
            </div>
          </div>
        </AnimatedContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
