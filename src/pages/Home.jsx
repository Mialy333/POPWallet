
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, TrendingUp, Award, Sparkles, Euro, Zap, Trophy, Star, Coins, Globe, Target, CheckCircle2, Lock, Plane, Map, MapPin, GraduationCap, Briefcase, BadgeCheck, MessageCircle, ThumbsUp, MapPinned, Lightbulb, TrendingDown, AlertCircle, Send, Landmark, Coffee, Home as HomeIcon, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { base44 } from '@/api/base44Client';

// Fix Leaflet default icon issue
if (typeof window !== 'undefined') {
  delete window.L?.Icon?.Default?.prototype._getIconUrl;
  if (window.L?.Icon?.Default) {
    window.L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }
}

const CURRENCY_RATES = {
  EUR: { symbol: '€', rate: 1, name: 'Euro', flag: '🇪🇺', country: 'Europe' },
  USD: { symbol: '$', rate: 1.09, name: 'US Dollar', flag: '🇺🇸', country: 'USA' },
  GBP: { symbol: '£', rate: 0.86, name: 'British Pound', flag: '🇬🇧', country: 'UK' },
  INR: { symbol: '₹', rate: 90.5, name: 'Indian Rupee', flag: '🇮🇳', country: 'India' },
  CNY: { symbol: '¥', rate: 7.85, name: 'Chinese Yuan', flag: '🇨🇳', country: 'China' },
  JPY: { symbol: '¥', rate: 161.2, name: 'Japanese Yen', flag: '🇯🇵', country: 'Japan' },
  BRL: { symbol: 'R$', rate: 5.42, name: 'Brazilian Real', flag: '🇧🇷', country: 'Brazil' },
  NGN: { symbol: '₦', rate: 870, name: 'Nigerian Naira', flag: '🇳🇬', country: 'Nigeria' },
  MGA: { symbol: 'Ar', rate: 5000, name: 'Malagasy Ariary', flag: '🇲🇬', country: 'Madagascar' }
};

