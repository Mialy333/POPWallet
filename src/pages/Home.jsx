
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, TrendingUp, Award, Sparkles, Euro, Zap, Trophy, Star, Coins, Globe, Target, CheckCircle2, Lock, Plane, Map, MapPin, GraduationCap, Briefcase, BadgeCheck, MessageCircle, ThumbsUp, MapPinned, Lightbulb, TrendingDown, AlertCircle, Send, Landmark, Coffee, Home as HomeIcon, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    tip: 'Tesco Express has 50% off ready meals after 8pm. Perfect for budget dinners!🌙',
    likes: 81,
    time: '2d ago'
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
  const [walletSeed, setWalletSeed] = useState(null); // This is intentionally not persisted for security
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
      
      // Load saved data
      if (currentUser.monthly_income) setIncome(currentUser.monthly_income.toString());
      if (currentUser.monthly_expenses) setExpenses(currentUser.monthly_expenses.toString());
      if (currentUser.monthly_balance !== undefined) setBalance(currentUser.monthly_balance);
      
      if (currentUser.goals && currentUser.goals.length > 0) {
        setGoals(currentUser.goals);
        if (currentUser.goals.filter(g => g.trim() !== '').length >= 3) {
          setGoalsSet(true);
        }
      } else {
        setGoals(['', '', '']); // Ensure goals array is initialized if empty
      }
      if (currentUser.goals_completed) setGoalsSet(true); // Redundant with above but keeps consistency

      if (currentUser.xrpl_wallet_address) setWalletAddress(currentUser.xrpl_wallet_address);
      
      if (currentUser.mission_explorer) {
        setConverterUsed(true);
        // Note: convertedEuro and localAmount are not persisted, so conversion results
        // will not be displayed on reload unless re-calculated.
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
      // Handle scenario where user is not logged in or session expired
      // For this demo, we'll just allow them to use the app without persistence.
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
      // Optionally update local user state if needed
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
    
    // Save to database
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
        // Fallback to mock rates
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
      // Fallback to mock rates
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
      
      // Save to database
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
      setWalletSeed(wallet.seed); // Keep seed in state for session, not persisted
      setError(null);
      
      // Save wallet address to database (NOT the seed for security!)
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

      // Simulate a symbolic cross-border payment
      const payment = {
        TransactionType: 'Payment',
        Account: wallet.address,
        Amount: window.xrpl.xrpToDrops('1'), // 1 XRP symbolic payment
        Destination: 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY', // Testnet destination
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

  const getBudgetCoachAdvice = () => {
    if (balance === null) return null;
    
    const cityData = CITY_COSTS[selectedCity];
    const difference = balance - cityData.avgCost;
    
    if (difference >= 200) {
      return {
        type: 'excellent',
        icon: Trophy,
        color: 'cyan',
        message: `Amazing! You're €${difference.toFixed(0)} above ${cityData.name}'s average. You're living comfortably! 🌟`,
        advice: 'Consider investing your extra savings or setting up an emergency fund.'
      };
    } else if (difference >= 0) {
      return {
        type: 'good',
        icon: CheckCircle2,
        color: 'green',
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
      completed: converterUsed && convertedEuro !== null, // Mission is completed if converter was used, even if convertedEuro isn't displayed on reload
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

  const budgetCoach = getBudgetCoachAdvice();
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

      {/* Floating Icons */}
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
          0%, 100% { text-shadow: 0 0 2px #00ffff, 0 0 4px #00ffff; }
          50% { text-shadow: 0 0 3px #00ffff, 0 0 6px #00ffff, 0 0 8px #ff00ff; }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(255, 0, 255, 0.5), inset 0 0 30px rgba(255, 0, 255, 0.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Retro Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            
            <motion.div 
              className="inline-block mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-1 rounded-2xl">
                  <div className="bg-black p-4 rounded-xl border-2 border-dashed border-cyan-400/50">
                    <div className="flex flex-col items-center gap-2">
                      <GraduationCap className="w-10 h-10 text-cyan-400" />
                      <Globe className="w-10 h-10 text-pink-400" />
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
              <Briefcase className="w-4 h-4" />
              <span className="uppercase">Your Study Abroad Financial Companion</span>
              <Briefcase className="w-4 h-4" />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full">
                <span className="text-cyan-400 text-xs font-bold">🌍 LIVE RATES</span>
              </div>
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-500 rounded-full">
                <span className="text-purple-400 text-xs font-bold">🗺️ CITY MAP</span>
              </div>
              <div className="px-3 py-1 bg-pink-500/20 border border-pink-500 rounded-full">
                <span className="text-pink-400 text-xs font-bold">⚡ XRPL TESTNET</span>
              </div>
              <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full">
                <span className="text-yellow-400 text-xs font-bold">💎 NFT BADGES</span>
              </div>
              <div className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-full">
                <span className="text-green-400 text-xs font-bold">💾 AUTO-SAVE</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-gray-400 text-sm italic"
            >
              "Master your money, conquer the world 🌍"
            </motion.div>
          </motion.div>

          {/* Welcome message with user name */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center"
            >
              <p className="text-cyan-400 font-bold text-lg">
                Welcome back, <span className="text-pink-400">{user.full_name || 'Explorer'}</span>! 🚀
              </p>
            </motion.div>
          )}

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <Alert className="bg-red-900/50 border-2 border-red-500" style={{ animation: 'pulse-border 2s ease-in-out infinite' }}>
                  <AlertDescription className="text-red-200 font-bold">
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
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
              <CardHeader className="border-b-2 border-cyan-500/30">
                <CardTitle className="flex items-center gap-2 text-xl text-cyan-400 font-black tracking-wide">
                  <Map className="w-6 h-6" />
                  YOUR STUDY ABROAD JOURNEY
                  <span className="ml-auto text-sm bg-cyan-500/20 border border-cyan-500 px-3 py-1 rounded-full">
                    {missions.filter(m => m.completed).length}/4 ⚡
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {missions.map((mission, index) => (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-2 rounded-xl p-4 backdrop-blur-sm ${
                        mission.completed 
                          ? 'border-cyan-400 bg-cyan-900/30' 
                          : 'border-gray-700 bg-gray-900/30'
                      }`}
                      style={mission.completed ? { animation: 'pulse-border 2s ease-in-out infinite' } : {}}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${
                          mission.completed ? 'bg-cyan-500/20' : 'bg-gray-800'
                        }`}>
                          <mission.icon className={`w-6 h-6 ${
                            mission.completed ? 'text-cyan-400' : 'text-gray-600'
                          }`} />
                        </div>
                        {mission.completed ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 text-xs font-bold">DONE</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded-full">
                            <Lock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500 text-xs font-bold">LOCKED</span>
                          </div>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="text-xs font-bold text-purple-400 tracking-wider">MISSION {mission.mission}</span>
                      </div>
                      <h3 className={`font-black text-sm mb-1 ${
                        mission.completed ? 'text-cyan-400' : 'text-gray-500'
                      }`}>
                        {mission.title}
                      </h3>
                      <p className="text-gray-400 text-xs">{mission.description}</p>
                      {mission.completed && !mintedNFTs[mission.nftType] && walletAddress && (
                        <Button
                          onClick={() => mintNFT(mission.nftType)}
                          disabled={currentlyMinting === mission.nftType}
                          className="w-full mt-3 h-8 text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-2 border-cyan-400"
                        >
                          {currentlyMinting === mission.nftType ? '⚡ MINTING...' : '💎 CLAIM NFT'}
                        </Button>
                      )}
                      {mintedNFTs[mission.nftType] && (
                        <div className="mt-3 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border-2 border-yellow-500 rounded-full text-yellow-400 text-xs font-bold">
                            <Award className="w-3 h-3" />
                            NFT EARNED ⚡
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* City Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50">
              <CardHeader className="border-b-2 border-purple-500/30">
                <CardTitle className="flex items-center gap-2 text-lg text-purple-400 font-black tracking-wide">
                  <MapPin className="w-5 h-5" />
                  CHOOSE YOUR STUDY CITY
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger className="border-2 border-purple-500/50 bg-black/50 text-purple-100 h-12 font-bold">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-2 border-purple-500">
                    {Object.entries(CITY_COSTS).map(([key, data]) => (
                      <SelectItem key={key} value={key} className="text-purple-100 font-bold">
                        {data.flag} {data.name}, {data.country} (Avg. Cost: €{data.avgCost}/mo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>


          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* MISSION 1: Budget Calculator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                  <CardHeader className="border-b-2 border-cyan-500/30">
                    <CardTitle className="flex items-center gap-2 text-xl text-cyan-400 font-black tracking-wide">
                      <Coins className="w-6 h-6" />
                      MISSION 1: ENTER YOUR BUDGET
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-cyan-400 font-bold text-sm mb-2 flex items-center gap-2 tracking-wide">
                          <TrendingUp className="w-4 h-4" />
                          INCOME (€)
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g., 1000"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          className="border-2 border-cyan-500/50 bg-black/50 text-cyan-100 placeholder-gray-600 focus:border-cyan-400 h-12 text-lg font-bold"
                        />
                      </div>

                      <div>
                        <Label className="text-pink-400 font-bold text-sm mb-2 flex items-center gap-2 tracking-wide">
                          <TrendingDown className="w-4 h-4" />
                          EXPENSES (€)
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g., 800"
                          value={expenses}
                          onChange={(e) => setExpenses(e.target.value)}
                          className="border-2 border-pink-500/50 bg-black/50 text-pink-100 placeholder-gray-600 focus:border-pink-400 h-12 text-lg font-bold"
                        />
                      </div>
                    </div>

                    {income && expenses && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold text-cyan-400">
                          <span>BUDGET USAGE</span>
                          <span className={`${
                            getSpendingPercentage() < 50 ? 'text-green-400' :
                            getSpendingPercentage() < 75 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {getSpendingPercentage().toFixed(0)}%
                          </span>
                        </div>
                        <div className="relative h-8 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-500/30">
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
                      className="w-full h-14 text-lg font-black bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 border-2 border-cyan-400 tracking-wider"
                    >
                      <Trophy className="w-6 h-6 mr-2" />
                      CALCULATE SAVINGS ⚡
                    </Button>

                    {balance !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`border-2 rounded-xl p-5 backdrop-blur-sm ${
                          balance > 0 ? 'border-cyan-400 bg-cyan-900/30' : 'border-red-400 bg-red-900/30'
                        }`}
                        style={balance > 0 ? { animation: 'pulse-border 2s ease-in-out infinite' } : {}}
                      >
                        <p className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2 tracking-wide">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          MONTHLY SAVINGS
                        </p>
                        <div className={`text-5xl font-black text-center mb-3 ${
                          balance > 0 ? 'text-cyan-400' : 'text-red-400'
                        }`} style={{ textShadow: balance > 0 ? '0 0 20px rgba(0, 255, 255, 0.8)' : '0 0 20px rgba(255, 0, 0, 0.8)' }}>
                          €{Math.abs(balance).toFixed(2)}
                        </div>
                        {balance > 50 && (
                          <div className="text-center">
                            <span className="inline-flex items-center gap-1 px-4 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-full text-yellow-400 text-sm font-black mb-2">
                              <Trophy className="w-4 h-4" />
                              MISSION 1 COMPLETE! ⚡
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* MISSION 2: Real Currency Converter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                  <CardHeader className="border-b-2 border-purple-500/30">
                    <CardTitle className="flex items-center gap-2 text-xl text-purple-400 font-black tracking-wide">
                      <Globe className="w-6 h-6" />
                      MISSION 2: LIVE CURRENCY CONVERTER
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-xs text-gray-400 text-center font-bold tracking-wide bg-purple-900/20 border border-purple-500/30 rounded-lg p-2">
                      🌍 POWERED BY EXCHANGERATE.HOST API • REAL-TIME RATES
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-purple-400 font-bold text-sm mb-2 flex items-center gap-2 tracking-wide">
                          <Landmark className="w-4 h-4" />
                          YOUR LOCAL CURRENCY
                        </Label>
                        <Select value={localCurrency} onValueChange={setLocalCurrency}>
                          <SelectTrigger className="border-2 border-purple-500/50 bg-black/50 text-purple-100 h-12 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black border-2 border-purple-500">
                            {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                              <SelectItem key={code} value={code} className="text-purple-100 font-bold">
                                {data.flag} {code} - {data.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-pink-400 font-bold text-sm mb-2 flex items-center gap-2 tracking-wide">
                          <Euro className="w-4 h-4" />
                          AMOUNT IN {localCurrency}
                        </Label>
                        <Input
                          type="number"
                          placeholder={localCurrency === 'MGA' ? 'e.g., 100000' : 'e.g., 1000'}
                          value={localAmount}
                          onChange={(e) => setLocalAmount(e.target.value)}
                          className="border-2 border-pink-500/50 bg-black/50 text-pink-100 placeholder-gray-600 focus:border-pink-400 h-12 text-lg font-bold"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={fetchRealExchangeRate}
                      disabled={isLoadingRate || !localAmount}
                      className="w-full h-14 text-lg font-black bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-2 border-purple-400 tracking-wider"
                    >
                      {isLoadingRate ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block mr-2"
                          >
                            <Zap className="w-5 h-5" />
                          </motion.div>
                          FETCHING LIVE RATES...
                        </>
                      ) : (
                        <>
                          <Plane className="w-5 h-5 mr-2" />
                          CONVERT TO EUR ⚡
                        </>
                      )}
                    </Button>

                    {convertedEuro !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-2 border-purple-400 bg-purple-900/30 rounded-xl p-5 backdrop-blur-sm"
                        style={{ animation: 'pulse-border 2s ease-in-out infinite' }}
                      >
                        <div className="text-center mb-4">
                          <p className="text-xs font-bold text-purple-400 mb-2 tracking-wider">CONVERSION RESULT</p>
                          <p className="text-4xl font-black text-purple-400 mb-2" style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.8)' }}>
                            €{convertedEuro.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-300 font-bold mb-3">
                            {CURRENCY_RATES[localCurrency].symbol}{localAmount} {localCurrency} = €{convertedEuro.toFixed(2)} EUR
                          </p>
                          {realExchangeRate && (
                            <p className="text-xs text-cyan-400 font-bold">
                              📊 Live Rate: 1 {localCurrency} = €{realExchangeRate.toFixed(6)}
                            </p>
                          )}
                        </div>
                        
                        <div className="bg-cyan-900/20 border-2 border-cyan-500/50 rounded-lg p-3">
                          <p className="text-cyan-400 text-sm font-black mb-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            PURCHASING POWER IN {cityData.name.toUpperCase()}
                          </p>
                          <p className="text-gray-300 text-xs">
                            Your {CURRENCY_RATES[localCurrency].symbol}{localAmount} equals <strong className="text-cyan-400">~€{convertedEuro.toFixed(0)}</strong> in {cityData.name} today.
                            {convertedEuro >= cityData.avgCost ? 
                              ` That's ${((convertedEuro / cityData.avgCost) * 100).toFixed(0)}% of the average monthly cost! 🎉` :
                              ` You'll need €${(cityData.avgCost - convertedEuro).toFixed(0)} more to reach average monthly cost.`
                            }
                          </p>
                        </div>

                        <div className="mt-3 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border-2 border-yellow-500 rounded-full text-yellow-400 text-xs font-black">
                            <Globe className="w-4 h-4" />
                            MISSION 2 COMPLETE! ⚡
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Geo-Value Map with Leaflet */}
              {converterUsed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                    <CardHeader className="border-b-2 border-cyan-500/30">
                      <CardTitle className="flex items-center gap-2 text-xl text-cyan-400 font-black tracking-wide">
                        <Map className="w-6 h-6" />
                        GEO-VALUE MAP: {cityData.name.toUpperCase()} {cityData.flag}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-xs font-bold">CHEAP MEALS</span>
                        </div>
                        <div className="px-3 py-1 bg-blue-500/20 border border-blue-500 rounded-full flex items-center gap-2">
                          <HomeIcon className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 text-xs font-bold">HOUSING</span>
                        </div>
                        <div className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-full flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-xs font-bold">STUDY SPOTS</span>
                        </div>
                      </div>

                      <div className="h-96 rounded-xl overflow-hidden border-2 border-cyan-500/30">
                        {typeof window !== 'undefined' && (
                          <MapContainer
                            center={cityData.coords}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            className="z-0"
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {cityData.spots.map((spot) => (
                              <Marker key={spot.id} position={spot.coords}>
                                <Popup>
                                  <div className="font-bold text-sm">
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {cityData.spots.slice(0, 3).map((spot) => (
                          <div key={spot.id} className="bg-gray-900/50 border-2 border-gray-700 rounded-lg p-3 hover:border-cyan-400 transition-all">
                            <p className="text-cyan-400 font-bold text-sm mb-1">{getMarkerIcon(spot.category)} {spot.name}</p>
                            <p className="text-xs text-gray-400">{spot.description}</p>
                            <p className="text-xs text-green-400 font-bold mt-1">💰 {spot.price}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* MISSION 4: XRPL Transaction Simulator */}
              {walletAddress && converterUsed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-2 border-yellow-500/50" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                    <CardHeader className="border-b-2 border-yellow-500/30">
                      <CardTitle className="flex items-center gap-2 text-xl text-yellow-400 font-black tracking-wide">
                        <Send className="w-6 h-6" />
                        MISSION 4: XRPL CROSS-BORDER PAYMENT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="bg-yellow-900/20 border-2 border-yellow-500/50 rounded-lg p-4">
                        <p className="text-yellow-400 text-sm font-bold mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          SIMULATE YOUR FIRST CROSS-BORDER TRANSACTION
                        </p>
                        <p className="text-gray-300 text-xs mb-3">
                          Experience the future of international payments! We'll simulate sending 1 XRP from your wallet to demonstrate how blockchain enables instant, low-cost cross-border transfers.
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
                          className="w-full h-14 text-lg font-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 border-2 border-yellow-400 tracking-wider"
                        >
                          {isSimulatingTx ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block mr-2"
                              >
                                <Zap className="w-5 h-5" />
                              </motion.div>
                              SIMULATING TRANSACTION...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              SIMULATE XRPL PAYMENT ⚡
                            </>
                          )}
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border-2 border-green-400 bg-green-900/30 rounded-xl p-5 backdrop-blur-sm"
                          style={{ animation: 'pulse-border 2s ease-in-out infinite' }}
                        >
                          <div className="text-center mb-3">
                            <div className="text-5xl mb-2">✅</div>
                            <p className="text-green-400 font-black text-lg mb-2">TRANSACTION SUCCESSFUL!</p>
                            <p className="text-xs text-gray-300 mb-3">
                              Your symbolic cross-border payment has been processed on XRPL Testnet
                            </p>
                          </div>
                          
                          {txHash && (
                            <div className="bg-black/50 p-3 rounded border-2 border-green-500/50 mb-3">
                              <p className="text-xs text-green-400 mb-1 font-bold">TX HASH</p>
                              <p className="text-green-300 font-mono text-xs break-all">{txHash}</p>
                            </div>
                          )}

                          <div className="text-center">
                            <span className="inline-flex items-center gap-1 px-4 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-full text-yellow-400 text-sm font-black">
                              <Trophy className="w-4 h-4" />
                              MISSION 4 COMPLETE! ⚡
                            </span>
                          </div>
                        </motion.div>
                      )}

                      <p className="text-xs text-center text-gray-500 font-bold">
                        🎮 TESTNET ONLY • NO REAL FUNDS • EDUCATIONAL PURPOSE
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Goals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-pink-500/50" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                  <CardHeader className="border-b-2 border-pink-500/30">
                    <CardTitle className="flex items-center gap-2 text-lg text-pink-400 font-black tracking-wide">
                      <Target className="w-5 h-5" />
                      MISSION 3: GOALS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {goals.map((goal, index) => (
                      <div key={index}>
                        <Label className="text-pink-400 font-bold text-xs mb-1 flex items-center gap-1 tracking-wide">
                          <Star className="w-3 h-3" />
                          GOAL {index + 1}
                        </Label>
                        <Input
                          placeholder={`e.g., ${['Save €100', 'Cut food costs 20%', 'Find part-time job'][index]}`}
                          value={goal}
                          onChange={(e) => {
                            const newGoals = [...goals];
                            newGoals[index] = e.target.value;
                            setGoals(newGoals);
                          }}
                          className="border-2 border-pink-500/50 bg-black/50 text-pink-100 placeholder-gray-600 h-10 text-sm font-bold"
                          disabled={goalsSet}
                        />
                      </div>
                    ))}
                    
                    {!goalsSet ? (
                      <Button 
                        onClick={handleSetGoals}
                        className="w-full h-12 text-sm font-black bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-600 hover:to-orange-700 border-2 border-pink-400 tracking-wider"
                      >
                        <Target className="w-5 h-5 mr-2" />
                        LOCK IN GOALS ⚡
                      </Button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border-2 border-pink-400 bg-pink-900/30 rounded-xl p-4 text-center backdrop-blur-sm"
                        style={{ animation: 'pulse-border 2s ease-in-out infinite' }}
                      >
                        <p className="text-3xl mb-2">🎯</p>
                        <p className="text-pink-400 font-black text-sm mb-2">GOALS ACTIVATED!</p>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border-2 border-yellow-500 rounded-full text-yellow-400 text-xs font-black">
                          <Award className="w-4 h-4" />
                          MISSION 3 COMPLETE! ⚡
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
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-yellow-500/50" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                  <CardHeader className="border-b-2 border-yellow-500/30">
                    <CardTitle className="flex items-center gap-2 text-lg text-yellow-400 font-black tracking-wide">
                      <Wallet className="w-5 h-5" />
                      NFT PASSPORT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {!walletAddress ? (
                      <div className="text-center space-y-3">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center border-4 border-yellow-400" style={{ boxShadow: '0 0 30px rgba(234, 179, 8, 0.6)' }}>
                          <BadgeCheck className="w-10 h-10 text-black" />
                        </div>
                        
                        <div>
                          <p className="font-black text-base text-yellow-400 mb-1 tracking-wide">🌟 DIGITAL PASSPORT</p>
                          <p className="text-xs text-gray-400 font-bold">Generate wallet to collect NFT badges</p>
                        </div>

                        <Button
                          onClick={generateWallet}
                          disabled={isConnecting || !xrplLoaded}
                          className="w-full h-12 text-sm font-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 border-2 border-yellow-400 tracking-wider"
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
                              CREATING...
                            </>
                          ) : (
                            <>
                              <BadgeCheck className="w-5 h-5 mr-2" />
                              CREATE PASSPORT ⚡
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="border-2 border-green-400 bg-green-900/30 rounded-xl p-3 backdrop-blur-sm" style={{ animation: 'pulse-border 2s ease-in-out infinite' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-green-400 flex items-center gap-1 tracking-wide">
                              <BadgeCheck className="w-4 h-4" />
                              ACTIVE
                            </span>
                            <span className="text-xs font-black text-green-400">● VERIFIED</span>
                          </div>
                          <div className="bg-black/70 p-2 rounded border-2 border-green-500/50 mb-2">
                            <p className="text-xs text-green-400 mb-1 font-bold">ADDRESS</p>
                            <p className="text-green-300 font-mono text-xs break-all">{walletAddress}</p>
                          </div>
                          {walletSeed && ( // Only display seed if generated in current session
                            <div className="bg-black/70 p-2 rounded border-2 border-yellow-500/50">
                              <p className="text-xs text-yellow-400 mb-1 font-bold">🔑 SECRET KEY (KEEP SAFE! DO NOT SHARE OR LOSE!)</p>
                              <p className="text-yellow-300 font-mono text-xs break-all">{walletSeed}</p>
                            </div>
                          )}
                        </div>

                        <div className="border-2 border-purple-400 bg-purple-900/30 rounded-xl p-3 backdrop-blur-sm">
                          <h3 className="text-xs font-black text-purple-400 mb-2 flex items-center gap-1 tracking-wide">
                            <Award className="w-4 h-4" />
                            BADGE COLLECTION
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {missions.map((mission) => (
                              <div
                                key={mission.id}
                                className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 ${
                                  mintedNFTs[mission.nftType]
                                    ? 'border-cyan-400 bg-cyan-900/30'
                                    : 'border-gray-700 bg-gray-900/30'
                                }`}
                                style={mintedNFTs[mission.nftType] ? { boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)' } : {}}
                              >
                                {mintedNFTs[mission.nftType] ? (
                                  <>
                                    <Award className="w-6 h-6 text-cyan-400 mb-1" />
                                    <span className="text-cyan-400 text-xs font-black text-center leading-tight">
                                      L{mission.mission}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-6 h-6 text-gray-600 mb-1" />
                                    <span className="text-gray-600 text-xs font-bold text-center leading-tight">
                                      Locked
                                    </span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-xs font-black text-purple-400 tracking-wide">
                              {Object.values(mintedNFTs).filter(Boolean).length}/4 COLLECTED ⚡
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
                <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                  <CardHeader className="border-b-2 border-cyan-500/30">
                    <CardTitle className="flex items-center gap-2 text-lg text-cyan-400 font-black tracking-wide">
                      <MessageCircle className="w-5 h-5" />
                      COMMUNITY TIPS ⚡
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs text-gray-400 text-center font-bold tracking-wide mb-2">
                      💡 MONEY-SAVING TIPS FROM STUDENTS WORLDWIDE
                    </p>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {COMMUNITY_POSTS.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-2 border-gray-700 bg-gray-900/50 rounded-xl p-3 hover:border-cyan-400 hover:bg-cyan-900/20 transition-all backdrop-blur-sm"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="text-2xl">{post.avatar}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-black text-sm text-cyan-400">{post.author}</p>
                                <span className="text-xs text-gray-500 font-bold">{post.time}</span>
                              </div>
                              <p className="text-xs text-gray-400 font-bold">
                                <MapPin className="w-3 h-3 inline mr-1 text-purple-400" />
                                {post.city}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-2 font-medium">{post.tip}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors font-bold">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border-2 border-cyan-500 rounded-full mb-4">
              <span className="text-cyan-400 text-xs font-black tracking-wider">🎮 XRP TESTNET • EDUCATIONAL USE ONLY ⚡</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
