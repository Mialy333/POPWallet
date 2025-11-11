import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, TrendingUp, Award, Sparkles, Euro, Zap, Trophy, Star, Coins, Globe, Target, CheckCircle2, Lock, Plane, Map, MapPin, Passport, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CURRENCY_RATES = {
  EUR: { symbol: '€', rate: 1, name: 'Euro', flag: '🇪🇺', country: 'Europe' },
  USD: { symbol: '$', rate: 1.09, name: 'US Dollar', flag: '🇺🇸', country: 'USA' },
  GBP: { symbol: '£', rate: 0.86, name: 'British Pound', flag: '🇬🇧', country: 'UK' },
  INR: { symbol: '₹', rate: 90.5, name: 'Indian Rupee', flag: '🇮🇳', country: 'India' },
  CNY: { symbol: '¥', rate: 7.85, name: 'Chinese Yuan', flag: '🇨🇳', country: 'China' },
  JPY: { symbol: '¥', rate: 161.2, name: 'Japanese Yen', flag: '🇯🇵', country: 'Japan' },
  BRL: { symbol: 'R$', rate: 5.42, name: 'Brazilian Real', flag: '🇧🇷', country: 'Brazil' },
  NGN: { symbol: '₦', rate: 870, name: 'Nigerian Naira', flag: '🇳🇬', country: 'Nigeria' }
};

