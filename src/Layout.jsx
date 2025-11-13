import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion } from 'framer-motion';
import { Home, BookOpen, Zap, LogOut, LogIn, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all browser storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Logout and reload to completely reset state
      await base44.auth.logout(window.location.origin);
    } catch (err) {
      console.error('Logout error:', err);
      // Force reload anyway
      window.location.href = window.location.origin;
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .retro-text {
          font-family: 'Press Start 2P', cursive;
          text-shadow: 
            3px 3px 0px #FF1744,
            6px 6px 0px #FFD600;
        }
        
        .pixel-border {
          box-shadow: 
            0 0 0 2px #000,
            0 0 0 4px #FFF,
            0 0 0 6px #FF1744;
        }
        
        .pixel-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @media (max-width: 768px) {
          .retro-text {
            font-size: 1.25rem;
            text-shadow: 2px 2px 0px #FF1744, 4px 4px 0px #FFD600;
          }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b-4 border-yellow-400 pixel-grid"
      >
        <div className="max-w-7xl mx-auto px-3 py-3 md:px-4 md:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <Link to={createPageUrl('Home')}>
              <motion.div 
                className="flex items-center gap-2 md:gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="text-3xl md:text-4xl"
                >
                  💰
                </motion.div>
                <div>
                  <h1 
                    className="text-xl md:text-2xl font-black tracking-wider retro-text"
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      color: '#FFD600'
                    }}
                  >
                    POP
                  </h1>
                  <p className="text-[0.5rem] md:text-xs font-bold text-cyan-400" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                    WALLET
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Center: User Info (Desktop) */}
            {!isLoading && isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-yellow-400"
              >
                <User className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-white" style={{ fontFamily: 'monospace' }}>
                  PLAYER: {user.full_name || user.email?.split('@')[0] || 'HERO'}
                </span>
              </motion.div>
            )}

            {/* Navigation Links */}
            <div className="flex items-center gap-1 md:gap-2">
              <Link to={createPageUrl('Home')}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-none font-bold text-xs md:text-sm transition-all border-2 md:border-4 ${
                    currentPageName === 'Home'
                      ? 'bg-yellow-400 text-black border-yellow-600 shadow-lg shadow-yellow-400/50'
                      : 'bg-red-500 text-white border-red-700 hover:bg-red-400'
                  }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  <Home className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">PLAY</span>
                </motion.button>
              </Link>

              <Link to={createPageUrl('Onboarding')}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-none font-bold text-xs md:text-sm transition-all border-2 md:border-4 ${
                    currentPageName === 'Onboarding'
                      ? 'bg-yellow-400 text-black border-yellow-600 shadow-lg shadow-yellow-400/50'
                      : 'bg-blue-500 text-white border-blue-700 hover:bg-blue-400'
                  }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">GUIDE</span>
                </motion.button>
              </Link>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-none font-bold text-xs md:text-sm bg-red-600 text-white border-2 md:border-4 border-red-800 hover:bg-red-500 transition-all"
                      style={{ fontFamily: 'monospace' }}
                    >
                      <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">EXIT</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogin}
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-none font-bold text-xs md:text-sm bg-green-500 text-white border-2 md:border-4 border-green-700 hover:bg-green-400 transition-all"
                      style={{ fontFamily: 'monospace' }}
                    >
                      <LogIn className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">START</span>
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile: User Info Bar */}
          {!isLoading && isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-yellow-400"
            >
              <User className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-bold text-white truncate max-w-[200px]" style={{ fontFamily: 'monospace' }}>
                {user.full_name || user.email?.split('@')[0] || 'HERO'}
              </span>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Page Content */}
      <div className="pt-16 md:pt-20 pb-20 md:pb-4">
        {children}
      </div>

      {/* Retro Footer Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 right-4 z-40 hidden md:block"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white px-3 py-2 border-4 border-black shadow-lg"
          style={{ fontFamily: 'monospace' }}
        >
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🎮
            </motion.span>
            <span className="text-xs font-black">RETRO MODE</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}