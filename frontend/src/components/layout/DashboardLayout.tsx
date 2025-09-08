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
  ChevronDown,
  Brain,
  Cpu,
  Layers
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import ParticleSystem, { ParticlePresets } from '@/components/ui/ParticleSystem';

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-neutral-25 via-neural-50/20 to-cyber-50/10">
      {/* AI Dashboard Particle Background */}
      <ParticleSystem
        {...ParticlePresets.aiGlow}
        className="absolute inset-0 z-0"
        particleCount={20}
        interactive={false}
      />

      {/* Floating AI Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-12 h-12 glass rounded-xl flex items-center justify-center"
          animate={{
            y: [0, -10, 0],
            rotateY: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className="w-6 h-6 text-neural-500" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-20 w-10 h-10 glass rounded-lg flex items-center justify-center"
          animate={{
            y: [0, 8, 0],
            rotateX: [0, 180, 360],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Cpu className="w-5 h-5 text-cyber-500" />
        </motion.div>
      </div>
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
              className="fixed inset-y-0 left-0 flex w-72 flex-col glass shadow-neural border-r border-white/20"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-100">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src="/logos/full_logo_light_theam.png"
                    alt="AutoniqueAI"
                    className="h-8 w-auto"
                    onError={(e) => {
                      e.currentTarget.src = "/logos/logo_icon.png";
                      e.currentTarget.className = "h-8 w-8";
                    }}
                  />
                </motion.div>
                <motion.button
                  onClick={() => setSidebarOpen(false)}
                  className="text-neutral-500 hover:text-neutral-700 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
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
                          className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-orange-500 text-white shadow-lg'
                              : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <item.icon className="h-5 w-5" />
                          </motion.div>
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{item.name}</span>
                            <p className={`text-xs ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                              {item.description}
                            </p>
                          </div>
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <motion.div
          className="flex flex-col flex-grow glass shadow-neural border-r border-white/20 relative"
          initial={{ x: -288 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* AI Sidebar Accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neural-400 via-cyber-400 to-quantum-400"></div>

          <div className="flex h-20 items-center px-6 border-b border-white/10">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/logos/full_logo_light_theam.png"
                alt="AutoniqueAI"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/logos/logo_icon.png";
                  e.currentTarget.className = "h-8 w-8";
                }}
              />
            </motion.div>
          </div>
          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-2">
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
                      className={`group flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className="h-5 w-5" />
                      </motion.div>
                      <div className="flex-1">
                        <span className="font-semibold text-base">{item.name}</span>
                        <p className={`text-xs ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <motion.div
            className="border-t border-neutral-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="flex items-center space-x-3 mb-4 p-3 bg-neutral-50 rounded-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                {instagramProfile?.profile_picture_url ? (
                  <img
                    src={instagramProfile.profile_picture_url}
                    alt={instagramProfile.instagram_username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Instagram className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">
                  {instagramProfile ? `@${instagramProfile.instagram_username}` : (user?.name || 'User')}
                </p>
                <p className="text-xs text-neutral-600 truncate">
                  {instagramProfile ? instagramProfile.instagram_display_name : (user?.email || 'No email')}
                </p>
              </div>
            </motion.div>

            <motion.button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-3 py-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200 text-sm"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <motion.div
          className="sticky top-0 z-40 glass border-b border-white/10 shadow-ai"
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setSidebarOpen(true)}
                className="text-neutral-700 hover:text-neutral-900 lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-5 w-5" />
              </motion.button>
              {title && (
                <h1 className="text-display text-xl font-bold text-neutral-900 relative">
                  {title}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neural-400 to-cyber-400 rounded-full"></div>
                </h1>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* User Profile - Desktop */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-neutral-50 rounded-lg px-3 py-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
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
                    <span className="text-sm font-medium text-neutral-900">
                      {instagramProfile ? `@${instagramProfile.instagram_username}` : (user?.name || 'User')}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleLogout}
                className="text-neutral-600 hover:text-neutral-900 lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut className="h-4 w-4" />
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
