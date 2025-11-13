import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, LogOut, LogIn, Menu, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      await base44.auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
      window.location.reload();
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin();
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .retro-text {
          font-family: 'Press Start 2P', cursive;
          text-shadow: 
            3px 3px 0px #FF1744,
            6px 6px 0px #FFD600,
            9px 9px 0px #00E676;
        }
        
        .pixel-border {
          box-shadow: 
            0 0 0 2px #000,
            0 0 0 4px #FFF,
            0 0 0 6px #FF1744,
            0 0 20px rgba(255, 23, 68, 0.5);
        }
        
        .retro-glow {
          animation: retro-pulse 2s ease-in-out infinite;
        }
        
        @keyframes retro-pulse {
          0%, 100% { 
            box-shadow: 0 0 10px #FF1744, 0 0 20px #FFD600, 0 0 30px #00E676;
          }
          50% { 
            box-shadow: 0 0 20px #FF1744, 0 0 40px #FFD600, 0 0 60px #00E676;
          }
        }
        
        @keyframes pixel-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }
        
        .pixel-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .logo-shadow {
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5)) 
                  drop-shadow(0 0 20px rgba(255, 23, 68, 0.3))
                  drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .coin-glow {
          filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) 
                  drop-shadow(0 0 25px rgba(255, 140, 0, 0.4));
        }
      `}</style>

      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b-2 md:border-b-4 border-yellow-400 pixel-grid"
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link to={createPageUrl('Home')} onClick={closeMenu}>
              <motion.div 
                className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-purple-900/80 border-2 md:border-3 border-yellow-400 rounded-lg logo-shadow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.9) 0%, rgba(49, 46, 129, 0.9) 50%, rgba(88, 28, 135, 0.9) 100%)',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="text-3xl md:text-5xl coin-glow"
                >
                  💰
                </motion.div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <h1 
                      className="text-xl md:text-3xl font-black tracking-wider"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        background: 'linear-gradient(to bottom, #FFD600 0%, #FFA500 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(2px 2px 0px #FF1744) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'
                      }}
                    >
                      POP
                    </h1>
                    <p 
                      className="text-sm md:text-xl font-black" 
                      style={{ 
                        fontFamily: "'Press Start 2P', cursive", 
                        color: '#00E5FF',
                        textShadow: '1px 1px 0px #0091EA, 0 0 10px rgba(0, 229, 255, 0.5)'
                      }}
                    >
                      WALLET
                    </p>
                  </div>
                  <p className="text-[8px] md:text-[10px] text-yellow-300 font-bold tracking-widest mt-0.5" style={{ fontFamily: 'monospace' }}>
                    STUDENT FINANCE
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link to={createPageUrl('Home')}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-none font-bold text-sm transition-all border-2 md:border-4 ${
                    currentPageName === 'Home'
                      ? 'bg-yellow-400 text-black border-yellow-600 shadow-lg shadow-yellow-400/50'
                      : 'bg-red-500 text-white border-red-700 hover:bg-red-400'
                  }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  <Home className="w-4 h-4" />
                  PLAY
                </motion.button>
              </Link>

              <Link to={createPageUrl('Onboarding')}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-none font-bold text-sm transition-all border-2 md:border-4 ${
                    currentPageName === 'Onboarding'
                      ? 'bg-yellow-400 text-black border-yellow-600 shadow-lg shadow-yellow-400/50'
                      : 'bg-blue-500 text-white border-blue-700 hover:bg-blue-400'
                  }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  <BookOpen className="w-4 h-4" />
                  GUIDE
                </motion.button>
              </Link>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-none font-bold text-sm bg-red-600 text-white border-2 md:border-4 border-red-800 hover:bg-red-500 transition-all"
                      style={{ fontFamily: 'monospace' }}
                    >
                      <LogOut className="w-4 h-4" />
                      EXIT
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogin}
                      className="flex items-center gap-2 px-4 py-2 rounded-none font-bold text-sm bg-green-500 text-white border-2 md:border-4 border-green-700 hover:bg-green-400 transition-all"
                      style={{ fontFamily: 'monospace' }}
                    >
                      <LogIn className="w-4 h-4" />
                      START
                    </motion.button>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-yellow-400 border-2 border-black"
              style={{ fontFamily: 'monospace' }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 space-y-2 overflow-hidden"
              >
                <Link to={createPageUrl('Home')} onClick={closeMenu}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-none font-bold text-sm transition-all border-2 ${
                      currentPageName === 'Home'
                        ? 'bg-yellow-400 text-black border-yellow-600 shadow-lg'
                        : 'bg-red-500 text-white border-red-700'
                    }`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    <Home className="w-5 h-5" />
                    PLAY GAME
                  </motion.button>
                </Link>

                <Link to={createPageUrl('Onboarding')} onClick={closeMenu}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-none font-bold text-sm transition-all border-2 ${
                      currentPageName === 'Onboarding'
                        ? 'bg-yellow-400 text-black border-yellow-600 shadow-lg'
                        : 'bg-blue-500 text-white border-blue-700'
                    }`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    <BookOpen className="w-5 h-5" />
                    HOW TO PLAY
                  </motion.button>
                </Link>

                {!isLoading && (
                  <>
                    {isAuthenticated ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-none font-bold text-sm bg-red-600 text-white border-2 border-red-800 transition-all"
                        style={{ fontFamily: 'monospace' }}
                      >
                        <LogOut className="w-5 h-5" />
                        EXIT GAME
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleLogin();
                          closeMenu();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-none font-bold text-sm bg-green-500 text-white border-2 border-green-700 transition-all"
                        style={{ fontFamily: 'monospace' }}
                      >
                        <LogIn className="w-5 h-5" />
                        START GAME
                      </motion.button>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Page Content */}
      <div className="pt-16 md:pt-20">
        {children}
      </div>

      {/* Retro Footer Badge - Hidden on small mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-2 md:bottom-4 right-2 md:right-4 z-40 hidden sm:block"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white px-2 md:px-4 py-1 md:py-2 border-2 md:border-4 border-black shadow-lg"
          style={{ fontFamily: 'monospace' }}
        >
          <div className="flex items-center gap-1 md:gap-2">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-sm md:text-base"
            >
              🎮
            </motion.span>
            <span className="text-[10px] md:text-xs font-black">RETRO MODE</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}