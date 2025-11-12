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
          0%, 100% { text-shadow: 0 0 2px #00ffff, 0 0 4px #00ffff; }
          50% { text-shadow: 0 0 3px #00ffff, 0 0 6px #00ffff, 0 0 8px #ff00ff; }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(255, 0, 255, 0.5), inset 0 0 30px rgba(255, 0, 255, 0.1); }
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
          {/* Compact Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
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
            >
              CAMPUS<span className="text-pink-500">Fi</span>
            </motion.h1>
            
            {user && (
              <p className="text-cyan-400 font-bold text-sm">
                Welcome, <span className="text-pink-400">{user.full_name || 'Explorer'}</span>! 🚀
              </p>
            )}
          </motion.div>

          {/* Error Alert */}
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

          {/* Mission Progress - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50">
              <CardHeader className="p-3 border-b-2 border-cyan-500/30">
                <CardTitle className="flex items-center gap-2 text-sm text-cyan-400 font-black tracking-wide">
                  <Map className="w-4 h-4" />
                  MISSIONS: {missions.filter(m => m.completed).length}/4
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {missions.map((mission) => (
                    <div
                      key={mission.id}
                      className={`border-2 rounded-lg p-2 ${
                        mission.completed 
                          ? 'border-cyan-400 bg-cyan-900/30' 
                          : 'border-gray-700 bg-gray-900/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <mission.icon className={`w-4 h-4 ${
                          mission.completed ? 'text-cyan-400' : 'text-gray-600'
                        }`} />
                        {mission.completed ? (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Lock className="w-3 h-3 text-gray-600" />
                        )}
                      </div>
                      <h3 className={`font-black text-xs ${
                        mission.completed ? 'text-cyan-400' : 'text-gray-500'
                      }`}>
                        {mission.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* City Selector - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50">
              <CardContent className="p-3">
                <Label className="text-purple-400 font-bold text-xs mb-2">STUDY CITY</Label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger className="border-2 border-purple-500/50 bg-black/50 text-purple-100 h-10 font-bold text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-2 border-purple-500">
                    {Object.entries(CITY_COSTS).map(([key, data]) => (
                      <SelectItem key={key} value={key} className="text-purple-100 font-bold text-sm">
                        {data.flag} {data.name} (€{data.avgCost}/mo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabbed Content - Main Innovation for Reduced Scrolling */}
          <Tabs defaultValue="budget" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-900/50 border-2 border-cyan-500/30 mb-4">
              <TabsTrigger value="budget" className="text-xs font-bold data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Coins className="w-3 h-3 mr-1" />
                Budget
              </TabsTrigger>
              <TabsTrigger value="convert" className="text-xs font-bold data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Globe className="w-3 h-3 mr-1" />
                Convert
              </TabsTrigger>
              <TabsTrigger value="map" className="text-xs font-bold data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Map className="w-3 h-3 mr-1" />
                Map
              </TabsTrigger>
              <TabsTrigger value="goals" className="text-xs font-bold data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                <Target className="w-3 h-3 mr-1" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="wallet" className="text-xs font-bold data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
                <Wallet className="w-3 h-3 mr-1" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="xrpl" className="text-xs font-bold data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <Send className="w-3 h-3 mr-1" />
                XRPL
              </TabsTrigger>
            </TabsList>

            {/* Budget Tab */}
            <TabsContent value="budget">
              <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50">
                <CardHeader className="p-3 border-b-2 border-cyan-500/30">
                  <CardTitle className="flex items-center gap-2 text-base text-cyan-400 font-black">
                    <Coins className="w-5 h-5" />
                    MISSION 1: BUDGET
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-cyan-400 font-bold text-xs mb-1">INCOME (€)</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 1000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="border-2 border-cyan-500/50 bg-black/50 text-cyan-100 h-10 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-pink-400 font-bold text-xs mb-1">EXPENSES (€)</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 800"
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                        className="border-2 border-pink-500/50 bg-black/50 text-pink-100 h-10 text-sm font-bold"
                      />
                    </div>
                  </div>

                  {income && expenses && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-cyan-400">
                        <span>USAGE</span>
                        <span>{getSpendingPercentage().toFixed(0)}%</span>
                      </div>
                      <div className="relative h-6 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-500/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getSpendingPercentage()}%` }}
                          className={`h-full bg-gradient-to-r ${getProgressColor(getSpendingPercentage())}`}
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={calculateBalance}
                    className="w-full h-10 text-sm font-black bg-gradient-to-r from-cyan-500 to-purple-600"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    CALCULATE ⚡
                  </Button>

                  {balance !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`border-2 rounded-xl p-4 ${
                        balance > 0 ? 'border-cyan-400 bg-cyan-900/30' : 'border-red-400 bg-red-900/30'
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-300 mb-2">MONTHLY SAVINGS</p>
                      <div className={`text-3xl font-black text-center mb-2 ${
                        balance > 0 ? 'text-cyan-400' : 'text-red-400'
                      }`}>
                        €{Math.abs(balance).toFixed(2)}
                      </div>
                      {balance > 50 && (
                        <div className="text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border-2 border-yellow-500 rounded-full text-yellow-400 text-xs font-black">
                            <Trophy className="w-3 h-3" />
                            COMPLETE! ⚡
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Convert Tab */}
            <TabsContent value="convert">
              <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50">
                <CardHeader className="p-3 border-b-2 border-purple-500/30">
                  <CardTitle className="flex items-center gap-2 text-base text-purple-400 font-black">
                    <Globe className="w-5 h-5" />
                    MISSION 2: CONVERTER
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <p className="text-xs text-gray-400 text-center font-bold bg-purple-900/20 border border-purple-500/30 rounded-lg p-2">
                    🌍 LIVE RATES API
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-purple-400 font-bold text-xs mb-1">HOME CURRENCY</Label>
                      <Select value={localCurrency} onValueChange={setLocalCurrency}>
                        <SelectTrigger className="border-2 border-purple-500/50 bg-black/50 text-purple-100 h-10 font-bold text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-2 border-purple-500">
                          {Object.entries(CURRENCY_RATES)
                            .filter(([code]) => code !== 'EUR')
                            .map(([code, data]) => (
                              <SelectItem key={code} value={code} className="text-purple-100 font-bold text-sm">
                                {data.flag} {code}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-pink-400 font-bold text-xs mb-1">AMOUNT</Label>
                      <Input
                        type="number"
                        placeholder={localCurrency === 'MGA' ? '100000' : '1000'}
                        value={localAmount}
                        onChange={(e) => setLocalAmount(e.target.value)}
                        className="border-2 border-pink-500/50 bg-black/50 text-pink-100 h-10 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={fetchRealExchangeRate}
                    disabled={isLoadingRate || !localAmount}
                    className="w-full h-10 text-sm font-black bg-gradient-to-r from-purple-500 to-pink-600"
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
                        <Plane className="w-4 h-4 mr-2" />
                        CONVERT → EUR ⚡
                      </>
                    )}
                  </Button>

                  {convertedEuro !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-2 border-purple-400 bg-purple-900/30 rounded-xl p-4"
                    >
                      <p className="text-xs font-bold text-purple-400 mb-2">RESULT</p>
                      <p className="text-3xl font-black text-purple-400 mb-2">
                        €{convertedEuro.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-300 font-bold mb-2">
                        {CURRENCY_RATES[localCurrency].symbol}{localAmount} {localCurrency} = €{convertedEuro.toFixed(2)}
                      </p>
                      {realExchangeRate && (
                        <p className="text-xs text-cyan-400 font-bold mb-2">
                          Rate: 1 {localCurrency} = €{realExchangeRate.toFixed(6)}
                        </p>
                      )}
                      <div className="bg-cyan-900/20 border border-cyan-500/50 rounded-lg p-2">
                        <p className="text-xs text-gray-300">
                          In {cityData.name}: <strong className="text-cyan-400">€{convertedEuro.toFixed(0)}</strong>
                          {convertedEuro >= cityData.avgCost ? 
                            ` (${((convertedEuro / cityData.avgCost) * 100).toFixed(0)}% of avg cost!)` :
                            ` (need €${(cityData.avgCost - convertedEuro).toFixed(0)} more)`
                          }
                        </p>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-xs font-black">
                          COMPLETE! ⚡
                        </span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map">
              {converterUsed ? (
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50">
                  <CardHeader className="p-3 border-b-2 border-cyan-500/30">
                    <CardTitle className="flex items-center gap-2 text-base text-cyan-400 font-black">
                      <Map className="w-5 h-5" />
                      {cityData.name.toUpperCase()} {cityData.flag}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className="px-2 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full flex items-center gap-1">
                        <Coffee className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-bold">MEALS</span>
                      </div>
                      <div className="px-2 py-1 bg-blue-500/20 border border-blue-500 rounded-full flex items-center gap-1">
                        <HomeIcon className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400 text-xs font-bold">HOUSING</span>
                      </div>
                      <div className="px-2 py-1 bg-green-500/20 border border-green-500 rounded-full flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-green-400" />
                        <span className="text-green-400 text-xs font-bold">STUDY</span>
                      </div>
                    </div>

                    <div className="h-64 rounded-xl overflow-hidden border-2 border-cyan-500/30">
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
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {cityData.spots.map((spot) => (
                        <div key={spot.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-2 hover:border-cyan-400 transition-all">
                          <p className="text-cyan-400 font-bold text-xs mb-1">{getMarkerIcon(spot.category)} {spot.name}</p>
                          <p className="text-xs text-gray-400">{spot.description}</p>
                          <p className="text-xs text-green-400 font-bold mt-1">💰 {spot.price}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 font-bold">Complete Mission 2 to unlock the map!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals">
              <Card className="bg-black/40 backdrop-blur-sm border-2 border-pink-500/50">
                <CardHeader className="p-3 border-b-2 border-pink-500/30">
                  <CardTitle className="flex items-center gap-2 text-base text-pink-400 font-black">
                    <Target className="w-5 h-5" />
                    MISSION 3: GOALS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {goals.map((goal, index) => (
                    <div key={index}>
                      <Label className="text-pink-400 font-bold text-xs mb-1">GOAL {index + 1}</Label>
                      <Input
                        placeholder={`e.g., ${['Save €100', 'Cut costs 20%', 'Find job'][index]}`}
                        value={goal}
                        onChange={(e) => {
                          const newGoals = [...goals];
                          newGoals[index] = e.target.value;
                          setGoals(newGoals);
                        }}
                        className="border-2 border-pink-500/50 bg-black/50 text-pink-100 h-10 text-sm font-bold"
                        disabled={goalsSet}
                      />
                    </div>
                  ))}
                  
                  {!goalsSet ? (
                    <Button 
                      onClick={handleSetGoals}
                      className="w-full h-10 text-sm font-black bg-gradient-to-r from-pink-500 to-orange-600"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      LOCK GOALS ⚡
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border-2 border-pink-400 bg-pink-900/30 rounded-xl p-4 text-center"
                    >
                      <p className="text-2xl mb-2">🎯</p>
                      <p className="text-pink-400 font-black text-sm mb-2">GOALS ACTIVATED!</p>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-xs font-black">
                        COMPLETE! ⚡
                      </span>
                    </motion.div>
                  )}

                  <div className="border-2 border-purple-400 bg-purple-900/20 rounded-xl p-3 mt-4">
                    <h3 className="text-xs font-black text-purple-400 mb-2 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      COMMUNITY TIPS
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {COMMUNITY_POSTS.map((post) => (
                        <div key={post.id} className="border border-gray-700 bg-gray-900/50 rounded-lg p-2 hover:border-cyan-400 transition-all">
                          <div className="flex items-start gap-2 mb-1">
                            <div className="text-lg">{post.avatar}</div>
                            <div className="flex-1">
                              <p className="font-black text-xs text-cyan-400">{post.author}</p>
                              <p className="text-xs text-gray-400">{post.city}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-300 mb-1">{post.tip}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <ThumbsUp className="w-3 h-3" />
                            {post.likes}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet">
              <Card className="bg-black/40 backdrop-blur-sm border-2 border-yellow-500/50">
                <CardHeader className="p-3 border-b-2 border-yellow-500/30">
                  <CardTitle className="flex items-center gap-2 text-base text-yellow-400 font-black">
                    <Wallet className="w-5 h-5" />
                    NFT PASSPORT
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {!walletAddress ? (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center border-4 border-yellow-400">
                        <BadgeCheck className="w-8 h-8 text-black" />
                      </div>
                      
                      <div>
                        <p className="font-black text-sm text-yellow-400 mb-1">🌟 DIGITAL PASSPORT</p>
                        <p className="text-xs text-gray-400 font-bold">Generate wallet to collect NFT badges</p>
                      </div>

                      <Button
                        onClick={generateWallet}
                        disabled={isConnecting || !xrplLoaded}
                        className="w-full h-10 text-sm font-black bg-gradient-to-r from-yellow-500 to-orange-600"
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
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border-2 border-green-400 bg-green-900/30 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-green-400">ACTIVE</span>
                          <span className="text-xs font-black text-green-400">● VERIFIED</span>
                        </div>
                        <div className="bg-black/70 p-2 rounded border border-green-500/50 mb-2">
                          <p className="text-xs text-green-400 mb-1 font-bold">ADDRESS</p>
                          <p className="text-green-300 font-mono text-xs break-all">{walletAddress}</p>
                        </div>
                        {walletSeed && (
                          <div className="bg-black/70 p-2 rounded border border-yellow-500/50">
                            <p className="text-xs text-yellow-400 mb-1 font-bold">🔑 SECRET (KEEP SAFE!)</p>
                            <p className="text-yellow-300 font-mono text-xs break-all">{walletSeed}</p>
                          </div>
                        )}
                      </div>

                      <div className="border-2 border-purple-400 bg-purple-900/30 rounded-xl p-3">
                        <h3 className="text-xs font-black text-purple-400 mb-2">BADGE COLLECTION</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {missions.map((mission) => (
                            <div
                              key={mission.id}
                              className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 ${
                                mintedNFTs[mission.nftType]
                                  ? 'border-cyan-400 bg-cyan-900/30'
                                  : 'border-gray-700 bg-gray-900/30'
                              }`}
                            >
                              {mintedNFTs[mission.nftType] ? (
                                <>
                                  <Award className="w-6 h-6 text-cyan-400 mb-1" />
                                  <span className="text-cyan-400 text-xs font-black">L{mission.mission}</span>
                                </>
                              ) : mission.completed ? (
                                <>
                                  <mission.icon className="w-6 h-6 text-gray-500 mb-1" />
                                  <Button
                                    onClick={() => mintNFT(mission.nftType)}
                                    disabled={currentlyMinting === mission.nftType}
                                    className="w-full mt-1 h-6 text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600"
                                  >
                                    {currentlyMinting === mission.nftType ? '...' : 'CLAIM'}
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-6 h-6 text-gray-600 mb-1" />
                                  <span className="text-gray-600 text-xs font-bold">Locked</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-xs font-black text-purple-400">
                            {Object.values(mintedNFTs).filter(Boolean).length}/4 COLLECTED ⚡
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* XRPL Tab */}
            <TabsContent value="xrpl">
              {walletAddress && converterUsed ? (
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-yellow-500/50">
                  <CardHeader className="p-3 border-b-2 border-yellow-500/30">
                    <CardTitle className="flex items-center gap-2 text-base text-yellow-400 font-black">
                      <Send className="w-5 h-5" />
                      MISSION 4: XRPL PAYMENT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3">
                      <p className="text-yellow-400 text-xs font-bold mb-2">
                        SIMULATE CROSS-BORDER PAYMENT
                      </p>
                      <p className="text-gray-300 text-xs mb-2">
                        Experience blockchain payments! Send 1 XRP to demo international transfers.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-black/50 p-2 rounded">
                          <p className="text-gray-400 mb-1">FROM</p>
                          <p className="text-cyan-400 font-bold">{localCurrency} {CURRENCY_RATES[localCurrency].flag}</p>
                        </div>
                        <div className="bg-black/50 p-2 rounded">
                          <p className="text-gray-400 mb-1">TO</p>
                          <p className="text-purple-400 font-bold">EUR 🇪🇺</p>
                        </div>
                      </div>
                    </div>

                    {!xrplTransactionDone ? (
                      <Button 
                        onClick={simulateXRPLTransaction}
                        disabled={isSimulatingTx}
                        className="w-full h-10 text-sm font-black bg-gradient-to-r from-yellow-500 to-orange-600"
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
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border-2 border-green-400 bg-green-900/30 rounded-xl p-4"
                      >
                        <div className="text-center mb-2">
                          <div className="text-4xl mb-2">✅</div>
                          <p className="text-green-400 font-black text-sm mb-2">SUCCESS!</p>
                          <p className="text-xs text-gray-300 mb-2">
                            Payment processed on XRPL Testnet
                          </p>
                        </div>
                        
                        {txHash && (
                          <div className="bg-black/50 p-2 rounded border border-green-500/50 mb-2">
                            <p className="text-xs text-green-400 mb-1 font-bold">TX HASH</p>
                            <p className="text-green-300 font-mono text-xs break-all">{txHash}</p>
                          </div>
                        )}

                        <div className="text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-xs font-black">
                            COMPLETE! ⚡
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <p className="text-xs text-center text-gray-500 font-bold">
                      🎮 TESTNET ONLY • EDUCATIONAL
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 font-bold mb-2">Complete Mission 2 and create wallet first!</p>
                    <p className="text-xs text-gray-600">You need to convert currency and have a wallet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full">
              <span className="text-cyan-400 text-xs font-black">🎮 XRP TESTNET • EDU USE ⚡</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}