import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, Trophy, MapPin, Zap, CheckCircle2, Lock } from "lucide-react";

export default function Dashboard({ user, walletAddress, balance, income, expenses, missions, mintedNFTs, cityData }) {
  const completedMissions = missions.filter(m => m.completed).length;
  const totalNFTs = Object.values(mintedNFTs).filter(Boolean).length;

  const getSpendingPercentage = () => {
    if (!income || !expenses) return 0;
    return Math.min((parseFloat(expenses) / parseFloat(income)) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'from-green-400 to-cyan-400';
    if (percentage < 75) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-pink-400';
  };

  return (
    <div className="grid gap-3 md:gap-4">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-red-600/50 backdrop-blur-sm border-2 md:border-4 border-yellow-400 retro-shadow">
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <motion.h2 
                  className="text-xl md:text-3xl font-black text-yellow-400 mb-1 md:mb-2"
                  style={{ fontFamily: "'Press Start 2P', cursive" }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  WELCOME!
                </motion.h2>
                <p className="text-white font-bold text-xs md:text-base" style={{ fontFamily: 'monospace' }}>
                  Player: <span className="text-cyan-400">{user?.full_name || 'Hero'}</span>
                </p>
                <p className="text-gray-300 text-xs md:text-sm font-bold mt-1" style={{ fontFamily: 'monospace' }}>
                  🏆 {completedMissions}/4 Missions • 💎 {totalNFTs}/4 NFTs
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="text-4xl md:text-6xl"
              >
                💰
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Wallet Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all">
            <CardHeader className="p-2 md:p-3 border-b-2 border-green-500/30">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base text-green-400 font-black">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wallet className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
                WALLET STATUS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4">
              {walletAddress ? (
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 mb-2"
                  >
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                    <span className="text-green-400 font-black text-xs md:text-sm" style={{ fontFamily: 'monospace' }}>
                      CONNECTED
                    </span>
                  </motion.div>
                  <p className="text-gray-400 text-[10px] md:text-xs font-bold break-all" style={{ fontFamily: 'monospace' }}>
                    {walletAddress.substring(0, 20)}...
                  </p>
                </div>
              ) : (
                <div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-2 mb-2"
                  >
                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                    <span className="text-gray-500 font-black text-xs md:text-sm" style={{ fontFamily: 'monospace' }}>
                      NOT CONNECTED
                    </span>
                  </motion.div>
                  <p className="text-gray-500 text-[10px] md:text-xs" style={{ fontFamily: 'monospace' }}>
                    Go to WALLET tab to connect
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
            <CardHeader className="p-2 md:p-3 border-b-2 border-cyan-500/30">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base text-cyan-400 font-black">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
                BUDGET STATUS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4">
              {balance !== null ? (
                <div>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-2xl md:text-3xl font-black mb-2"
                    style={{
                      color: balance > 0 ? '#22d3ee' : '#ef4444'
                    }}
                  >
                    €{Math.abs(balance).toFixed(0)}
                  </motion.div>
                  <p className="text-gray-400 text-[10px] md:text-xs mb-2 font-bold" style={{ fontFamily: 'monospace' }}>
                    Monthly {balance > 0 ? 'Savings' : 'Deficit'}
                  </p>
                  {income && expenses && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] md:text-xs font-bold text-cyan-400">
                        <span>USAGE</span>
                        <span>{getSpendingPercentage().toFixed(0)}%</span>
                      </div>
                      <div className="relative h-3 md:h-4 bg-gray-900 rounded-full overflow-hidden border border-cyan-500/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getSpendingPercentage()}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full bg-gradient-to-r ${getProgressColor(getSpendingPercentage())}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 font-black text-xs md:text-sm mb-2" style={{ fontFamily: 'monospace' }}>
                    NO DATA YET
                  </p>
                  <p className="text-gray-500 text-[10px] md:text-xs" style={{ fontFamily: 'monospace' }}>
                    Go to BUDGET tab to start
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Location & NFT Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Study Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
            <CardHeader className="p-2 md:p-3 border-b-2 border-purple-500/30">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base text-purple-400 font-black">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
                STUDY CITY
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl md:text-4xl"
                >
                  {cityData.flag}
                </motion.span>
                <div>
                  <p className="text-purple-400 font-black text-base md:text-xl">{cityData.name}</p>
                  <p className="text-gray-400 text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                    {cityData.country}
                  </p>
                </div>
              </div>
              <div className="bg-purple-900/30 border border-purple-500/50 rounded p-2">
                <p className="text-gray-300 text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                  Avg Cost: <span className="text-purple-400 font-black">€{cityData.avgCost}/mo</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* NFT Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all">
            <CardHeader className="p-2 md:p-3 border-b-2 border-pink-500/30">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base text-pink-400 font-black">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
                NFT COLLECTION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4">
              <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                {missions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className={`aspect-square rounded border-2 flex items-center justify-center ${
                      mintedNFTs[mission.nftType]
                        ? 'border-yellow-400 bg-yellow-900/30'
                        : 'border-gray-700 bg-gray-900/30'
                    }`}
                  >
                    {mintedNFTs[mission.nftType] ? (
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <mission.icon className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                      </motion.div>
                    ) : (
                      <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    )}
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-gray-400 text-[10px] md:text-xs mt-2 font-bold" style={{ fontFamily: 'monospace' }}>
                {totalNFTs}/4 BADGES EARNED
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-yellow-600/30 via-red-600/30 to-pink-600/30 backdrop-blur-sm border-2 border-yellow-400">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-center gap-2 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
              </motion.div>
              <p className="text-white font-black text-xs md:text-sm" style={{ fontFamily: 'monospace' }}>
                Use the tabs above to complete missions and earn NFT badges!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}