const CITY_COSTS = {
  lisbon: { 
    name: 'Lisbon', 
    country: 'Portugal', 
    avgCost: 680, 
    flag: '🇵🇹',
    coords: [38.7223, -9.1393],
    spots: [
      { id: 1, name: 'Cantina Zé Avillez', category: 'meal', coords: [38.7071, -9.1366], price: '€8-12', description: 'Student-friendly restaurant' },
      { id: 2, name: 'Pingo Doce Market', category: 'meal', coords: [38.7205, -9.1480], price: '€5-8', description: 'Cheap groceries' },
      { id: 3, name: 'Student Residences Alfama', category: 'housing', coords: [38.7139, -9.1289], price: '€350/mo', description: 'Affordable student housing' },
      { id: 4, name: 'IST Library', category: 'study', coords: [38.7369, -9.1395], price: 'Free', description: 'University library' },
      { id: 5, name: 'Biblioteca Municipal', category: 'study', coords: [38.7166, -9.1421], price: 'Free', description: 'Public library with WiFi' }
    ]
  },
  paris: { 
    name: 'Paris', 
    country: 'France', 
    avgCost: 950, 
    flag: '🇫🇷',
    coords: [48.8566, 2.3522],
    spots: [
      { id: 1, name: 'CROUS Restaurant', category: 'meal', coords: [48.8462, 2.3372], price: '€3.30', description: 'University canteen' },
      { id: 2, name: 'Marché Belleville', category: 'meal', coords: [48.8720, 2.3776], price: '€5-10', description: 'Cheap market food' },
      { id: 3, name: 'Cité Universitaire', category: 'housing', coords: [48.8205, 2.3379], price: '€500/mo', description: 'Student housing' },
      { id: 4, name: 'BNF François Mitterrand', category: 'study', coords: [48.8337, 2.3757], price: 'Free', description: 'National library' },
      { id: 5, name: 'Café Study Spot', category: 'study', coords: [48.8529, 2.3499], price: '€2 coffee', description: 'Student café' }
    ]
  },
  madrid: { 
    name: 'Madrid', 
    country: 'Spain', 
    avgCost: 720, 
    flag: '🇪🇸',
    coords: [40.4168, -3.7038],
    spots: [
      { id: 1, name: 'Menú del Día - La Latina', category: 'meal', coords: [40.4086, -3.7081], price: '€10-12', description: '3-course meal' },
      { id: 2, name: 'Mercado de San Miguel', category: 'meal', coords: [40.4155, -3.7087], price: '€6-10', description: 'Tapas market' },
      { id: 3, name: 'Residencia Erasmus', category: 'housing', coords: [40.4297, -3.6918], price: '€400/mo', description: 'Student residence' },
      { id: 4, name: 'Biblioteca Nacional', category: 'study', coords: [40.4238, -3.6892], price: 'Free', description: 'National library' },
      { id: 5, name: 'UCM Study Rooms', category: 'study', coords: [40.4469, -3.7282], price: 'Free', description: 'University study space' }
    ]
  }
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
  }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [balance, setBalance] = useState(null);
  
  const [selectedCity, setSelectedCity] = useState('lisbon');
  
  const [localCurrency, setLocalCurrency] = useState('MGA');
  const [localAmount, setLocalAmount] = useState('');
  const [convertedEuro, setConvertedEuro] = useState(null);
  const [realExchangeRate, setRealExchangeRate] = useState(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [converterUsed, setConverterUsed] = useState(false);
  
  const [goals, setGoals] = useState(['', '', '']);
  const [goalsSet, setGoalsSet] = useState(false);
  
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletSeed, setWalletSeed] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [xrplTransactionDone, setXrplTransactionDone] = useState(false);
  const [isSimulatingTx, setIsSimulatingTx] = useState(false);
  const [txHash, setTxHash] = useState(null);
  
  const [mintedNFTs, setMintedNFTs] = useState({
    smartSaver: false,
    explorer: false,
    planner: false,
    budgetExplorer: false
  });
  const [currentlyMinting, setCurrentlyMinting] = useState(null);
  
  const [error, setError] = useState(null);
  const [xrplLoaded, setXrplLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoadingUser(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      if (currentUser.monthly_income) setIncome(currentUser.monthly_income.toString());
      if (currentUser.monthly_expenses) setExpenses(currentUser.monthly_expenses.toString());
      if (currentUser.monthly_balance !== undefined) setBalance(currentUser.monthly_balance);
      
      if (currentUser.goals && currentUser.goals.length > 0) {
        setGoals(currentUser.goals);
        if (currentUser.goals.filter(g => g.trim() !== '').length >= 3) {
          setGoalsSet(true);
        }
      } else {
        setGoals(['', '', '']);
      }
      if (currentUser.goals_completed) setGoalsSet(true);

      if (currentUser.xrpl_wallet_address) setWalletAddress(currentUser.xrpl_wallet_address);
      
      if (currentUser.mission_explorer) {
        setConverterUsed(true);
      }
      if (currentUser.mission_xrpl) setXrplTransactionDone(true);
      
      setMintedNFTs({
        smartSaver: currentUser.nft_smart_saver || false,
        explorer: currentUser.nft_explorer || false,
        planner: currentUser.nft_planner || false,
        budgetExplorer: currentUser.nft_budget_explorer || false
      });
      
      if (currentUser.selected_city && CITY_COSTS[currentUser.selected_city]) setSelectedCity(currentUser.selected_city);
      if (currentUser.local_currency) setLocalCurrency(currentUser.local_currency);
      
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const saveUserData = async (data) => {
    if (!user) {
      console.warn("User not logged in, data will not be saved.");
      return;
    }
    try {
      await base44.auth.updateMe(data);
      setUser(prevUser => ({ ...prevUser, ...data }));
    } catch (err) {
      console.error('Error saving user data:', err);
      setError('Failed to save data. Please try again.');
    }
  };

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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const calculateBalance = async () => {
    const inc = parseFloat(income) || 0;
    const exp = parseFloat(expenses) || 0;
    const bal = inc - exp;
    setBalance(bal);
    setError(null);
    
    await saveUserData({
      monthly_income: inc,
      monthly_expenses: exp,
      monthly_balance: bal,
      mission_smart_saver: bal > 50
    });
    
    if (bal > 50) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const fetchRealExchangeRate = async () => {
    setIsLoadingRate(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.exchangerate.host/latest?base=${localCurrency}&symbols=EUR`);
      const data = await response.json();
      
      if (data.success && data.rates && data.rates.EUR) {
        const rate = data.rates.EUR;
        setRealExchangeRate(rate);
        
        const amount = parseFloat(localAmount) || 0;
        const converted = amount * rate;
        setConvertedEuro(converted);
        setConverterUsed(true);
        
        await saveUserData({
          local_currency: localCurrency,
          mission_explorer: true
        });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setError('Failed to fetch exchange rate. Using fallback rates.');
        const fallbackRate = 1 / (CURRENCY_RATES[localCurrency]?.rate || 1);
        setRealExchangeRate(fallbackRate);
        const amount = parseFloat(localAmount) || 0;
        setConvertedEuro(amount * fallbackRate);
        setConverterUsed(true);
        
        await saveUserData({
          local_currency: localCurrency,
          mission_explorer: true
        });
      }
    } catch (err) {
      console.error('Exchange rate API error:', err);
      setError('Network error. Using fallback rates.');
      const fallbackRate = 1 / (CURRENCY_RATES[localCurrency]?.rate || 1);
      setRealExchangeRate(fallbackRate);
      const amount = parseFloat(localAmount) || 0;
      setConvertedEuro(amount * fallbackRate);
      setConverterUsed(true);
      
      await saveUserData({
        local_currency: localCurrency,
        mission_explorer: true
      });
    } finally {
      setIsLoadingRate(false);
    }
  };

  const handleSetGoals = async () => {
    const filledGoals = goals.filter(g => g.trim() !== '');
    if (filledGoals.length >= 3) {
      setGoalsSet(true);
      
      await saveUserData({
        goals: goals,
        goals_completed: true,
        mission_planner: true
      });
      
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
      
      await saveUserData({
        xrpl_wallet_address: wallet.address
      });
      
    } catch (err) {
      setError('Failed to generate wallet: ' + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const simulateXRPLTransaction = async () => {
    if (!xrplLoaded || !window.xrpl) {
      setError('XRP Ledger library not loaded yet');
      return;
    }

    if (!walletSeed) {
      setError('Please generate a wallet first or ensure your session is active');
      return;
    }

    try {
      setIsSimulatingTx(true);
      setError(null);

      const client = new window.xrpl.Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      const wallet = window.xrpl.Wallet.fromSeed(walletSeed);
      
      try {
        await client.fundWallet(wallet);
      } catch (e) {
        console.log('Wallet funding skipped or already funded (Testnet only)');
      }

      const payment = {
        TransactionType: 'Payment',
        Account: wallet.address,
        Amount: window.xrpl.xrpToDrops('1'),
        Destination: 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY',
        Memos: [
          {
            Memo: {
              MemoType: window.xrpl.convertStringToHex('CampusFi'),
              MemoData: window.xrpl.convertStringToHex(`Cross-border payment simulation - ${localCurrency} to EUR`)
            }
          }
        ]
      };

      const prepared = await client.autofill(payment);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      if (result.result.meta.TransactionResult === 'tesSUCCESS') {
        setXrplTransactionDone(true);
        setTxHash(result.result.hash);
        
        await saveUserData({
          mission_xrpl: true
        });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setError('Transaction failed: ' + result.result.meta.TransactionResult);
      }

      await client.disconnect();
    } catch (err) {
      setError('Transaction error: ' + err.message);
      console.error(err);
    } finally {
      setIsSimulatingTx(false);
    }
  };

  const mintNFT = async (nftType) => {
    if (!xrplLoaded || !window.xrpl) {
      setError('XRP Ledger library not loaded yet');
      return;
    }

    if (!walletSeed) {
      setError('Please generate a wallet first or ensure your session is active');
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
        console.log('Wallet funding skipped or already funded (Testnet only)');
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
        },
        budgetExplorer: {
          name: '💎 Budget Explorer NFT',
          description: 'Achievement Unlocked: Completed cross-border payment simulation',
          level: 'LEVEL 4'
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
        
        const nftFieldMap = {
          smartSaver: 'nft_smart_saver',
          explorer: 'nft_explorer',
          planner: 'nft_planner',
          budgetExplorer: 'nft_budget_explorer'
        };
        
        await saveUserData({
          [nftFieldMap[nftType]]: true
        });
        
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

  const handleCityChange = async (city) => {
    setSelectedCity(city);
    await saveUserData({ selected_city: city });
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

  const getMarkerIcon = (category) => {
    const iconMap = {
      meal: '🍔',
      housing: '🏠',
      study: '🎓'
    };
    return iconMap[category] || '📍';
  };

  const missions = [
    {
      id: 'smartSaver',
      title: 'Smart Saver',
      description: 'Save at least €50',
      completed: balance !== null && balance > 50,
      icon: Trophy,
      color: 'cyan',
      nftType: 'smartSaver',
      mission: 1
    },
    {
      id: 'explorer',
      title: 'Currency Explorer',
      description: 'Convert your local currency',
      completed: converterUsed && convertedEuro !== null,
      icon: Globe,
      color: 'purple',
      nftType: 'explorer',
      mission: 2
    },
    {
      id: 'planner',
      title: 'Goal Planner',
      description: 'Set 3 monthly goals',
      completed: goalsSet,
      icon: Target,
      color: 'pink',
      nftType: 'planner',
      mission: 3
    },
    {
      id: 'budgetExplorer',
      title: 'XRPL Pioneer',
      description: 'Complete XRPL transaction',
      completed: xrplTransactionDone,
      icon: Send,
      color: 'yellow',
      nftType: 'budgetExplorer',
      mission: 4
    }
  ];

  const cityData = CITY_COSTS[selectedCity];

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Zap className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <p className="text-cyan-400 font-black text-xl tracking-wider">LOADING CAMPUSFI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Grid Background */}
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

      {/* Confetti Effect */}
      <AnimatePresence>
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
      </AnimatePresence>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
        @keyframes neon-glow {
          0%, 100% { text-shadow: 0 0 2px #00ffff, 0 0 4px #00ffff; }
          50% { text-shadow: 0 0 3px #00ffff, 0 0 6px #00ffff, 0 0 8px #ff00ff; }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(255, 0, 255, 0.5), inset 0 0 30px rgba(255, 0, 255, 0.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 12px;
          z-index: 1;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.8);
        }
      `}</style>

      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Animations */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-center mb-4"
          >
            <motion.h1 
              className="text-3xl md:text-5xl font-black mb-2 tracking-wider"
              style={{
                fontFamily: 'Arial Black, sans-serif',
                background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'neon-glow 2s ease-in-out infinite'
              }}
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              CAMPUS<span className="text-pink-500">Fi</span>
            </motion.h1>
            
            {user && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-cyan-400 font-bold text-sm"
              >
                Welcome, <span className="text-pink-400">{user.full_name || 'Explorer'}</span>! 
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block ml-1"
                >
                  🚀
                </motion.span>
              </motion.p>
            )}
          </motion.div>

          {/* Error Alert with Animation */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Alert className="bg-red-900/50 border-2 border-red-500">
                  <AlertDescription className="text-red-200 font-bold text-sm">
                    ⚠️ {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mission Progress - Animated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300">
              <CardHeader className="p-3 border-b-2 border-cyan-500/30">
                <CardTitle className="flex items-center gap-2 text-sm text-cyan-400 font-black tracking-wide">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Map className="w-4 h-4" />
                  </motion.div>
                  MISSIONS: {missions.filter(m => m.completed).length}/4
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {missions.map((mission, index) => (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className={`border-2 rounded-lg p-2 transition-all duration-300 ${
                        mission.completed 
                          ? 'border-cyan-400 bg-cyan-900/30' 
                          : 'border-gray-700 bg-gray-900/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <motion.div
                          animate={mission.completed ? { 
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={mission.completed ? { 
                            duration: 2, 
                            repeat: Infinity,
                            repeatDelay: 3 
                          } : {}}
                        >
                          <mission.icon className={`w-4 h-4 ${
                            mission.completed ? 'text-cyan-400' : 'text-gray-600'
                          }`} />
                        </motion.div>
                        {mission.completed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          </motion.div>
                        ) : (
                          <Lock className="w-3 h-3 text-gray-600" />
                        )}
                      </div>
                      <h3 className={`font-black text-xs ${
                        mission.completed ? 'text-cyan-400' : 'text-gray-500'
                      }`}>
                        {mission.title}
                      </h3>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* City Selector - Animated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300">
              <CardContent className="p-3">
                <Label className="text-purple-400 font-bold text-xs mb-2 flex items-center gap-1">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🏙️
                  </motion.span>
                  STUDY CITY
                </Label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger className="border-2 border-purple-500/50 bg-black/50 text-purple-100 h-10 font-bold text-sm hover:border-purple-400 focus:border-purple-400 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-2 border-purple-500">
                    {Object.entries(CITY_COSTS).map(([key, data]) => (
                      <SelectItem key={key} value={key} className="text-purple-100 font-bold text-sm">
                        <motion.span
                          whileHover={{ scale: 1.2 }}
                          className="inline-block"
                        >
                          {data.flag}
                        </motion.span> {data.name} (€{data.avgCost}/mo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabbed Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs defaultValue="budget" className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-900/50 border-2 border-cyan-500/30 mb-4">
                <TabsTrigger value="budget" className="text-xs font-bold data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 transition-all">
                  <Coins className="w-3 h-3 mr-1" />
                  Budget
                </TabsTrigger>
                <TabsTrigger value="convert" className="text-xs font-bold data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 transition-all">
                  <Globe className="w-3 h-3 mr-1" />
                  Convert
                </TabsTrigger>
                <TabsTrigger value="map" className="text-xs font-bold data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 transition-all">
                  <Map className="w-3 h-3 mr-1" />
                  Map
                </TabsTrigger>
                <TabsTrigger value="goals" className="text-xs font-bold data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400 transition-all">
                  <Target className="w-3 h-3 mr-1" />
                  Goals
                </TabsTrigger>
                <TabsTrigger value="wallet" className="text-xs font-bold data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 transition-all">
                  <Wallet className="w-3 h-3 mr-1" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="xrpl" className="text-xs font-bold data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 transition-all">
                  <Send className="w-3 h-3 mr-1" />
                  XRPL
                </TabsTrigger>
              </TabsList>

              {/* Budget Tab */}
              <TabsContent value="budget">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300">
                    <CardHeader className="p-3 border-b-2 border-cyan-500/30">
                      <CardTitle className="flex items-center gap-2 text-base text-cyan-400 font-black">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Coins className="w-5 h-5" />
                        </motion.div>
                        MISSION 1: BUDGET
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Label className="text-cyan-400 font-bold text-xs mb-1 flex items-center gap-1">
                            <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                              💰
                            </motion.span>
                            INCOME (€)
                          </Label>
                          <Input
                            type="number"
                            placeholder="e.g., 1000"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            className="border-2 border-cyan-500/50 bg-black/50 text-cyan-100 h-10 text-sm font-bold hover:border-cyan-400 focus:border-cyan-400 transition-all"
                          />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Label className="text-pink-400 font-bold text-xs mb-1 flex items-center gap-1">
                            <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>
                              📊
                            </motion.span>
                            EXPENSES (€)
                          </Label>
                          <Input
                            type="number"
                            placeholder="e.g., 800"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            className="border-2 border-pink-500/50 bg-black/50 text-pink-100 h-10 text-sm font-bold hover:border-pink-400 focus:border-pink-400 transition-all"
                          />
                        </motion.div>
                      </div>

                      {income && expenses && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between text-xs font-bold text-cyan-400">
                            <span>USAGE</span>
                            <motion.span
                              key={getSpendingPercentage()}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                            >
                              {getSpendingPercentage().toFixed(0)}%
                            </motion.span>
                          </div>
                          <div className="relative h-6 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-500/30">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${getSpendingPercentage()}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r ${getProgressColor(getSpendingPercentage())}`}
                            />
                          </div>
                        </motion.div>
                      )}

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={calculateBalance}
                          className="w-full h-10 text-sm font-black bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all"
                        >
                          <Trophy className="w-4 h-4 mr-2" />
                          CALCULATE ⚡
                        </Button>
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {balance !== null && (
                          <motion.div
                            key="balance-result"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={`border-2 rounded-xl p-4 ${
                              balance > 0 ? 'border-cyan-400 bg-cyan-900/30' : 'border-red-400 bg-red-900/30'
                            }`}
                          >
                            <p className="text-xs font-bold text-gray-300 mb-2">MONTHLY SAVINGS</p>
                            <motion.div 
                              className={`text-3xl font-black text-center mb-2 ${
                                balance > 0 ? 'text-cyan-400' : 'text-red-400'
                              }`}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              €{Math.abs(balance).toFixed(2)}
                            </motion.div>
                            {balance > 50 && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-center"
                              >
                                <motion.span 
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border-2 border-yellow-500 rounded-full text-yellow-400 text-xs font-black"
                                  animate={{ 
                                    boxShadow: [
                                      '0 0 0px rgba(234, 179, 8, 0.5)',
                                      '0 0 20px rgba(234, 179, 8, 0.8)',
                                      '0 0 0px rgba(234, 179, 8, 0.5)'
                                    ]
                                  }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  >
                                    <Trophy className="w-3 h-3" />
                                  </motion.div>
                                  COMPLETE! ⚡
                                </motion.span>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Convert Tab */}
              <TabsContent value="convert">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300">
                    <CardHeader className="p-3 border-b-2 border-purple-500/30">
                      <CardTitle className="flex items-center gap-2 text-base text-purple-400 font-black">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Globe className="w-5 h-5" />
                        </motion.div>
                        MISSION 2: CONVERTER
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-400 text-center font-bold bg-purple-900/20 border border-purple-500/30 rounded-lg p-2 flex items-center justify-center gap-2"
                      >
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          🌍
                        </motion.span>
                        LIVE RATES API
                      </motion.p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Label className="text-purple-400 font-bold text-xs mb-1">HOME CURRENCY</Label>
                          <Select value={localCurrency} onValueChange={setLocalCurrency}>
                            <SelectTrigger className="border-2 border-purple-500/50 bg-black/50 text-purple-100 h-10 font-bold text-sm hover:border-purple-400 focus:border-purple-400 transition-all">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-2 border-purple-500">
                              {Object.entries(CURRENCY_RATES)
                                .filter(([code]) => code !== 'EUR')
                                .map(([code, data]) => (
                                  <SelectItem key={code} value={code} className="text-purple-100 font-bold text-sm">
                                    {data.flag} {code} - {data.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Label className="text-pink-400 font-bold text-xs mb-1">AMOUNT</Label>
                          <Input
                            type="number"
                            placeholder={localCurrency === 'MGA' ? '100000' : '1000'}
                            value={localAmount}
                            onChange={(e) => setLocalAmount(e.target.value)}
                            className="border-2 border-pink-500/50 bg-black/50 text-pink-100 h-10 text-sm font-bold hover:border-pink-400 focus:border-pink-400 transition-all"
                          />
                        </motion.div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={fetchRealExchangeRate}
                          disabled={isLoadingRate || !localAmount}
                          className="w-full h-10 text-sm font-black bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
                        >
                          {isLoadingRate ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block mr-2"
                              >
                                <Zap className="w-4 h-4" />
                              </motion.div>
                              LOADING...
                            </>
                          ) : (
                            <>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <Plane className="w-4 h-4 mr-2" />
                              </motion.div>
                              CONVERT → EUR ⚡
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {convertedEuro !== null && (
                          <motion.div
                            key="conversion-result"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="border-2 border-purple-400 bg-purple-900/30 rounded-xl p-4"
                          >
                            <p className="text-xs font-bold text-purple-400 mb-2">RESULT</p>
                            <motion.p 
                              className="text-3xl font-black text-purple-400 mb-2"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 0.5 }}
                            >
                              <motion.span
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 0.5 }}
                                className="inline-block"
                              >
                                🇪🇺
                              </motion.span>
                              €{convertedEuro.toFixed(2)}
                            </motion.p>
                            <p className="text-xs text-gray-300 font-bold mb-2">
                              <motion.span
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="inline-block"
                              >
                                {CURRENCY_RATES[localCurrency].flag}
                              </motion.span>
                              {localAmount} {localCurrency} = €{convertedEuro.toFixed(2)}
                            </p>
                            {realExchangeRate && (
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-xs text-cyan-400 font-bold mb-2"
                              >
                                Rate: 1 {localCurrency} = €{realExchangeRate.toFixed(6)}
                              </motion.p>
                            )}
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="bg-cyan-900/20 border border-cyan-500/50 rounded-lg p-2"
                            >
                              <p className="text-xs text-gray-300">
                                In <motion.span
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                  className="inline-block"
                                >
                                  {cityData.flag}
                                </motion.span> {cityData.name}: <strong className="text-cyan-400">€{convertedEuro.toFixed(0)}</strong>
                                {convertedEuro >= cityData.avgCost ? 
                                  ` (${((convertedEuro / cityData.avgCost) * 100).toFixed(0)}% of avg cost!)` :
                                  ` (need €${(cityData.avgCost - convertedEuro).toFixed(0)} more)`
                                }
                              </p>
                            </motion.div>
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 }}
                              className="mt-2 text-center"
                            >
                              <motion.span 
                                className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-xs font-black"
                                animate={{ 
                                  boxShadow: [
                                    '0 0 0px rgba(234, 179, 8, 0.5)',
                                    '0 0 20px rgba(234, 179, 8, 0.8)',
                                    '0 0 0px rgba(234, 179, 8, 0.5)'
                                  ]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                COMPLETE! ⚡
                              </motion.span>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map">
                {converterUsed ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300">
                      <CardHeader className="p-3 border-b-2 border-cyan-500/30">
                        <CardTitle className="flex items-center gap-2 text-base text-cyan-400 font-black">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Map className="w-5 h-5" />
                          </motion.div>
                          {cityData.name.toUpperCase()} 
                          <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block"
                          >
                            {cityData.flag}
                          </motion.span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {[
                            { icon: Coffee, label: 'MEALS', color: 'yellow' },
                            { icon: HomeIcon, label: 'HOUSING', color: 'blue' },
                            { icon: BookOpen, label: 'STUDY', color: 'green' }
                          ].map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.1 }}
                              className={`px-2 py-1 bg-${item.color}-500/20 border border-${item.color}-500 rounded-full flex items-center gap-1 cursor-pointer`}
                            >
                              <item.icon className={`w-3 h-3 text-${item.color}-400`} />
                              <span className={`text-${item.color}-400 text-xs font-bold`}>{item.label}</span>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="h-64 rounded-xl overflow-hidden border-2 border-cyan-500/30"
                        >
                          {typeof window !== 'undefined' && (
                            <MapContainer
                              center={cityData.coords}
                              zoom={13}
                              style={{ height: '100%', width: '100%' }}
                              className="z-0"
                            >
                              <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              {cityData.spots.map((spot) => (
                                <Marker key={spot.id} position={spot.coords}>
                                  <Popup>
                                    <div className="font-bold text-xs">
                                      {getMarkerIcon(spot.category)} {spot.name}
                                    </div>
                                    <div className="text-xs text-gray-700">{spot.description}</div>
                                    <div className="text-xs font-bold text-green-600 mt-1">
                                      💰 {spot.price}
                                    </div>
                                  </Popup>
                                </Marker>
                              ))}
                            </MapContainer>
                          )}
                        </motion.div>

                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {cityData.spots.map((spot, index) => (
                            <motion.div 
                              key={spot.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="bg-gray-900/50 border border-gray-700 rounded-lg p-2 hover:border-cyan-400 transition-all cursor-pointer"
                            >
                              <p className="text-cyan-400 font-bold text-xs mb-1">
                                <motion.span
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                                  className="inline-block"
                                >
                                  {getMarkerIcon(spot.category)}
                                </motion.span> {spot.name}
                              </p>
                              <p className="text-xs text-gray-400">{spot.description}</p>
                              <p className="text-xs text-green-400 font-bold mt-1">💰 {spot.price}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="bg-black/40 backdrop-blur-sm border-2 border-gray-700">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        </motion.div>
                        <p className="text-gray-500 font-bold">Complete Mission 2 to unlock the map!</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>

              {/* Goals Tab */}
              <TabsContent value="goals">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-2 border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
                    <CardHeader className="p-3 border-b-2 border-pink-500/30">
                      <CardTitle className="flex items-center gap-2 text-base text-pink-400 font-black">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Target className="w-5 h-5" />
                        </motion.div>
                        MISSION 3: GOALS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {goals.map((goal, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Label className="text-pink-400 font-bold text-xs mb-1 flex items-center gap-1">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                            >
                              🎯
                            </motion.span>
                            GOAL {index + 1}
                          </Label>
                          <Input
                            placeholder={`e.g., ${['Save €100', 'Cut costs 20%', 'Find job'][index]}`}
                            value={goal}
                            onChange={(e) => {
                              const newGoals = [...goals];
                              newGoals[index] = e.target.value;
                              setGoals(newGoals);
                            }}
                            className="border-2 border-pink-500/50 bg-black/50 text-pink-100 h-10 text-sm font-bold hover:border-pink-400 focus:border-pink-400 transition-all"
                            disabled={goalsSet}
                          />
                        </motion.div>
                      ))}
                      
                      {!goalsSet ? (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            onClick={handleSetGoals}
                            className="w-full h-10 text-sm font-black bg-gradient-to-r from-pink-500 to-orange-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all"
                          >
                            <Target className="w-4 h-4 mr-2" />
                            LOCK GOALS ⚡
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="border-2 border-pink-400 bg-pink-900/30 rounded-xl p-4 text-center"
                        >
                          <motion.p 
                            className="text-2xl mb-2"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🎯
                          </motion.p>
                          <p className="text-pink-400 font-black text-sm mb-2">GOALS ACTIVATED!</p>
                          <motion.span 
                            className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-xs font-black"
                            animate={{ 
                              boxShadow: [
                                '0 0 0px rgba(234, 179, 8, 0.5)',
                                '0 0 20px rgba(234, 179, 8, 0.8)',
                                '0 0 0px rgba(234, 179, 8, 0.5)'
                              ]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            COMPLETE! ⚡
                          </motion.span>
                        </motion.div>
                      )}

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="border-2 border-purple-400 bg-purple-900/20 rounded-xl p-3 mt-4"
                      >
                        <h3 className="text-xs font-black text-purple-400 mb-2 flex items-center gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <MessageCircle className="w-3 h-3" />
                          </motion.div>
                          COMMUNITY TIPS
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {COMMUNITY_POSTS.map((post, index) => (
                            <motion.div 
                              key={post.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="border border-gray-700 bg-gray-900/50 rounded-lg p-2 hover:border-cyan-400 transition-all cursor-pointer"
                            >
                              <div className="flex items-start gap-2 mb-1">
                                <motion.div 
                                  className="text-lg"
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                >
                                  {post.avatar}
                                </motion.div>
                                <div className="flex-1">
                                  <p className="font-black text-xs text-cyan-400">{post.author}</p>
                                  <p className="text-xs text-gray-400">{post.city}</p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-300 mb-1">{post.tip}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <motion.div whileHover={{ scale: 1.3 }}>
                                  <ThumbsUp className="w-3 h-3" />
                                </motion.div>
                                {post.likes}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Wallet Tab */}
              <TabsContent value="wallet">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-2 border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300">
                    <CardHeader className="p-3 border-b-2 border-yellow-500/30">
                      <CardTitle className="flex items-center gap-2 text-base text-yellow-400 font-black">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Wallet className="w-5 h-5" />
                        </motion.div>
                        NFT PASSPORT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      {!walletAddress ? (
                        <div className="text-center space-y-3">
                          <motion.div 
                            className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center border-4 border-yellow-400"
                            animate={{ 
                              rotate: 360,
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                              scale: { duration: 2, repeat: Infinity }
                            }}
                          >
                            <BadgeCheck className="w-8 h-8 text-black" />
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <p className="font-black text-sm text-yellow-400 mb-1 flex items-center justify-center gap-1">
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                🌟
                              </motion.span>
                              DIGITAL PASSPORT
                            </p>
                            <p className="text-xs text-gray-400 font-bold">Generate wallet to collect NFT badges</p>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={generateWallet}
                              disabled={isConnecting || !xrplLoaded}
                              className="w-full h-10 text-sm font-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all"
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
                                  CREATING...
                                </>
                              ) : (
                                <>
                                  <BadgeCheck className="w-4 h-4 mr-2" />
                                  CREATE PASSPORT ⚡
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="border-2 border-green-400 bg-green-900/30 rounded-xl p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <motion.span 
                                className="text-xs font-black text-green-400"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                ACTIVE
                              </motion.span>
                              <motion.span 
                                className="text-xs font-black text-green-400 flex items-center gap-1"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                ● VERIFIED
                              </motion.span>
                            </div>
                            <div className="bg-black/70 p-2 rounded border border-green-500/50 mb-2">
                              <p className="text-xs text-green-400 mb-1 font-bold">ADDRESS</p>
                              <p className="text-green-300 font-mono text-xs break-all">{walletAddress}</p>
                            </div>
                            {walletSeed && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-black/70 p-2 rounded border border-yellow-500/50"
                              >
                                <p className="text-xs text-yellow-400 mb-1 font-bold flex items-center gap-1">
                                  <motion.span
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    🔑
                                  </motion.span>
                                  SECRET (KEEP SAFE!)
                                </p>
                                <p className="text-yellow-300 font-mono text-xs break-all">{walletSeed}</p>
                              </motion.div>
                            )}
                          </motion.div>

                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="border-2 border-purple-400 bg-purple-900/30 rounded-xl p-3"
                          >
                            <h3 className="text-xs font-black text-purple-400 mb-2 flex items-center gap-1">
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              >
                                🏆
                              </motion.span>
                              BADGE COLLECTION
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {missions.map((mission, index) => (
                                <motion.div
                                  key={mission.id}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  whileHover={{ scale: 1.05 }}
                                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 transition-all ${
                                    mintedNFTs[mission.nftType]
                                      ? 'border-cyan-400 bg-cyan-900/30'
                                      : 'border-gray-700 bg-gray-900/30'
                                  }`}
                                >
                                  {mintedNFTs[mission.nftType] ? (
                                    <>
                                      <motion.div
                                        animate={{ 
                                          rotate: 360,
                                          scale: [1, 1.2, 1]
                                        }}
                                        transition={{ 
                                          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                          scale: { duration: 1.5, repeat: Infinity }
                                        }}
                                      >
                                        <Award className="w-6 h-6 text-cyan-400 mb-1" />
                                      </motion.div>
                                      <span className="text-cyan-400 text-xs font-black">L{mission.mission}</span>
                                    </>
                                  ) : mission.completed ? (
                                    <>
                                      <mission.icon className="w-6 h-6 text-gray-500 mb-1" />
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button
                                          onClick={() => mintNFT(mission.nftType)}
                                          disabled={currentlyMinting === mission.nftType}
                                          className="w-full mt-1 h-6 text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600"
                                        >
                                          {currentlyMinting === mission.nftType ? (
                                            <motion.div
                                              animate={{ rotate: 360 }}
                                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                              <Zap className="w-3 h-3" />
                                            </motion.div>
                                          ) : 'CLAIM'}
                                        </Button>
                                      </motion.div>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-6 h-6 text-gray-600 mb-1" />
                                      <span className="text-gray-600 text-xs font-bold">Locked</span>
                                    </>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                            <div className="text-center mt-2">
                              <motion.span 
                                className="text-xs font-black text-purple-400"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {Object.values(mintedNFTs).filter(Boolean).length}/4 COLLECTED ⚡
                              </motion.span>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* XRPL Tab */}
              <TabsContent value="xrpl">
                {walletAddress && converterUsed ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="bg-black/40 backdrop-blur-sm border-2 border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300">
                      <CardHeader className="p-3 border-b-2 border-yellow-500/30">
                        <CardTitle className="flex items-center gap-2 text-base text-yellow-400 font-black">
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Send className="w-5 h-5" />
                          </motion.div>
                          MISSION 4: XRPL PAYMENT
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3"
                        >
                          <p className="text-yellow-400 text-xs font-bold mb-2 flex items-center gap-1">
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              ⚡
                            </motion.span>
                            SIMULATE CROSS-BORDER PAYMENT
                          </p>
                          <p className="text-gray-300 text-xs mb-2">
                            Experience blockchain payments! Send 1 XRP to demo international transfers.
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className="bg-black/50 p-2 rounded"
                            >
                              <p className="text-gray-400 mb-1">FROM</p>
                              <p className="text-cyan-400 font-bold flex items-center gap-1">
                                {localCurrency} 
                                <motion.span
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {CURRENCY_RATES[localCurrency].flag}
                                </motion.span>
                              </p>
                            </motion.div>
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className="bg-black/50 p-2 rounded"
                            >
                              <p className="text-gray-400 mb-1">TO</p>
                              <p className="text-purple-400 font-bold flex items-center gap-1">
                                EUR 
                                <motion.span
                                  animate={{ rotate: [0, -10, 10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  🇪🇺
                                </motion.span>
                              </p>
                            </motion.div>
                          </div>
                        </motion.div>

                        {!xrplTransactionDone ? (
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              onClick={simulateXRPLTransaction}
                              disabled={isSimulatingTx}
                              className="w-full h-10 text-sm font-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all"
                            >
                              {isSimulatingTx ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="inline-block mr-2"
                                  >
                                    <Zap className="w-4 h-4" />
                                  </motion.div>
                                  SIMULATING...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  SIMULATE PAYMENT ⚡
                                </>
                              )}
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="border-2 border-green-400 bg-green-900/30 rounded-xl p-4"
                          >
                            <div className="text-center mb-2">
                              <motion.div 
                                className="text-4xl mb-2"
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                                transition={{ duration: 1 }}
                              >
                                ✅
                              </motion.div>
                              <p className="text-green-400 font-black text-sm mb-2">SUCCESS!</p>
                              <p className="text-xs text-gray-300 mb-2">
                                Payment processed on XRPL Testnet
                              </p>
                            </div>
                            
                            {txHash && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-black/50 p-2 rounded border border-green-500/50 mb-2"
                              >
                                <p className="text-xs text-green-400 mb-1 font-bold">TX HASH</p>
                                <p className="text-green-300 font-mono text-xs break-all">{txHash}</p>
                              </motion.div>
                            )}

                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-center"
                            >
                              <motion.span 
                                className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-xs font-black"
                                animate={{ 
                                  boxShadow: [
                                    '0 0 0px rgba(234, 179, 8, 0.5)',
                                    '0 0 20px rgba(234, 179, 8, 0.8)',
                                    '0 0 0px rgba(234, 179, 8, 0.5)'
                                  ]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                COMPLETE! ⚡
                              </motion.span>
                            </motion.div>
                          </motion.div>
                        )}

                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-xs text-center text-gray-500 font-bold flex items-center justify-center gap-1"
                        >
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            🎮
                          </motion.span>
                          TESTNET ONLY • EDUCATIONAL
                        </motion.p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full"
              animate={{ 
                boxShadow: [
                  '0 0 0px rgba(0, 255, 255, 0.5)',
                  '0 0 15px rgba(0, 255, 255, 0.8)',
                  '0 0 0px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="text-cyan-400 text-xs font-black"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎮 XRP TESTNET • EDU USE ⚡
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
