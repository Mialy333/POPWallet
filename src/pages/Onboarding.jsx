import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Coins, Globe, Target, Send, Wallet, Trophy, 
  Zap, ArrowRight, Sparkles, Map, Award, CheckCircle2,
  TrendingUp, Lock, Star, Plane, Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: 'Welcome to POP Wallet',
      subtitle: 'Your Financial Adventure Starts! 🎮',
      description: 'Master international student finance through retro-style missions and earn NFT badges on the blockchain!',
      icon: Sparkles,
      gradient: 'from-yellow-400 via-red-500 to-pink-500',
      emoji: '💰'
    },
    {
      id: 1,
      title: 'Level 1: Budget Boss',
      subtitle: 'Track Your Coins 🪙',
      description: 'Calculate your monthly income vs expenses. Save at least €50 to beat Level 1 and unlock your first NFT power-up!',
      icon: Coins,
      gradient: 'from-yellow-400 to-orange-500',
      emoji: '🏆',
      features: ['Real-time coin tracking', 'Visual spending bar', 'Power-up: Smart Saver NFT']
    },
    {
      id: 2,
      title: 'Level 2: World Explorer',
      subtitle: 'Go Global 🌍',
      description: 'Convert your home currency to EUR using live exchange rates. Discover how far your coins go in European cities!',
      icon: Globe,
      gradient: 'from-orange-400 to-red-500',
      emoji: '✈️',
      features: ['Live API exchange rates', 'Multi-currency support', 'City cost battle', 'Power-up: Explorer NFT']
    },
    {
      id: 3,
      title: 'Level 3: Map Quest',
      subtitle: 'Explore Student Zones 📍',
      description: 'Unlock interactive maps showing cheap eats, affordable housing, and study spots in Lisbon, Paris, and Madrid!',
      icon: Map,
      gradient: 'from-blue-400 to-cyan-500',
      emoji: '🗺️',
      features: ['Real locations unlocked', 'Budget-friendly spots', 'Community tips', 'Student power-ups']
    },
    {
      id: 4,
      title: 'Level 4: Goal Master',
      subtitle: 'Set Your Quest 🎯',
      description: 'Define 3 monthly financial goals and lock them in. Level up with community tips from players worldwide!',
      icon: Target,
      gradient: 'from-red-400 to-pink-500',
      emoji: '🎯',
      features: ['Set 3 epic goals', 'Community high scores', 'Power-up: Planner NFT']
    },
    {
      id: 5,
      title: 'Level 5: Blockchain Hero',
      subtitle: 'Future Payments ⚡',
      description: 'Simulate a cross-border payment on the XRP Ledger. Experience next-gen international money transfers!',
      icon: Send,
      gradient: 'from-pink-400 to-purple-500',
      emoji: '🚀',
      features: ['Real blockchain action', 'XRPL Testnet quest', 'Cross-border demo', 'Power-up: Pioneer NFT']
    },
    {
      id: 6,
      title: 'NFT Collection System',
      subtitle: 'Collect Digital Badges 🏆',
      description: 'Generate your XRP wallet and mint NFT badges for each completed level. Your achievements live on the blockchain forever!',
      icon: Award,
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      emoji: '💎',
      features: ['XRPL wallet spawn', '4 unique NFT badges', 'Permanent blockchain records', 'Show off your collection']
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .retro-shadow {
          box-shadow: 
            4px 4px 0px rgba(0, 0, 0, 0.8),
            8px 8px 0px rgba(255, 215, 0, 0.5);
        }
        
        @keyframes arcade-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.3; }
        }
      `}</style>

      <div className="absolute inset-0 pixel-grid opacity-30"></div>

      {/* Floating Arcade Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['💰', '🎮', '⭐', '🏆', '💎', '🎯', '🚀', '👾'][i % 8]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Arcade Progress Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-300 font-black text-sm bg-black/70 px-3 py-1 border-2 border-yellow-400" style={{ fontFamily: 'monospace' }}>
                LEVEL {currentStep + 1} / {steps.length}
              </span>
              <span className="text-white font-black text-sm bg-black/70 px-3 py-1 border-2 border-white" style={{ fontFamily: 'monospace' }}>
                {Math.round(((currentStep + 1) / steps.length) * 100)}% COMPLETE
              </span>
            </div>
            <div className="h-4 bg-black border-4 border-yellow-400 rounded-none overflow-hidden retro-shadow">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Main Content Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              <Card className="bg-black/90 backdrop-blur-xl border-4 border-yellow-400 overflow-hidden retro-shadow">
                {/* Header with Gradient */}
                <div className={`bg-gradient-to-r ${currentStepData.gradient} p-2`}>
                  <div className="bg-black/90 p-6 border-2 border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className="w-20 h-20 rounded-none bg-black border-4 border-yellow-400 flex items-center justify-center retro-shadow"
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.15, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <currentStepData.icon className="w-10 h-10 text-yellow-400" />
                      </motion.div>
                      
                      <motion.div
                        className="text-6xl"
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {currentStepData.emoji}
                      </motion.div>
                    </div>

                    <motion.h2 
                      className="text-2xl md:text-4xl font-black text-yellow-400 mb-2"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        textShadow: '4px 4px 0px #FF1744'
                      }}
                    >
                      {currentStepData.title}
                    </motion.h2>
                    <p className="text-white font-bold text-base bg-black/50 inline-block px-3 py-1 border-2 border-red-500" style={{ fontFamily: 'monospace' }}>
                      {currentStepData.subtitle}
                    </p>
                  </div>
                </div>

                <CardContent className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-purple-900/50 to-indigo-900/50">
                  {/* Description */}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white text-lg leading-relaxed font-bold bg-black/50 p-4 border-2 border-cyan-400"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {currentStepData.description}
                  </motion.p>

                  {/* Features List */}
                  {currentStepData.features && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3"
                    >
                      {currentStepData.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-start gap-3 bg-black/70 border-2 border-green-400 p-3 hover:border-yellow-400 transition-all"
                          whileHover={{ scale: 1.02, x: 5 }}
                          style={{ fontFamily: 'monospace' }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                          </motion.div>
                          <span className="text-white font-bold">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* First Step Special */}
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-red-600/80 to-pink-600/80 border-4 border-yellow-400 p-4 retro-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Gift className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                        </motion.div>
                        <div>
                          <h3 className="text-yellow-400 font-black text-sm mb-2" style={{ fontFamily: 'monospace' }}>POWER-UPS INCLUDED:</h3>
                          <ul className="text-white text-sm space-y-1 font-bold" style={{ fontFamily: 'monospace' }}>
                            <li>• 4 blockchain NFT badges 💎</li>
                            <li>• Real-world money skills 💰</li>
                            <li>• Interactive city maps 🗺️</li>
                            <li>• Blockchain experience ⚡</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Last Step CTA */}
                  {isLastStep && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-yellow-500/80 to-red-500/80 border-4 border-white p-6 text-center retro-shadow"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1.5, repeat: Infinity }
                        }}
                        className="text-7xl mb-4"
                      >
                        🎉
                      </motion.div>
                      <h3 className="text-black font-black text-3xl mb-3" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                        PRESS START!
                      </h3>
                      <p className="text-white font-bold mb-4 bg-black/50 inline-block px-4 py-2 border-2 border-white" style={{ fontFamily: 'monospace' }}>
                        ALL LEVELS UNLOCKED IN ARCADE!
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Trophy className="w-8 h-8 text-yellow-300" />
                        </motion.div>
                        <span className="text-yellow-300 font-black text-xl" style={{ fontFamily: 'monospace' }}>
                          4 NFT BADGES
                        </span>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                        >
                          <Star className="w-8 h-8 text-yellow-300" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between gap-4 pt-4">
                    {currentStep > 0 ? (
                      <motion.div whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setCurrentStep(prev => prev - 1)}
                          className="border-4 border-blue-500 bg-blue-600 text-white hover:bg-blue-500 font-black px-6 py-3 h-auto retro-shadow"
                          style={{ fontFamily: 'monospace' }}
                        >
                          ← BACK
                        </Button>
                      </motion.div>
                    ) : (
                      <div />
                    )}

                    {!isLastStep ? (
                      <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setCurrentStep(prev => prev + 1)}
                          className={`bg-gradient-to-r ${currentStepData.gradient} border-4 border-black font-black px-6 py-3 h-auto retro-shadow hover:brightness-110 transition-all`}
                          style={{ fontFamily: 'monospace', color: '#000' }}
                        >
                          NEXT LEVEL
                          <motion.div
                            animate={{ x: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="ml-2 inline-block"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    ) : (
                      <Link to={createPageUrl('Home')}>
                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 border-4 border-black font-black px-8 py-4 text-xl h-auto retro-shadow hover:brightness-125 transition-all"
                            style={{ fontFamily: "'Press Start 2P', cursive", color: '#000' }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="mr-3 inline-block"
                            >
                              <Zap className="w-6 h-6" />
                            </motion.div>
                            INSERT COIN!
                            <Sparkles className="w-6 h-6 ml-3" />
                          </Button>
                        </motion.div>
                      </Link>
                    )}
                  </div>

                  {/* Skip Button */}
                  {!isLastStep && (
                    <div className="text-center pt-2">
                      <Link to={createPageUrl('Home')}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="text-yellow-400 hover:text-white text-sm font-black transition-colors bg-black/50 px-4 py-2 border-2 border-yellow-400"
                          style={{ fontFamily: 'monospace' }}
                        >
                          SKIP TUTORIAL →
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Level Indicators (Arcade Style) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 mt-8"
          >
            {steps.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`h-4 w-4 border-2 transition-all ${
                  index === currentStep 
                    ? 'bg-yellow-400 border-yellow-600 w-8' 
                    : index < currentStep
                    ? 'bg-green-400 border-green-600'
                    : 'bg-gray-700 border-gray-900'
                }`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                animate={index === currentStep ? {
                  boxShadow: [
                    '0 0 0px rgba(255, 215, 0, 0.5)',
                    '0 0 20px rgba(255, 215, 0, 1)',
                    '0 0 0px rgba(255, 215, 0, 0.5)'
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-black border-4 border-red-500 retro-shadow">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5 text-yellow-400" />
              </motion.span>
              <span className="text-yellow-400 text-xs font-black" style={{ fontFamily: 'monospace' }}>
                POWERED BY XRPL BLOCKCHAIN
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}