import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { isAuthenticated } from '@/utils/auth';
import Button from '@/components/ui/Button';

interface PublicLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PublicLayout({ children, className = '' }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = isAuthenticated();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/auth/login';
    }
  };

  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{
        background: `radial-gradient(circle at center, #13132b 0%, #0f0f25 50%, #13132b 100%)`,
      }}
    >
      {/* Header */}
      <motion.header
        className="relative z-50 backdrop-blur-xl bg-white/10 border-b border-white/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/">
                <img
                  src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/header_dark_background.svg"
                  alt="AutoniqueAI"
                  className="h-10 w-auto filter drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg";
                    e.currentTarget.className = "h-10 w-10 filter drop-shadow-lg";
                  }}
                />
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/demo" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                Demo
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/#benefits" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                Benefits
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/pricing" className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <div className="flex items-center space-x-4">
                {!isLoggedIn ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/auth/login">
                        <Button
                          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold border border-white/30 backdrop-blur-xl transition-all duration-300"
                        >
                          Login
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleGetStarted}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                      >
                        Start Free Trial
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/dashboard">
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            <motion.button
              className="md:hidden p-2 text-white/90 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] backdrop-blur-xl bg-white/10 border-l border-white/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <img
                  src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/header_dark_background.svg"
                  alt="AutoniqueAI"
                  className="h-8 w-auto filter drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg";
                    e.currentTarget.className = "h-8 w-8 filter drop-shadow-lg";
                  }}
                />
                <motion.button
                  className="p-2 text-white/90 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <nav className="p-6 space-y-4">
                {[
                  { href: "/#features", label: "Features" },
                  { href: "/demo", label: "Demo" },
                  { href: "/#benefits", label: "Benefits" },
                  { href: "/pricing", label: "Pricing" }
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block text-white/90 hover:text-white transition-all duration-300 font-medium text-lg py-3 px-4 rounded-xl hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="p-6 space-y-4 border-t border-white/20">
                {!isLoggedIn ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold border border-white/30 backdrop-blur-xl transition-all duration-300">
                          Login
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleGetStarted();
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                      >
                        Start Free Trial
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                        Dashboard
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <motion.div
                className="mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/header_dark_background.svg"
                  alt="AutoniqueAI"
                  className="h-12 w-auto filter drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg";
                    e.currentTarget.className = "h-12 w-12 filter drop-shadow-lg";
                  }}
                />
              </motion.div>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Transform your Instagram business with AI-powered automation. 
                AutoniqueAI delivers human-like responses that engage customers 
                and drive sales 24/7.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  { href: "/#features", label: "Features" },
                  { href: "/demo", label: "Demo" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/auth/login", label: "Login" }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white transition-colors duration-300">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2024 AutoniqueAI. All rights reserved.
            </p>
            <motion.div
              className="mt-4 md:mt-0 text-white/60 text-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <span>Made with ❤️</span>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
