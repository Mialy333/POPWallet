import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, TrendingUp, Award, Sparkles, Euro, Zap, Trophy, Star, Coins, Globe, Target, CheckCircle2, Lock, Plane, Map, MapPin, GraduationCap, Briefcase, BadgeCheck, MessageCircle, ThumbsUp, MapPinned, Lightbulb, TrendingDown, AlertCircle } from "lucide-react";
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

const CITY_COSTS = {
  lisbon: { name: 'Lisbon', country: 'Portugal', avgCost: 680, flag: '🇵🇹' },
  paris: { name: 'Paris', country: 'France', avgCost: 950, flag: '🇫🇷' },
  madrid: { name: 'Madrid', country: 'Spain', avgCost: 720, flag: '🇪🇸' },
  berlin: { name: 'Berlin', country: 'Germany', avgCost: 850, flag: '🇩🇪' },
  london: { name: 'London', country: 'UK', avgCost: 1200, flag: '🇬🇧' },
  rome: { name: 'Rome', country: 'Italy', avgCost: 780, flag: '🇮🇹' }
};

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Maria S.',
    avatar: '👩‍🎓',
    city: 'Lisbon',
    tip: 'Student discounts at Pingo Doce supermarket every Tuesday! Save 15% on groceries 🛒',
    likes: 42,
    time: '2h ago'
  },
  {
    id: 2,
    author: 'Ahmed K.',
    avatar: '👨‍🎓',
    city: 'Paris',
    tip: 'Use the Navigo student pass - unlimited metro for €38/month instead of €75! 🚇',
    likes: 38,
    time: '5h ago'
  },
  {
    id: 3,
    author: 'Sofia R.',
    avatar: '👩‍💼',
    city: 'Madrid',
    tip: 'Menú del día at local restaurants = 3-course meal for €10-12. Way cheaper than cooking! 🍽️',
    likes: 55,
    time: '1d ago'
  },
  {
    id: 4,
    author: 'Chen W.',
    avatar: '👨‍💻',
    city: 'Berlin',
    tip: 'Mensa (university cafeteria) meals are €2-4 with student ID. Eat there daily! 🍜',
    likes: 67,
    time: '1d ago'
  },
  {
    id: 5,
    author: 'Priya M.',
    avatar: '👩‍🔬',
    city: 'London',
    tip: 'Tesco Express has 50% off ready meals after 8pm. Perfect for budget dinners! 🌙',
    likes: 81,
    time: '2d ago'
  }
];

