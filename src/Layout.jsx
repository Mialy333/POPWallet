import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion } from 'framer-motion';
import { Home, BookOpen, Zap, LogOut, LogIn } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear any browser storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    // Logout and redirect (this will reload the page and clear all state)
    base44.auth.logout();
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b-2 border-cyan-500/30"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl('Home')}>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="relative"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-0"
                      animate={{ 
                        boxShadow: [
                          '0 0 10px rgba(0,255,255,0.5)',
                          '0 0 20px rgba(255,0,255,0.5)',
                          '0 0 10px rgba(255,255,0,0.5)',
                          '0 0 10px rgba(0,255,255,0.5)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <span className="text-2xl relative z-10">🎒</span>
                  </div>
                </motion.div>
                <h1 
                  className="text-2xl font-black tracking-wider"
                  style={{
                    fontFamily: 'Arial Black, sans-serif',
                    background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  CAMPUSFi
                </h1>
              </motion.div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('Home')}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    currentPageName === 'Home'
                      ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500'
                      : 'bg-gray-900/50 text-gray-400 border-2 border-gray-700 hover:border-cyan-500 hover:text-cyan-400'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">Missions</span>
                </motion.button>
              </Link>

              <Link to={createPageUrl('Onboarding')}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    currentPageName === 'Onboarding'
                      ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500'
                      : 'bg-gray-900/50 text-gray-400 border-2 border-gray-700 hover:border-purple-500 hover:text-purple-400'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden md:inline">Tutorial</span>
                </motion.button>
              </Link>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-red-900/50 text-red-400 border-2 border-red-700 hover:border-red-500 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden md:inline">Logout</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogin}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-green-900/50 text-green-400 border-2 border-green-700 hover:border-green-500 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="hidden md:inline">Login</span>
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Page Content with top padding for fixed nav */}
      <div className="pt-16">
        {children}
      </div>

      <style jsx>{`
        @keyframes neon-glow {
          0%, 100% { filter: drop-shadow(0 0 2px #00ffff) drop-shadow(0 0 4px #00ffff); }
          50% { filter: drop-shadow(0 0 4px #00ffff) drop-shadow(0 0 8px #ff00ff); }
        }
      `}</style>
    </div>
  );
}