import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, TrendingUp, Trophy, MapPin, Zap, CheckCircle2, Lock, ArrowRight, Star, Flame, Target } from "lucide-react";

export default function Dashboard({ user, walletAddress, balance, income, expenses, missions, mintedNFTs, cityData, onQuickAction }) {
  const completedMissions = missions.filter(m => m.completed).length;
  const totalNFTs = Object.values(mintedNFTs).filter(Boolean).length;
  const nextMission = missions.find(m => !m.completed);

  // Calculate XP and Level
  const xpPerMission = 250;
  const totalXP = completedMissions * xpPerMission;
  const level = Math.floor(totalXP / 500) + 1;
  const xpInCurrentLevel = totalXP % 500;
  const xpForNextLevel = 500;

  const getSpendingPercentage = () => {
    if (!income || !expenses) return 0;
    return Math.min((parseFloat(expenses) / parseFloat(income)) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'from-green-400 to-cyan-400';
    if (percentage < 75) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-pink-400';
  };

  // Determine quick actions based on progress
  const getQuickAction = () => {
    if (!walletAddress) {
      return {
        label: 'CREATE WALLET',
        tab: 'wallet',
        icon: Wallet,
        color: 'green',
        description: 'Start your journey!',
        urgent: true
      };
    }
    if (balance === null) {
      return {
        label: 'SET BUDGET',
        tab: 'budget',
        icon: TrendingUp,
        color: 'cyan',
        description: 'Track your money',
        urgent: true
      };
    }
    if (nextMission) {
      const actionMap = {
        smartSaver: { tab: 'budget', label: 'SAVE €50+', icon: Trophy },
        explorer: { tab: 'convert', label: 'CONVERT CURRENCY', icon: MapPin },
        planner: { tab: 'goals', label: 'SET GOALS', icon: Target },
        budgetExplorer: { tab: 'xrpl', label: 'SEND PAYMENT', icon: Zap }
      };
      const action = actionMap[nextMission.id];
      return {
        ...action,
        color: nextMission.color,
        description: nextMission.description,
        urgent: false
      };
    }
    return {
      label: 'CLAIM REWARDS',
      tab: 'wallet',
      icon: Trophy,
      color: 'yellow',
      description: 'Mint your NFTs!',
      urgent: false
    };
  };

  const quickAction = getQuickAction();

  return (
    <div className="space-y-3 md:space-y-4">
      {/* XP & Level Bar - Top Priority */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-gradient-to-r from-indigo-600/50 via-purple-600/50 to-pink-600/50 backdrop-blur-sm border-2 md:border-4 border-yellow-400 overflow-hidden">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-yellow-400 border-2 md:border-4 border-black flex items-center justify-center"
                >
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-black" />
                </motion.div>
                <div>
                  <p className="text-yellow-400 font-black text-lg md:text-2xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                    LVL {level}
                  </p>
                  <p className="text-white text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                    {user?.full_name || 'Hero'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-black text-sm md:text-base" style={{ fontFamily: 'monospace' }}>
                  {totalXP} XP
                </p>
                <p className="text-gray-300 text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                  🏆 {completedMissions}/4 💎 {totalNFTs}/4
                </p>
              </div>
            </div>
            
            {/* XP Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] md:text-xs font-bold text-white">
                <span>NEXT LEVEL</span>
                <span>{xpInCurrentLevel}/{xpForNextLevel} XP</span>
              </div>
              <div className="relative h-4 md:h-5 bg-black/50 border-2 border-yellow-400 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                />
                <motion.div
                  animate={{ x: [-20, 100], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ width: '20%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Mission - Prominent CTA */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quickAction.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
        >
          <Card className={`bg-gradient-to-br from-${quickAction.color}-600/40 to-${quickAction.color}-800/40 backdrop-blur-sm border-4 border-${quickAction.color}-400 relative overflow-hidden`}>
            {quickAction.urgent && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-2 py-1"
                style={{ fontFamily: 'monospace' }}
              >
                URGENT!
              </motion.div>
            )}
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-12 h-12 md:w-16 md:h-16 bg-${quickAction.color}-500 border-4 border-black flex items-center justify-center`}
                >
                  <quickAction.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-gray-300 text-[10px] md:text-xs font-bold mb-1" style={{ fontFamily: 'monospace' }}>
                    {quickAction.urgent ? '⚡ START HERE' : '🎯 NEXT MISSION'}
                  </p>
                  <h3 className="text-white font-black text-base md:text-2xl mb-1" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                    {quickAction.label}
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm font-bold" style={{ fontFamily: 'monospace' }}>
                    {quickAction.description}
                  </p>
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => onQuickAction(quickAction.tab)}
                  className={`w-full h-12 md:h-14 bg-${quickAction.color}-500 hover:bg-${quickAction.color}-400 text-white border-4 border-black font-black text-sm md:text-lg shadow-lg`}
                  style={{ fontFamily: 'monospace' }}
                >
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    START NOW
                  </motion.span>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                </Button>
              </motion.div>
              
              {!quickAction.urgent && (
                <p className="text-center text-yellow-400 text-[10px] md:text-xs font-black mt-2" style={{ fontFamily: 'monospace' }}>
                  +{xpPerMission} XP REWARD
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Stats Grid - Compact */}
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {/* Wallet Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-green-500/50 h-full">
            <CardContent className="p-2 md:p-3">
              <div className="flex items-center gap-2 mb-1">
                {walletAddress ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
                <p className="text-[10px] md:text-xs font-black text-gray-300" style={{ fontFamily: 'monospace' }}>
                  WALLET
                </p>
              </div>
              <p className={`text-sm md:text-base font-black ${walletAddress ? 'text-green-400' : 'text-gray-500'}`} style={{ fontFamily: 'monospace' }}>
                {walletAddress ? 'ACTIVE' : 'LOCKED'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 h-full">
            <CardContent className="p-2 md:p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className={`w-4 h-4 ${balance !== null ? 'text-cyan-400' : 'text-gray-500'}`} />
                <p className="text-[10px] md:text-xs font-black text-gray-300" style={{ fontFamily: 'monospace' }}>
                  BALANCE
                </p>
              </div>
              <p className={`text-sm md:text-base font-black ${balance !== null ? (balance > 0 ? 'text-cyan-400' : 'text-red-400') : 'text-gray-500'}`} style={{ fontFamily: 'monospace' }}>
                {balance !== null ? `€${Math.abs(balance).toFixed(0)}` : '--'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50 h-full">
            <CardContent className="p-2 md:p-3">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-purple-400" />
                <p className="text-[10px] md:text-xs font-black text-gray-300" style={{ fontFamily: 'monospace' }}>
                  CITY
                </p>
              </div>
              <p className="text-sm md:text-base font-black text-purple-400 truncate" style={{ fontFamily: 'monospace' }}>
                {cityData.flag} {cityData.name}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* NFT Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-pink-500/50 h-full">
            <CardContent className="p-2 md:p-3">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-pink-400" />
                <p className="text-[10px] md:text-xs font-black text-gray-300" style={{ fontFamily: 'monospace' }}>
                  NFTs
                </p>
              </div>
              <p className="text-sm md:text-base font-black text-pink-400" style={{ fontFamily: 'monospace' }}>
                {totalNFTs}/4 💎
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mission Progress Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-black/40 backdrop-blur-sm border-2 border-yellow-400">
          <CardHeader className="p-2 md:p-3 border-b-2 border-yellow-400/30">
            <CardTitle className="flex items-center gap-2 text-xs md:text-sm text-yellow-400 font-black">
              <Flame className="w-4 h-4" />
              MISSION MAP
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {missions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div className={`aspect-square rounded border-2 md:border-4 flex flex-col items-center justify-center gap-1 ${
                    mission.completed
                      ? 'border-green-400 bg-green-900/30'
                      : index === completedMissions
                      ? 'border-yellow-400 bg-yellow-900/30 animate-pulse'
                      : 'border-gray-700 bg-gray-900/30'
                  }`}>
                    {mission.completed ? (
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity }}}
                      >
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                      </motion.div>
                    ) : index === completedMissions ? (
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <mission.icon className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                      </motion.div>
                    ) : (
                      <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    )}
                    <p className="text-[8px] md:text-[10px] font-black text-center" style={{ fontFamily: 'monospace', color: mission.completed ? '#4ade80' : index === completedMissions ? '#facc15' : '#6b7280' }}>
                      {index + 1}
                    </p>
                  </div>
                  {index === completedMissions && !mission.completed && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 border-2 border-black rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-[10px] md:text-xs mt-2 font-bold" style={{ fontFamily: 'monospace' }}>
              {completedMissions === missions.length ? '🎉 ALL COMPLETE!' : `${missions.length - completedMissions} missions remaining`}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pro Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border-2 border-cyan-400/50">
          <CardContent className="p-2 md:p-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <p className="text-cyan-400 text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                💡 TIP: Complete missions in order to unlock all features and earn maximum XP!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}