export default function Home() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [balance, setBalance] = useState(null);
  
  // Currency converter
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertAmount, setConvertAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converterUsed, setConverterUsed] = useState(false);
  
  // Goals
  const [goals, setGoals] = useState(['', '', '']);
  const [goalsSet, setGoalsSet] = useState(false);
  
  // Wallet & NFT
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletSeed, setWalletSeed] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState({
    smartSaver: false,
    explorer: false,
    planner: false
  });
  const [currentlyMinting, setCurrentlyMinting] = useState(null);
  
  const [error, setError] = useState(null);
  const [xrplLoaded, setXrplLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load xrpl.js from CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/xrpl@2.11.0/build/xrpl-latest-min.js';
    script.async = true;
    script.onload = () => {
      console.log('XRPL library loaded');
      setXrplLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load XRP Ledger library');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const calculateBalance = () => {
    const inc = parseFloat(income) || 0;
    const exp = parseFloat(expenses) || 0;
    const bal = inc - exp;
    setBalance(bal);
    setError(null);
    
    if (bal > 50) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const convertCurrency = () => {
    const amount = parseFloat(convertAmount) || 0;
    const fromRate = CURRENCY_RATES[fromCurrency].rate;
    const toRate = CURRENCY_RATES[toCurrency].rate;
    const result = (amount / fromRate) * toRate;
    setConvertedAmount(result);
    setConverterUsed(true);
    setError(null);
  };

  const handleSetGoals = () => {
    const filledGoals = goals.filter(g => g.trim() !== '');
    if (filledGoals.length >= 3) {
      setGoalsSet(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setError('Please set all 3 monthly goals to complete this mission!');
    }
  };

  const generateWallet = async () => {
    if (!xrplLoaded || !window.xrpl) {
      setError('XRP Ledger library not loaded yet. Please wait...');
      return;
    }

    try {
      setIsConnecting(true);
      const wallet = window.xrpl.Wallet.generate();
      setWalletAddress(wallet.address);
      setWalletSeed(wallet.seed);
      setError(null);
    } catch (err) {
      setError('Failed to generate wallet: ' + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const mintNFT = async (nftType) => {
    if (!xrplLoaded || !window.xrpl) {
      setError('XRP Ledger library not loaded yet');
      return;
    }

    if (!walletSeed) {
      setError('Please generate a wallet first');
      return;
    }

    try {
      setCurrentlyMinting(nftType);
      setError(null);

      const client = new window.xrpl.Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      const wallet = window.xrpl.Wallet.fromSeed(walletSeed);
      
      try {
        await client.fundWallet(wallet);
      } catch (e) {
        console.log('Wallet funding skipped or already funded');
      }

      const nftData = {
        smartSaver: {
          name: '🏆 Smart Saver NFT',
          description: `Achievement Unlocked: Saved €${balance?.toFixed(2) || '50+'} in monthly budget`,
          level: 'LEVEL 1'
        },
        explorer: {
          name: '🌍 Explorer NFT',
          description: 'Achievement Unlocked: Mastered international currency conversion',
          level: 'LEVEL 2'
        },
        planner: {
          name: '🎯 Planner NFT',
          description: 'Achievement Unlocked: Set strategic financial goals',
          level: 'LEVEL 3'
        }
      };

      const nftMintTx = {
        TransactionType: 'NFTokenMint',
        Account: wallet.address,
        URI: window.xrpl.convertStringToHex(
          JSON.stringify({
            ...nftData[nftType],
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
            mintedAt: new Date().toISOString()
          })
        ),
        Flags: 8,
        TransferFee: 0,
        NFTokenTaxon: 0
      };

      const prepared = await client.autofill(nftMintTx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      if (result.result.meta.TransactionResult === 'tesSUCCESS') {
        setMintedNFTs(prev => ({ ...prev, [nftType]: true }));
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setError('NFT minting failed: ' + result.result.meta.TransactionResult);
      }

      await client.disconnect();
    } catch (err) {
      setError('NFT minting error: ' + err.message);
      console.error(err);
    } finally {
      setCurrentlyMinting(null);
    }
  };

  const getSpendingPercentage = () => {
    if (!income || !expenses) return 0;
    return Math.min((parseFloat(expenses) / parseFloat(income)) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'from-green-400 to-cyan-400';
    if (percentage < 75) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-pink-400';
  };

  const missions = [
    {
      id: 'smartSaver',
      title: 'Smart Saver',
      description: 'Save at least €50',
      completed: balance !== null && balance > 50,
      icon: Trophy,
      color: 'cyan',
      nftType: 'smartSaver'
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Use the currency converter',
      completed: converterUsed,
      icon: Globe,
      color: 'purple',
      nftType: 'explorer'
    },
    {
      id: 'planner',
      title: 'Planner',
      description: 'Set 3 monthly goals',
      completed: goalsSet,
      icon: Target,
      color: 'pink',
      nftType: 'planner'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Retro Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Travel Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['✈️', '🌍', '🎓', '🗺️', '🧳', '📚', '🏛️', '🎒'].map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-20"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%'
              }}
              initial={{ y: 0, rotate: 0, opacity: 1 }}
              animate={{ 
                y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100, 
                rotate: 360,
                opacity: 0
              }}
              transition={{ duration: Math.random() * 2 + 2, delay: Math.random() * 0.5 }}
            >
              {['⭐', '💎', '🎮', '🏆', '💰', '✈️', '🌍', '🎓'][Math.floor(Math.random() * 8)]}
            </motion.div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
        @keyframes neon-glow {
          0%, 100% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
          50% { text-shadow: 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff, 0 0 50px #ff00ff; }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(255, 0, 255, 0.5), inset 0 0 30px rgba(255, 0, 255, 0.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Retro Header with Travel Theme */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            {/* Passport-style Badge */}
            <motion.div 
              className="inline-block mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-1 rounded-2xl">
                  <div className="bg-black p-4 rounded-xl border-2 border-dashed border-cyan-400/50">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-8 h-8 text-cyan-400" />
                      <Plane className="w-8 h-8 text-purple-400" style={{ animation: 'float 3s ease-in-out infinite' }} />
                      <Globe className="w-8 h-8 text-pink-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-black mb-2 tracking-wider"
              style={{
                fontFamily: 'Arial Black, sans-serif',
                background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'neon-glow 2s ease-in-out infinite'
              }}
            >
              CAMPUS<span className="text-pink-500">Fi</span>
            </motion.h1>
            
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs md:text-sm font-bold tracking-widest mb-3">
              <Passport className="w-4 h-4" />
              <span className="uppercase">Your Study Abroad Financial Companion</span>
              <Passport className="w-4 h-4" />
            </div>

            {/* Country Flags Animation */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {Object.values(CURRENCY_RATES).map((curr, i) => (
                <motion.div
                  key={curr.country}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl"
                  style={{ animation: `float ${2 + i * 0.3}s ease-in-out infinite` }}
                >
                  {curr.flag}
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full">
                <span className="text-cyan-400 text-xs font-bold">🌍 8 COUNTRIES</span>
              </div>
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-500 rounded-full">
                <span className="text-purple-400 text-xs font-bold">✈️ STUDY ABROAD</span>
              </div>
              <div className="px-3 py-1 bg-pink-500/20 border border-pink-500 rounded-full">
                <span className="text-pink-400 text-xs font-bold">🎓 STUDENT LIFE</span>
              </div>
              <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full">
                <span className="text-yellow-400 text-xs font-bold">💎 XRP NFT</span>
              </div>
            </div>

            {/* Motivational Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-gray-400 text-sm italic"
            >
              "Master your money, conquer the world 🌍"
            </motion.div>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-red-400 font-bold text-center">⚠️ {error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mission Progress Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl blur opacity-50"></div>
              <div className="relative bg-black/90 backdrop-blur-xl border-2 border-yellow-500 rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-yellow-400 font-black text-xl md:text-2xl uppercase tracking-wider flex items-center gap-2">
                    <Map className="w-6 h-6" />
                    Your Study Abroad Journey
                  </h2>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-bold">
                      {missions.filter(m => m.completed).length}/3 Destinations
                    </span>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {missions.map((mission, index) => (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative border-2 rounded-xl p-4 ${
                        mission.completed 
                          ? `border-${mission.color}-400 bg-${mission.color}-500/10` 
                          : 'border-gray-600 bg-gray-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-lg ${
                          mission.completed ? `bg-${mission.color}-500/20` : 'bg-gray-800'
                        }`}>
                          <mission.icon className={`w-5 h-5 ${
                            mission.completed ? `text-${mission.color}-400` : 'text-gray-500'
                          }`} />
                        </div>
                        {mission.completed ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 text-xs font-bold">DONE</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded-full">
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500 text-xs font-bold">LOCKED</span>
                          </div>
                        )}
                      </div>
                      <h3 className={`font-black text-sm uppercase ${
                        mission.completed ? `text-${mission.color}-400` : 'text-gray-500'
                      }`}>
                        🎯 {mission.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">{mission.description}</p>
                      {mission.completed && !mintedNFTs[mission.nftType] && walletAddress && (
                        <Button
                          onClick={() => mintNFT(mission.nftType)}
                          disabled={currentlyMinting === mission.nftType}
                          className="w-full mt-3 h-8 text-xs font-bold"
                          style={{
                            background: `linear-gradient(45deg, var(--${mission.color}-500), var(--${mission.color}-600))`
                          }}
                        >
                          {currentlyMinting === mission.nftType ? '⚡ Minting...' : '💎 Claim NFT Badge'}
                        </Button>
                      )}
                      {mintedNFTs[mission.nftType] && (
                        <div className="mt-3 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-xs font-bold">
                            <Award className="w-3 h-3" />
                            NFT BADGE EARNED
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Budget Calculator Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                  
                  <Card className="relative bg-black/80 backdrop-blur-xl border-2 border-cyan-500 shadow-2xl overflow-hidden" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                    <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.5) 2px, rgba(0, 255, 255, 0.5) 4px)'
                    }}></div>

                    <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b-2 border-cyan-500">
                      <CardTitle className="flex items-center gap-3 text-cyan-400 text-lg md:text-xl font-black uppercase tracking-wider">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Coins className="w-5 h-5" />
                        </div>
                        Student Budget
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-xs bg-cyan-500/30 px-2 py-1 rounded-full border border-cyan-500">
                            🎯 MISSION 1
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-4 md:p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="relative">
                          <Label className="text-cyan-400 font-bold uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            Monthly Income (€)
                          </Label>
                          <Input
                            type="number"
                            placeholder="1000"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            className="bg-black/50 border-2 border-cyan-500/50 focus:border-cyan-400 text-cyan-300 text-lg font-bold placeholder:text-cyan-800 rounded-xl h-12"
                          />
                          <div className="absolute right-3 top-[38px] text-xl">💶</div>
                        </div>

                        <div className="relative">
                          <Label className="text-pink-400 font-bold uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            Monthly Expenses (€)
                          </Label>
                          <Input
                            type="number"
                            placeholder="800"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            className="bg-black/50 border-2 border-pink-500/50 focus:border-pink-400 text-pink-300 text-lg font-bold placeholder:text-pink-800 rounded-xl h-12"
                          />
                          <div className="absolute right-3 top-[38px] text-xl">🏠</div>
                        </div>
                      </div>

                      {/* Spending Progress Bar */}
                      {income && expenses && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-400">💰 Budget Usage</span>
                            <span className={`${
                              getSpendingPercentage() < 50 ? 'text-green-400' :
                              getSpendingPercentage() < 75 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {getSpendingPercentage().toFixed(0)}%
                            </span>
                          </div>
                          <div className="relative h-6 bg-black/50 rounded-full overflow-hidden border-2 border-gray-700">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${getSpendingPercentage()}%` }}
                              className={`h-full bg-gradient-to-r ${getProgressColor(getSpendingPercentage())} relative`}
                              style={{
                                boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)'
                              }}
                            >
                              <div className="absolute inset-0 opacity-30" style={{
                                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255, 255, 255, 0.5) 5px, rgba(255, 255, 255, 0.5) 10px)'
                              }}></div>
                            </motion.div>
                          </div>
                          <p className="text-xs text-gray-400 text-center">
                            {getSpendingPercentage() < 50 ? '✅ Great! Living below your means' :
                             getSpendingPercentage() < 75 ? '⚠️ Watch your spending carefully' :
                             '🚨 Budget alert! Time to cut expenses'}
                          </p>
                        </div>
                      )}

                      <Button 
                        onClick={calculateBalance}
                        className="w-full h-12 text-base font-black uppercase tracking-wider relative overflow-hidden group"
                        style={{
                          background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                          border: 'none'
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 text-black">
                          <Trophy className="w-5 h-5" />
                          Calculate Savings
                        </span>
                      </Button>

                      {/* Balance Result */}
                      <AnimatePresence>
                        {balance !== null && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative"
                          >
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-2xl blur opacity-75"></div>
                            <div className="relative bg-black border-2 border-green-400 rounded-2xl p-4 overflow-hidden">
                              <div className="relative">
                                <p className="text-green-400 font-bold uppercase text-xs mb-2 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  Monthly Savings Power
                                </p>
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`text-4xl font-black text-center ${balance > 0 ? 'text-green-400' : 'text-red-400'}`}
                                  style={{
                                    textShadow: balance > 0 
                                      ? '0 0 20px rgba(0, 255, 0, 0.8)'
                                      : '0 0 20px rgba(255, 0, 0, 0.8)'
                                  }}
                                >
                                  €{Math.abs(balance).toFixed(2)}
                                </motion.div>
                                {balance > 50 && (
                                  <div className="text-center mt-2">
                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/20 border border-yellow-400 rounded-full text-yellow-400 text-xs font-bold mb-2">
                                      <Trophy className="w-3 h-3" />
                                      MISSION 1 COMPLETE!
                                    </div>
                                    <p className="text-green-300 text-xs">🎉 You're ready for your study abroad adventure!</p>
                                  </div>
                                )}
                                {balance > 0 && balance <= 50 && (
                                  <p className="text-center text-yellow-400 text-xs mt-2">
                                    💪 Save €{(51 - balance).toFixed(2)} more to unlock your first NFT badge!
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Currency Converter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75"></div>
                  <Card className="relative bg-black/80 backdrop-blur-xl border-2 border-purple-500 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b-2 border-purple-500">
                      <CardTitle className="flex items-center gap-3 text-purple-400 text-lg md:text-xl font-black uppercase tracking-wider">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Globe className="w-5 h-5" style={{ animation: 'float 3s ease-in-out infinite' }} />
                        </div>
                        World Currency
                        <div className="ml-auto text-xs bg-purple-500/30 px-2 py-1 rounded-full border border-purple-500">
                          ✈️ MISSION 2
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4">
                      <div className="text-center mb-2">
                        <p className="text-xs text-gray-400">🌍 Convert between 8 study destinations</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-purple-400 font-bold uppercase text-xs mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            From {CURRENCY_RATES[fromCurrency]?.flag}
                          </Label>
                          <Select value={fromCurrency} onValueChange={setFromCurrency}>
                            <SelectTrigger className="bg-black/50 border-2 border-purple-500/50 text-purple-300 font-bold h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                                <SelectItem key={code} value={code}>
                                  {data.flag} {code} - {data.country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-pink-400 font-bold uppercase text-xs mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            To {CURRENCY_RATES[toCurrency]?.flag}
                          </Label>
                          <Select value={toCurrency} onValueChange={setToCurrency}>
                            <SelectTrigger className="bg-black/50 border-2 border-pink-500/50 text-pink-300 font-bold h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                                <SelectItem key={code} value={code}>
                                  {data.flag} {code} - {data.country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Input
                        type="number"
                        placeholder="Enter amount to convert"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(e.target.value)}
                        className="bg-black/50 border-2 border-purple-500/50 text-purple-300 text-lg font-bold rounded-xl h-12"
                      />

                      <Button 
                        onClick={convertCurrency}
                        className="w-full h-12 text-base font-black uppercase"
                        style={{
                          background: 'linear-gradient(45deg, #a855f7, #ec4899)'
                        }}
                      >
                        <Plane className="w-4 h-4 mr-2" />
                        Convert Currency
                      </Button>

                      {convertedAmount !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-purple-500/10 border-2 border-purple-500 rounded-xl p-4 text-center"
                        >
                          <div className="flex items-center justify-center gap-2 mb-2 text-3xl">
                            <span>{CURRENCY_RATES[fromCurrency]?.flag}</span>
                            <span className="text-purple-400">→</span>
                            <span>{CURRENCY_RATES[toCurrency]?.flag}</span>
                          </div>
                          <p className="text-purple-400 text-xs font-bold mb-1">CONVERTED AMOUNT</p>
                          <p className="text-3xl font-black text-pink-400">
                            {CURRENCY_RATES[toCurrency].symbol}{convertedAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {CURRENCY_RATES[fromCurrency].symbol}{convertAmount} {fromCurrency} = {CURRENCY_RATES[toCurrency].symbol}{convertedAmount.toFixed(2)} {toCurrency}
                          </p>
                          {converterUsed && (
                            <div className="mt-3">
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/20 border border-yellow-400 rounded-full text-yellow-400 text-xs font-bold">
                                <Globe className="w-3 h-3" />
                                MISSION 2 COMPLETE!
                              </span>
                              <p className="text-green-300 text-xs mt-2">🌍 You're a global financial explorer!</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Monthly Goals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl blur opacity-75"></div>
                  <Card className="relative bg-black/80 backdrop-blur-xl border-2 border-pink-500 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-pink-500/20 to-orange-500/20 border-b-2 border-pink-500">
                      <CardTitle className="flex items-center gap-3 text-pink-400 text-lg md:text-xl font-black uppercase tracking-wider">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                          <Target className="w-5 h-5" />
                        </div>
                        Study Abroad Goals
                        <div className="ml-auto text-xs bg-pink-500/30 px-2 py-1 rounded-full border border-pink-500">
                          🎯 MISSION 3
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4">
                      <p className="text-xs text-gray-400 text-center mb-2">
                        📚 Set your financial goals for success abroad
                      </p>
                      {goals.map((goal, index) => (
                        <div key={index}>
                          <Label className="text-orange-400 font-bold uppercase text-xs mb-2 flex items-center gap-2">
                            <Star className="w-3 h-3" />
                            Goal {index + 1}
                          </Label>
                          <Input
                            placeholder={`e.g., ${['Save €100 for emergency fund', 'Cut food costs by 20%', 'Find part-time campus job'][index]}`}
                            value={goal}
                            onChange={(e) => {
                              const newGoals = [...goals];
                              newGoals[index] = e.target.value;
                              setGoals(newGoals);
                            }}
                            className="bg-black/50 border-2 border-orange-500/50 text-orange-300 font-bold rounded-xl h-12"
                            disabled={goalsSet}
                          />
                        </div>
                      ))}
                      
                      {!goalsSet ? (
                        <Button 
                          onClick={handleSetGoals}
                          className="w-full h-12 text-base font-black uppercase"
                          style={{
                            background: 'linear-gradient(45deg, #ec4899, #f97316)'
                          }}
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Lock In Goals
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-pink-500/10 border-2 border-pink-500 rounded-xl p-4 text-center"
                        >
                          <p className="text-4xl mb-2">🎯</p>
                          <p className="text-pink-400 font-bold uppercase text-sm mb-2">Goals Activated!</p>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/20 border border-yellow-400 rounded-full text-yellow-400 text-xs font-bold mb-2">
                            <Award className="w-3 h-3" />
                            MISSION 3 COMPLETE!
                          </span>
                          <p className="text-green-300 text-xs mt-2">📈 You're a financial planning master!</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Wallet & NFT Minting */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-green-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                  <Card className="relative bg-black/80 backdrop-blur-xl border-2 border-yellow-500 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 border-b-2 border-yellow-500">
                      <CardTitle className="flex items-center gap-3 text-yellow-400 text-lg md:text-xl font-black uppercase tracking-wider">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Wallet className="w-5 h-5" />
                        </div>
                        NFT Passport
                        <div className="ml-auto text-xs bg-yellow-500/30 px-2 py-1 rounded-full border border-yellow-500">
                          💎 XRP
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      {!walletAddress ? (
                        <div className="text-center space-y-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-green-500 rounded-full flex items-center justify-center border-4 border-dashed border-yellow-300"
                          >
                            <Passport className="w-10 h-10 text-white" />
                          </motion.div>
                          
                          <div>
                            <p className="text-yellow-400 font-bold text-base mb-2">🌟 DIGITAL PASSPORT</p>
                            <p className="text-gray-400 text-sm">Generate your crypto wallet to collect achievement NFTs</p>
                            <p className="text-xs text-gray-500 mt-2">✅ Complete missions above first</p>
                          </div>

                          <Button
                            onClick={generateWallet}
                            disabled={isConnecting || !xrplLoaded}
                            className="w-full h-12 text-base font-black uppercase"
                            style={{
                              background: 'linear-gradient(45deg, #eab308, #22c55e)'
                            }}
                          >
                            {isConnecting ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="inline-block mr-2"
                                >
                                  <Zap className="w-5 h-5" />
                                </motion.div>
                                Creating Wallet...
                              </>
                            ) : (
                              <>
                                <Passport className="w-5 h-5 mr-2" />
                                Create Digital Passport
                                <Sparkles className="w-5 h-5 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-black/90 border-2 border-green-400 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-green-400 font-bold text-xs uppercase flex items-center gap-1">
                                <Passport className="w-3 h-3" />
                                Passport Active
                              </span>
                              <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                                ● VERIFIED
                              </span>
                            </div>
                            <div className="bg-black/50 p-3 rounded-lg border border-green-500/30 mb-3">
                              <p className="text-xs text-gray-400 mb-1">Wallet Address</p>
                              <p className="text-green-300 font-mono text-xs break-all">{walletAddress}</p>
                            </div>
                            <div className="bg-black/50 p-3 rounded-lg border border-yellow-500/30">
                              <p className="text-xs text-gray-400 mb-1">🔑 Secret Key (Save Safely!)</p>
                              <p className="text-yellow-300 font-mono text-xs break-all">{walletSeed}</p>
                            </div>
                          </div>

                          {/* NFT Badge Collection */}
                          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500 rounded-xl p-4">
                            <h3 className="text-purple-400 font-black uppercase text-sm mb-3 flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Study Abroad Badge Collection
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                              {missions.map((mission) => (
                                <div
                                  key={mission.id}
                                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-3 ${
                                    mintedNFTs[mission.nftType]
                                      ? `border-${mission.color}-400 bg-${mission.color}-500/20`
                                      : 'border-gray-700 bg-gray-900/50'
                                  }`}
                                >
                                  {mintedNFTs[mission.nftType] ? (
                                    <>
                                      <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                      >
                                        <Award className={`w-8 h-8 text-${mission.color}-400 mb-1`} />
                                      </motion.div>
                                      <span className={`text-${mission.color}-400 text-xs font-bold text-center leading-tight`}>
                                        {mission.title}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-8 h-8 text-gray-600 mb-1" />
                                      <span className="text-gray-600 text-xs font-bold text-center leading-tight">
                                        Locked
                                      </span>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 text-center">
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-full">
                                <Trophy className="w-4 h-4 text-purple-400" />
                                <span className="text-purple-400 text-sm font-bold">
                                  {Object.values(mintedNFTs).filter(Boolean).length}/3 Badges Collected
                                </span>
                              </div>
                              {Object.values(mintedNFTs).filter(Boolean).length === 3 && (
                                <motion.p
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-yellow-400 text-sm font-bold mt-3"
                                >
                                  🎉 FULL SET! You're a Study Abroad Master!
                                </motion.p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer with Study Abroad Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 space-y-4"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-2">
                <span className="text-cyan-400 text-xs font-bold">🎮 XRP LEDGER TESTNET • NO REAL VALUE • EDUCATIONAL USE ONLY</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
              <p className="text-center text-sm font-bold text-purple-400 mb-2">💡 Study Abroad Financial Tips</p>
              <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-400">
                <div className="text-center">
                  <p className="text-cyan-400 font-bold">🏦 Open Local Bank Account</p>
                  <p>Save on international fees</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-400 font-bold">📱 Use Budgeting Apps</p>
                  <p>Track spending in real-time</p>
                </div>
                <div className="text-center">
                  <p className="text-pink-400 font-bold">🍜 Cook at Home</p>
                  <p>Save 50%+ on food costs</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}