export default function Home() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [balance, setBalance] = useState(null);
  
  const [selectedCity, setSelectedCity] = useState('lisbon');
  
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [convertAmount, setConvertAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converterUsed, setConverterUsed] = useState(false);
  
  const [goals, setGoals] = useState(['', '', '']);
  const [goalsSet, setGoalsSet] = useState(false);
  
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

  const getBudgetCoachAdvice = () => {
    if (!balance) return null;
    
    const cityData = CITY_COSTS[selectedCity];
    const difference = balance - cityData.avgCost;
    
    if (difference >= 200) {
      return {
        type: 'excellent',
        icon: Trophy,
        color: 'green',
        message: `Amazing! You're €${difference.toFixed(0)} above ${cityData.name}'s average. You're living comfortably! 🌟`,
        advice: 'Consider investing your extra savings or setting up an emergency fund.'
      };
    } else if (difference >= 0) {
      return {
        type: 'good',
        icon: CheckCircle2,
        color: 'blue',
        message: `Good job! You're €${difference.toFixed(0)} above ${cityData.name}'s average cost.`,
        advice: 'You\'re on track! Keep monitoring your expenses to maintain this buffer.'
      };
    } else if (difference >= -100) {
      return {
        type: 'warning',
        icon: AlertCircle,
        color: 'yellow',
        message: `Careful! You're €${Math.abs(difference).toFixed(0)} below ${cityData.name}'s average.`,
        advice: 'Look for ways to cut expenses or increase income. Check the community tips below!'
      };
    } else {
      return {
        type: 'alert',
        icon: TrendingDown,
        color: 'red',
        message: `Alert! You're €${Math.abs(difference).toFixed(0)} below ${cityData.name}'s average cost.`,
        advice: 'Take immediate action: apply for part-time work, seek university financial aid, or reduce non-essential expenses.'
      };
    }
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

  const budgetCoach = getBudgetCoachAdvice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-8"
          >
            <div className="inline-flex items-center justify-center mb-4 bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <GraduationCap className="w-12 h-12 text-blue-600" />
                <Globe className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              CampusFi
            </h1>
            
            <p className="text-gray-600 text-sm md:text-base font-medium">
              Your Study Abroad Financial Companion
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <div className="px-3 py-1 bg-blue-100 rounded-full">
                <span className="text-blue-700 text-xs font-bold">🌍 8 Countries</span>
              </div>
              <div className="px-3 py-1 bg-purple-100 rounded-full">
                <span className="text-purple-700 text-xs font-bold">✈️ Study Abroad</span>
              </div>
              <div className="px-3 py-1 bg-pink-100 rounded-full">
                <span className="text-pink-700 text-xs font-bold">💎 XRP NFTs</span>
              </div>
            </div>
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
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    ⚠️ {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mission Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-800">
                  <Map className="w-5 h-5 text-orange-600" />
                  Your Study Abroad Journey
                  <span className="ml-auto text-sm bg-orange-100 px-3 py-1 rounded-full text-orange-700">
                    {missions.filter(m => m.completed).length}/3 Complete
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {missions.map((mission, index) => (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-2 rounded-xl p-4 ${
                        mission.completed 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-lg ${
                          mission.completed ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          <mission.icon className={`w-5 h-5 ${
                            mission.completed ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        {mission.completed ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-200 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-green-700" />
                            <span className="text-green-700 text-xs font-bold">DONE</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full">
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500 text-xs font-bold">LOCKED</span>
                          </div>
                        )}
                      </div>
                      <h3 className={`font-bold text-sm ${
                        mission.completed ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        🎯 {mission.title}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">{mission.description}</p>
                      {mission.completed && !mintedNFTs[mission.nftType] && walletAddress && (
                        <Button
                          onClick={() => mintNFT(mission.nftType)}
                          disabled={currentlyMinting === mission.nftType}
                          className="w-full mt-3 h-8 text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {currentlyMinting === mission.nftType ? '⚡ Minting...' : '💎 Claim NFT Badge'}
                        </Button>
                      )}
                      {mintedNFTs[mission.nftType] && (
                        <div className="mt-3 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-700 text-xs font-bold">
                            <Award className="w-3 h-3" />
                            NFT EARNED
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Budget & Currency */}
            <div className="lg:col-span-2 space-y-6">
              {/* Budget Calculator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-800">
                      <Coins className="w-5 h-5 text-blue-600" />
                      Student Budget Calculator
                      <span className="ml-auto text-xs bg-cyan-100 px-3 py-1 rounded-full text-cyan-700">
                        Mission 1
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          Monthly Income (€)
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g., 1000"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          className="border-2 border-gray-200 focus:border-blue-400 h-12 text-lg"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          Monthly Expenses (€)
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g., 800"
                          value={expenses}
                          onChange={(e) => setExpenses(e.target.value)}
                          className="border-2 border-gray-200 focus:border-blue-400 h-12 text-lg"
                        />
                      </div>
                    </div>

                    {income && expenses && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold text-gray-700">
                          <span>Budget Usage</span>
                          <span className={`${
                            getSpendingPercentage() < 50 ? 'text-green-600' :
                            getSpendingPercentage() < 75 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {getSpendingPercentage().toFixed(0)}%
                          </span>
                        </div>
                        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${getSpendingPercentage()}%` }}
                            className={`h-full bg-gradient-to-r ${getProgressColor(getSpendingPercentage())}`}
                          />
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                          {getSpendingPercentage() < 50 ? '✅ Great! Living below your means' :
                           getSpendingPercentage() < 75 ? '⚠️ Watch your spending carefully' :
                           '🚨 Budget alert! Time to cut expenses'}
                        </p>
                      </div>
                    )}

                    <Button 
                      onClick={calculateBalance}
                      className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Calculate Savings
                    </Button>

                    {balance !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`border-2 rounded-xl p-4 ${
                          balance > 0 ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Monthly Savings
                        </p>
                        <div className={`text-4xl font-black text-center ${
                          balance > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          €{Math.abs(balance).toFixed(2)}
                        </div>
                        {balance > 50 && (
                          <div className="text-center mt-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-700 text-xs font-bold">
                              <Trophy className="w-3 h-3" />
                              MISSION 1 COMPLETE!
                            </span>
                            <p className="text-green-700 text-xs mt-2">🎉 Ready for study abroad!</p>
                          </div>
                        )}
                        {balance > 0 && balance <= 50 && (
                          <p className="text-center text-yellow-700 text-xs mt-2">
                            💪 Save €{(51 - balance).toFixed(2)} more to unlock NFT!
                          </p>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Dynamic Budget Coach */}
              {balance !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-800">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                        Dynamic Budget Coach
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4">
                      <div>
                        <Label className="text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2">
                          <MapPinned className="w-4 h-4 text-purple-600" />
                          Select Your Study City
                        </Label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger className="border-2 border-gray-200 h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(CITY_COSTS).map(([key, data]) => (
                              <SelectItem key={key} value={key}>
                                {data.flag} {data.name}, {data.country} - €{data.avgCost}/mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {budgetCoach && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border-2 rounded-xl p-4 ${
                            budgetCoach.type === 'excellent' ? 'border-green-300 bg-green-50' :
                            budgetCoach.type === 'good' ? 'border-blue-300 bg-blue-50' :
                            budgetCoach.type === 'warning' ? 'border-yellow-300 bg-yellow-50' :
                            'border-red-300 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              budgetCoach.type === 'excellent' ? 'bg-green-200' :
                              budgetCoach.type === 'good' ? 'bg-blue-200' :
                              budgetCoach.type === 'warning' ? 'bg-yellow-200' :
                              'bg-red-200'
                            }`}>
                              <budgetCoach.icon className={`w-5 h-5 ${
                                budgetCoach.type === 'excellent' ? 'text-green-700' :
                                budgetCoach.type === 'good' ? 'text-blue-700' :
                                budgetCoach.type === 'warning' ? 'text-yellow-700' :
                                'text-red-700'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className={`font-bold text-sm mb-1 ${
                                budgetCoach.type === 'excellent' ? 'text-green-800' :
                                budgetCoach.type === 'good' ? 'text-blue-800' :
                                budgetCoach.type === 'warning' ? 'text-yellow-800' :
                                'text-red-800'
                              }`}>
                                {budgetCoach.message}
                              </p>
                              <p className="text-xs text-gray-700 mt-2">
                                <strong>Coach Advice:</strong> {budgetCoach.advice}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Your Balance</p>
                                <p className="text-xl font-bold text-gray-800">€{balance.toFixed(0)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 mb-1">City Average</p>
                                <p className="text-xl font-bold text-gray-800">€{CITY_COSTS[selectedCity].avgCost}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Currency Converter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-800">
                      <Globe className="w-5 h-5 text-purple-600" />
                      Currency Converter
                      <span className="ml-auto text-xs bg-purple-100 px-3 py-1 rounded-full text-purple-700">
                        Mission 2
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <p className="text-xs text-gray-600 text-center">
                      🌍 Convert between 8 study destinations
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-700 font-semibold text-xs mb-2 block">
                          From {CURRENCY_RATES[fromCurrency]?.flag}
                        </Label>
                        <Select value={fromCurrency} onValueChange={setFromCurrency}>
                          <SelectTrigger className="border-2 border-gray-200 h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                              <SelectItem key={code} value={code}>
                                {data.flag} {code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-semibold text-xs mb-2 block">
                          To {CURRENCY_RATES[toCurrency]?.flag}
                        </Label>
                        <Select value={toCurrency} onValueChange={setToCurrency}>
                          <SelectTrigger className="border-2 border-gray-200 h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                              <SelectItem key={code} value={code}>
                                {data.flag} {code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      className="border-2 border-gray-200 focus:border-purple-400 h-12 text-lg"
                    />

                    <Button 
                      onClick={convertCurrency}
                      className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Plane className="w-4 h-4 mr-2" />
                      Convert Currency
                    </Button>

                    {convertedAmount !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-2 border-purple-300 bg-purple-50 rounded-xl p-4 text-center"
                      >
                        <div className="flex items-center justify-center gap-2 mb-2 text-3xl">
                          <span>{CURRENCY_RATES[fromCurrency]?.flag}</span>
                          <span className="text-purple-600">→</span>
                          <span>{CURRENCY_RATES[toCurrency]?.flag}</span>
                        </div>
                        <p className="text-xs font-semibold text-purple-700 mb-1">CONVERTED AMOUNT</p>
                        <p className="text-3xl font-black text-purple-800">
                          {CURRENCY_RATES[toCurrency].symbol}{convertedAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          {CURRENCY_RATES[fromCurrency].symbol}{convertAmount} {fromCurrency} = {CURRENCY_RATES[toCurrency].symbol}{convertedAmount.toFixed(2)} {toCurrency}
                        </p>
                        {converterUsed && (
                          <div className="mt-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-700 text-xs font-bold">
                              <Globe className="w-3 h-3" />
                              MISSION 2 COMPLETE!
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Goals, Wallet & Community */}
            <div className="space-y-6">
              {/* Monthly Goals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                      <Target className="w-5 h-5 text-pink-600" />
                      Monthly Goals
                      <span className="ml-auto text-xs bg-pink-100 px-2 py-1 rounded-full text-pink-700">
                        Mission 3
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs text-gray-600 text-center">
                      📚 Set your financial goals
                    </p>
                    {goals.map((goal, index) => (
                      <div key={index}>
                        <Label className="text-gray-700 font-semibold text-xs mb-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-orange-500" />
                          Goal {index + 1}
                        </Label>
                        <Input
                          placeholder={`e.g., ${['Save €100', 'Cut food costs 20%', 'Find part-time job'][index]}`}
                          value={goal}
                          onChange={(e) => {
                            const newGoals = [...goals];
                            newGoals[index] = e.target.value;
                            setGoals(newGoals);
                          }}
                          className="border-2 border-gray-200 h-10 text-sm"
                          disabled={goalsSet}
                        />
                      </div>
                    ))}
                    
                    {!goalsSet ? (
                      <Button 
                        onClick={handleSetGoals}
                        className="w-full h-10 text-sm font-bold bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Lock In Goals
                      </Button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border-2 border-pink-300 bg-pink-50 rounded-xl p-3 text-center"
                      >
                        <p className="text-2xl mb-1">🎯</p>
                        <p className="text-pink-700 font-bold text-sm mb-1">Goals Activated!</p>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-700 text-xs font-bold">
                          <Award className="w-3 h-3" />
                          MISSION 3 COMPLETE!
                        </span>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Wallet */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-green-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                      <Wallet className="w-5 h-5 text-yellow-600" />
                      NFT Passport
                      <span className="ml-auto text-xs bg-yellow-100 px-2 py-1 rounded-full text-yellow-700">
                        XRP
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {!walletAddress ? (
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-200 to-green-200 rounded-full flex items-center justify-center">
                          <BadgeCheck className="w-8 h-8 text-yellow-700" />
                        </div>
                        
                        <div>
                          <p className="font-bold text-sm text-gray-800 mb-1">🌟 Digital Passport</p>
                          <p className="text-xs text-gray-600">Generate wallet to collect NFTs</p>
                        </div>

                        <Button
                          onClick={generateWallet}
                          disabled={isConnecting || !xrplLoaded}
                          className="w-full h-10 text-sm font-bold bg-gradient-to-r from-yellow-600 to-green-600 hover:from-yellow-700 hover:to-green-700"
                        >
                          {isConnecting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block mr-2"
                              >
                                <Zap className="w-4 h-4" />
                              </motion.div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <BadgeCheck className="w-4 h-4 mr-2" />
                              Create Passport
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="border-2 border-green-300 bg-green-50 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                              <BadgeCheck className="w-3 h-3" />
                              Active
                            </span>
                            <span className="text-xs font-bold text-green-700">● VERIFIED</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-green-200 mb-2">
                            <p className="text-xs text-gray-600 mb-1">Address</p>
                            <p className="text-green-700 font-mono text-xs break-all">{walletAddress}</p>
                          </div>
                          <div className="bg-white p-2 rounded border border-yellow-200">
                            <p className="text-xs text-gray-600 mb-1">🔑 Secret Key</p>
                            <p className="text-yellow-700 font-mono text-xs break-all">{walletSeed}</p>
                          </div>
                        </div>

                        <div className="border-2 border-purple-300 bg-purple-50 rounded-xl p-3">
                          <h3 className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Badge Collection
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            {missions.map((mission) => (
                              <div
                                key={mission.id}
                                className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 ${
                                  mintedNFTs[mission.nftType]
                                    ? 'border-green-300 bg-green-100'
                                    : 'border-gray-300 bg-gray-100'
                                }`}
                              >
                                {mintedNFTs[mission.nftType] ? (
                                  <>
                                    <Award className="w-6 h-6 text-green-600 mb-1" />
                                    <span className="text-green-700 text-xs font-bold text-center leading-tight">
                                      {mission.title}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-gray-500 text-xs font-bold text-center leading-tight">
                                      Locked
                                    </span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-xs font-bold text-purple-700">
                              {Object.values(mintedNFTs).filter(Boolean).length}/3 Collected
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Community Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      Community Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs text-gray-600 text-center mb-2">
                      💡 Money-saving tips from students worldwide
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {COMMUNITY_POSTS.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-2 border-gray-200 bg-gray-50 rounded-xl p-3 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="text-2xl">{post.avatar}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-sm text-gray-800">{post.author}</p>
                                <span className="text-xs text-gray-500">{post.time}</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                <MapPin className="w-3 h-3 inline mr-1 text-blue-600" />
                                {post.city}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{post.tip}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                              <ThumbsUp className="w-3 h-3" />
                              {post.likes}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4">
              <span className="text-gray-600 text-xs font-semibold">🎮 XRP TESTNET • EDUCATIONAL USE ONLY</span>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <p className="text-sm font-bold text-gray-800 mb-3">💡 Study Abroad Financial Tips</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                <div className="text-center">
                  <p className="font-bold text-blue-600">🏦 Open Local Account</p>
                  <p>Save on international fees</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-purple-600">📱 Use Budget Apps</p>
                  <p>Track spending real-time</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-pink-600">🍜 Cook at Home</p>
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