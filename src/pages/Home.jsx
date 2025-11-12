import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Globe, Target, Send, Wallet, Trophy, Map } from "lucide-react";
import { base44 } from '@/api/base44Client';

import MissionProgress from '../components/missions/MissionProgress';
import CitySelector from '../components/missions/CitySelector';
import BudgetMission from '../components/missions/BudgetMission';
import CurrencyConverter from '../components/missions/CurrencyConverter';
import MapExplorer from '../components/missions/MapExplorer';
import GoalsPlanner from '../components/missions/GoalsPlanner';
import WalletPassport from '../components/missions/WalletPassport';
import XRPLPayment from '../components/missions/XRPLPayment';

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

          <MissionProgress missions={missions} />
          
          <CitySelector 
            selectedCity={selectedCity} 
            onCityChange={handleCityChange} 
            cities={CITY_COSTS} 
          />

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

              <TabsContent value="budget">
                <BudgetMission
                  income={income}
                  setIncome={setIncome}
                  expenses={expenses}
                  setExpenses={setExpenses}
                  balance={balance}
                  onCalculate={calculateBalance}
                />
              </TabsContent>

              <TabsContent value="convert">
                <CurrencyConverter
                  localCurrency={localCurrency}
                  setLocalCurrency={setLocalCurrency}
                  localAmount={localAmount}
                  setLocalAmount={setLocalAmount}
                  convertedEuro={convertedEuro}
                  realExchangeRate={realExchangeRate}
                  isLoadingRate={isLoadingRate}
                  onConvert={fetchRealExchangeRate}
                  cityData={cityData}
                />
              </TabsContent>

              <TabsContent value="map">
                <MapExplorer converterUsed={converterUsed} cityData={cityData} />
              </TabsContent>

              <TabsContent value="goals">
                <GoalsPlanner
                  goals={goals}
                  setGoals={setGoals}
                  goalsSet={goalsSet}
                  onSetGoals={handleSetGoals}
                />
              </TabsContent>

              <TabsContent value="wallet">
                <WalletPassport
                  walletAddress={walletAddress}
                  walletSeed={walletSeed}
                  isConnecting={isConnecting}
                  xrplLoaded={xrplLoaded}
                  missions={missions}
                  mintedNFTs={mintedNFTs}
                  currentlyMinting={currentlyMinting}
                  onGenerateWallet={generateWallet}
                  onMintNFT={mintNFT}
                />
              </TabsContent>

              <TabsContent value="xrpl">
                <XRPLPayment
                  walletAddress={walletAddress}
                  converterUsed={converterUsed}
                  localCurrency={localCurrency}
                  currencyFlag={CURRENCY_RATES[localCurrency]?.flag}
                  xrplTransactionDone={xrplTransactionDone}
                  isSimulatingTx={isSimulatingTx}
                  txHash={txHash}
                  onSimulateTransaction={simulateXRPLTransaction}
                />
              </TabsContent>
            </Tabs>
          </motion.div>

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