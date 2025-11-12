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
      title: 'Welcome to CampusFi',
      subtitle: 'Your Financial Adventure Begins! 🚀',
      description: 'Master international student finance through gamified missions and earn NFT badges on the blockchain!',
      icon: Sparkles,
      gradient: 'from-cyan-500 via-purple-500 to-pink-500',
      emoji: '🎮'
    },
    {
      id: 1,
      title: 'Mission 1: Budget Master',
      subtitle: 'Track Your Money 💰',
      description: 'Calculate your monthly income vs expenses. Save at least €50 to complete the mission and unlock your first NFT badge!',
      icon: Coins,
      gradient: 'from-cyan-400 to-blue-500',
      emoji: '🏆',
      features: ['Real-time balance tracking', 'Visual spending analytics', 'Achievement unlocked: Smart Saver NFT']
    },
    {
      id: 2,
      title: 'Mission 2: Currency Explorer',
      subtitle: 'Go Global 🌍',
      description: 'Convert your home currency to EUR using live exchange rates. Discover how far your money goes in European cities!',
      icon: Globe,
      gradient: 'from-purple-400 to-pink-500',
      emoji: '✈️',
      features: ['Live API exchange rates', 'Multi-currency support', 'City cost comparisons', 'Achievement: Explorer NFT']
    },
    {
      id: 3,
      title: 'Mission 3: Interactive Maps',
      subtitle: 'Explore Student Hotspots 📍',
      description: 'Unlock interactive maps showing cheap meals, affordable housing, and study spots in Lisbon, Paris, and Madrid!',
      icon: Map,
      gradient: 'from-cyan-400 to-green-500',
      emoji: '🗺️',
      features: ['Real locations on maps', 'Budget-friendly spots', 'Community tips', 'Student discounts']
    },
    {
      id: 4,
      title: 'Mission 4: Goal Planner',
      subtitle: 'Set Your Vision 🎯',
      description: 'Define 3 monthly financial goals and lock them in. Get motivated by community tips from students worldwide!',
      icon: Target,
      gradient: 'from-pink-400 to-orange-500',
      emoji: '🎯',
      features: ['Set 3 personalized goals', 'Community success stories', 'Achievement: Planner NFT']
    },
    {
      id: 5,
      title: 'Mission 5: XRPL Pioneer',
      subtitle: 'Blockchain Payments ⚡',
      description: 'Simulate a cross-border payment on the XRP Ledger. Experience the future of international money transfers!',
      icon: Send,
      gradient: 'from-yellow-400 to-orange-600',
      emoji: '🚀',
      features: ['Real blockchain transaction', 'XRPL Testnet simulation', 'Cross-border payment demo', 'Achievement: Pioneer NFT']
    },
    {
      id: 6,
      title: 'NFT Passport System',
      subtitle: 'Collect Digital Badges 🏆',
      description: 'Generate your XRP wallet and mint NFT badges for each completed mission. Your achievements live on the blockchain forever!',
      icon: Award,
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      emoji: '💎',
      features: ['XRPL wallet generation', '4 unique NFT badges', 'Permanent blockchain records', 'Showcase your progress']
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['⭐', '💎', '🎮', '🏆', '💰', '✈️', '🌍', '🎓'][i % 8]}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
        @keyframes neon-glow {
          0%, 100% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
          50% { text-shadow: 0 0 20px #00ffff, 0 0 30px #ff00ff, 0 0 40px #ff00ff; }
        }
      `}</style>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Progress Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-bold text-sm">
                STEP {currentStep + 1} / {steps.length}
              </span>
              <span className="text-gray-500 font-bold text-sm">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-cyan-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
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
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <Card className="bg-black/60 backdrop-blur-xl border-2 border-cyan-500/50 overflow-hidden">
                {/* Header with Gradient */}
                <div className={`bg-gradient-to-r ${currentStepData.gradient} p-1`}>
                  <div className="bg-black/90 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-black/50 border-2 border-white/20 flex items-center justify-center"
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <currentStepData.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <motion.div
                        className="text-5xl"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {currentStepData.emoji}
                      </motion.div>
                    </div>

                    <motion.h2 
                      className="text-3xl md:text-4xl font-black text-white mb-2"
                      style={{
                        fontFamily: 'Arial Black, sans-serif',
                        animation: 'neon-glow 2s ease-in-out infinite'
                      }}
                    >
                      {currentStepData.title}
                    </motion.h2>
                    <p className="text-cyan-400 font-bold text-lg">
                      {currentStepData.subtitle}
                    </p>
                  </div>
                </div>

                <CardContent className="p-6 md:p-8 space-y-6">
                  {/* Description */}
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-300 text-lg leading-relaxed"
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
                          className="flex items-start gap-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 hover:border-cyan-400 transition-all"
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          </motion.div>
                          <span className="text-gray-300 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Special Message for First Step */}
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Gift className="w-6 h-6 text-pink-400 flex-shrink-0" />
                        </motion.div>
                        <div>
                          <h3 className="text-pink-400 font-black text-sm mb-1">WHAT YOU'LL GET:</h3>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• 4 blockchain NFT badges 🏆</li>
                            <li>• Real-world financial skills 💰</li>
                            <li>• Interactive city guides 🗺️</li>
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
                      className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/50 rounded-xl p-6 text-center"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                          scale: { duration: 1.5, repeat: Infinity }
                        }}
                        className="text-6xl mb-4"
                      >
                        🎉
                      </motion.div>
                      <h3 className="text-yellow-400 font-black text-2xl mb-2">
                        READY TO START YOUR ADVENTURE?
                      </h3>
                      <p className="text-gray-300 mb-4">
                        All missions are waiting for you in the dashboard!
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Trophy className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                        <span className="text-yellow-400 font-black">
                          4 NFT BADGES TO COLLECT
                        </span>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                        >
                          <Star className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between gap-4 pt-4">
                    {currentStep > 0 ? (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setCurrentStep(prev => prev - 1)}
                          variant="outline"
                          className="border-2 border-gray-700 bg-black/50 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 font-bold"
                        >
                          ← Back
                        </Button>
                      </motion.div>
                    ) : (
                      <div />
                    )}

                    {!isLastStep ? (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setCurrentStep(prev => prev + 1)}
                          className={`bg-gradient-to-r ${currentStepData.gradient} font-black px-6 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all`}
                        >
                          Next Mission
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="ml-2"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    ) : (
                      <Link to={createPageUrl('Home')}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 font-black px-8 text-lg hover:shadow-[0_0_40px_rgba(0,255,255,0.8)] transition-all"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Zap className="w-6 h-6" />
                            </motion.div>
                            START NOW!
                            <Sparkles className="w-6 h-6 ml-2" />
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
                          whileHover={{ scale: 1.05 }}
                          className="text-gray-500 hover:text-cyan-400 text-sm font-bold transition-colors"
                        >
                          Skip Tutorial →
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Step Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            {steps.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-8 bg-gradient-to-r from-cyan-500 to-purple-500' 
                    : index < currentStep
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-gray-700'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={index === currentStep ? {
                  boxShadow: [
                    '0 0 0px rgba(0, 255, 255, 0.5)',
                    '0 0 15px rgba(0, 255, 255, 0.8)',
                    '0 0 0px rgba(0, 255, 255, 0.5)'
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500 rounded-full">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-cyan-400" />
              </motion.span>
              <span className="text-cyan-400 text-xs font-black">
                POWERED BY XRPL BLOCKCHAIN
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}