import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram,
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Overview & analytics' },
  { name: 'FAQs', href: '/dashboard/faqs', icon: MessageSquare, description: 'Manage auto-responses' },
  { name: 'Settings', href: '/settings', icon: Settings, description: 'Account & preferences' },
];

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [instagramProfile, setInstagramProfile] = useState<any>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Fetch Instagram profile for header display
  useEffect(() => {
    const fetchInstagramProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch('https://api.autonique.in/api/v1/pages/instagram-details', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.instagram_accounts && data.instagram_accounts.length > 0) {
            // Use the first Instagram account for header display
            setInstagramProfile(data.instagram_accounts[0]);
          }
        }
      } catch (error) {
        // Error fetching Instagram profile - silently fail
      }
    };

    if (user) {
      fetchInstagramProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-orange-50/30">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 flex w-80 flex-col bg-white shadow-2xl border-r border-neutral-200"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex h-20 items-center justify-between px-6 border-b border-neutral-200">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <Logo variant="full" size="lg" theme="light" animated />
                </motion.div>
                <motion.button
                  onClick={() => setSidebarOpen(false)}
                  className="text-neutral-500 hover:text-neutral-700 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
              <nav className="flex-1 px-6 py-6">
                <ul className="space-y-2">
                  {navigation.map((item, index) => {
                    const isActive = router.pathname === item.href;
                    return (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`group flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                              : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <item.icon className="h-6 w-6" />
                          </motion.div>
                          <div className="flex-1">
                            <span className="font-semibold text-base">{item.name}</span>
                            <p className={`text-sm ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                              {item.description}
                            </p>
                          </div>
                          {isActive && (
                            <motion.div
                              className="w-2 h-2 bg-white rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <motion.div
          className="flex flex-col flex-grow bg-white shadow-2xl border-r border-neutral-200"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="flex h-20 items-center px-8 border-b border-neutral-200">
            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Logo variant="full" size="xl" theme="light" animated />
            </motion.div>
          </div>
          <nav className="flex-1 px-8 py-8">
            <ul className="space-y-3">
              {navigation.map((item, index) => {
                const isActive = router.pathname === item.href;
                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className={`group flex items-center space-x-4 px-6 py-5 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className="h-6 w-6" />
                      </motion.div>
                      <div className="flex-1">
                        <span className="font-semibold text-lg">{item.name}</span>
                        <p className={`text-sm ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <motion.div
            className="border-t border-neutral-200 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="flex items-center space-x-4 mb-6 p-4 bg-neutral-50 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                {instagramProfile?.profile_picture_url ? (
                  <img
                    src={instagramProfile.profile_picture_url}
                    alt={instagramProfile.instagram_username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Instagram className="h-7 w-7 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-neutral-900 truncate">
                  {instagramProfile ? `@${instagramProfile.instagram_username}` : (user?.name || 'User')}
                </p>
                <p className="text-sm text-neutral-600 truncate">
                  {instagramProfile ? instagramProfile.instagram_display_name : (user?.email || 'No email')}
                </p>
              </div>
            </motion.div>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="md"
              icon={<LogOut className="h-5 w-5" />}
              fullWidth
              className="justify-start text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
            >
              Sign out
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <motion.div
          className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm"
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="flex h-20 items-center justify-between px-6 sm:px-8 lg:px-10">
            <div className="flex items-center space-x-6">
              <motion.button
                onClick={() => setSidebarOpen(true)}
                className="text-neutral-700 hover:text-neutral-900 lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
              {title && (
                <AnimatedContainer animation="slideRight">
                  <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
                </AnimatedContainer>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.div
                className="hidden md:flex items-center space-x-2 bg-neutral-100 rounded-xl px-4 py-2"
                whileHover={{ scale: 1.02 }}
              >
                <Search className="h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-neutral-700 placeholder-neutral-500"
                />
              </motion.div>

              {/* Notifications */}
              <motion.button
                className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="h-5 w-5" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>

              {/* User Profile */}
              <div className="hidden sm:flex items-center space-x-3">
                <motion.div
                  className="flex items-center space-x-3 bg-neutral-50 rounded-xl px-4 py-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    {instagramProfile?.profile_picture_url ? (
                      <img
                        src={instagramProfile.profile_picture_url}
                        alt={instagramProfile.instagram_username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Instagram className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-900">
                      {instagramProfile ? `@${instagramProfile.instagram_username}` : (user?.name || 'User')}
                    </span>
                    {instagramProfile && (
                      <span className="text-xs text-neutral-600">
                        {instagramProfile.instagram_display_name}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                </motion.div>
              </div>

              <motion.button
                onClick={handleLogout}
                className="text-neutral-600 hover:text-neutral-900 lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Page content */}
        <main className="flex-1 min-h-screen">
          <AnimatedContainer
            animation="fadeIn"
            className="p-6 sm:p-8 lg:p-10"
          >
            {children}
          </AnimatedContainer>
        </main>
      </div>
    </div>
  );
}
