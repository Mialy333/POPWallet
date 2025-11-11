import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, TrendingUp, Award, Sparkles, Euro, Zap, Trophy, Star, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [balance, setBalance] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletSeed, setWalletSeed] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
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

  const mintNFT = async () => {
    if (!xrplLoaded || !window.xrpl) {
      setError('XRP Ledger library not loaded yet');
      return;
    }

    if (!walletSeed) {
      setError('Please generate a wallet first');
      return;
    }

    try {
      setIsMinting(true);
      setError(null);

      const client = new window.xrpl.Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      const wallet = window.xrpl.Wallet.fromSeed(walletSeed);
      await client.fundWallet(wallet);

      const nftMintTx = {
        TransactionType: 'NFTokenMint',
        Account: wallet.address,
        URI: window.xrpl.convertStringToHex(
          JSON.stringify({
            name: 'Smart Saver NFT',
            description: `Earned by saving €${balance.toFixed(2)}`,
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400'
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
        setNftMinted(true);
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
      setIsMinting(false);
    }
  };

  const canMintNFT = balance !== null && balance > 50 && walletAddress && !nftMinted;

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

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.3
            }}
            animate={{
              y: [null, Math.random() * -100 - 100],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
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
                y: window.innerHeight + 100, 
                rotate: 360,
                opacity: 0
              }}
              transition={{ duration: Math.random() * 2 + 2, delay: Math.random() * 0.5 }}
            >
              {['⭐', '💎', '🎮', '🏆', '💰'][Math.floor(Math.random() * 5)]}
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
      `}</style>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Retro Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div 
              className="inline-block mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-1 rounded-2xl">
                  <div className="bg-black p-4 rounded-xl">
                    <Zap className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-black mb-3 tracking-wider"
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
            
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm md:text-base font-bold tracking-widest">
              <Star className="w-4 h-4" />
              <span className="uppercase">Level Up Your Savings</span>
              <Star className="w-4 h-4" />
            </div>

            <div className="mt-4 flex justify-center gap-4">
              <div className="px-4 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full">
                <span className="text-cyan-400 text-xs font-bold">🎮 WEB3 GAMING</span>
              </div>
              <div className="px-4 py-1 bg-pink-500/20 border border-pink-500 rounded-full">
                <span className="text-pink-400 text-xs font-bold">⚡ XRP LEDGER</span>
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
                <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-red-400 font-bold text-center">⚠️ {error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Budget Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 animate-pulse"></div>
              
              <Card className="relative bg-black/80 backdrop-blur-xl border-2 border-cyan-500 shadow-2xl overflow-hidden" style={{ animation: 'pulse-border 3s ease-in-out infinite' }}>
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.5) 2px, rgba(0, 255, 255, 0.5) 4px)'
                }}></div>

                <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b-2 border-cyan-500">
                  <CardTitle className="flex items-center gap-3 text-cyan-400 text-xl md:text-2xl font-black uppercase tracking-wider">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <Coins className="w-6 h-6" />
                    </div>
                    Budget Calculator
                    <div className="ml-auto text-xs bg-pink-500/30 px-3 py-1 rounded-full border border-pink-500">
                      MISSION 1
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-4">
                    <div className="relative">
                      <Label className="text-cyan-400 font-bold uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Income Credits (€)
                      </Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="bg-black/50 border-2 border-cyan-500/50 focus:border-cyan-400 text-cyan-300 text-lg font-bold placeholder:text-cyan-800 rounded-xl h-14"
                      />
                      <div className="absolute right-3 top-[38px] text-cyan-500 font-black">€</div>
                    </div>

                    <div className="relative">
                      <Label className="text-pink-400 font-bold uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Expense Drain (€)
                      </Label>
                      <Input
                        type="number"
                        placeholder="800"
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                        className="bg-black/50 border-2 border-pink-500/50 focus:border-pink-400 text-pink-300 text-lg font-bold placeholder:text-pink-800 rounded-xl h-14"
                      />
                      <div className="absolute right-3 top-[38px] text-pink-500 font-black">€</div>
                    </div>
                  </div>

                  <Button 
                    onClick={calculateBalance}
                    className="w-full h-14 text-lg font-black uppercase tracking-wider relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                      border: 'none'
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-black">
                      <Trophy className="w-5 h-5" />
                      Calculate Score
                      <Trophy className="w-5 h-5" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>

                  {/* Balance Result */}
                  <AnimatePresence>
                    {balance !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative mt-6"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-2xl blur opacity-75"></div>
                        <div className="relative bg-black border-2 border-green-400 rounded-2xl p-6 overflow-hidden">
                          {/* Animated background */}
                          <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 255, 0, 0.3) 10px, rgba(0, 255, 0, 0.3) 20px)'
                          }}></div>

                          <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-green-400 font-bold uppercase text-xs tracking-wider">💎 Savings Power</span>
                              <span className="text-green-400 font-bold text-xs">LVL {balance > 100 ? '3' : balance > 50 ? '2' : '1'}</span>
                            </div>
                            
                            <div className="text-center mb-4">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`text-6xl font-black ${balance > 0 ? 'text-green-400' : 'text-red-400'}`}
                                style={{
                                  textShadow: balance > 0 
                                    ? '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.5)'
                                    : '0 0 20px rgba(255, 0, 0, 0.8)'
                                }}
                              >
                                €{Math.abs(balance).toFixed(2)}
                              </motion.div>
                              {balance < 0 && (
                                <div className="text-red-400 font-bold mt-2">⚠️ DEFICIT MODE</div>
                              )}
                            </div>

                            {/* Progress Bar */}
                            <div className="relative h-8 bg-black/50 rounded-full overflow-hidden border-2 border-green-500/50 mb-3">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((balance / 100) * 100, 100)}%` }}
                                className="h-full bg-gradient-to-r from-green-400 to-cyan-400 relative"
                                style={{
                                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)'
                                }}
                              >
                                <div className="absolute inset-0 opacity-30" style={{
                                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255, 255, 255, 0.5) 5px, rgba(255, 255, 255, 0.5) 10px)'
                                }}></div>
                              </motion.div>
                              <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xs">
                                {Math.min(balance, 100).toFixed(0)}%
                              </div>
                            </div>

                            {balance > 50 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                              >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-black font-black text-sm">
                                  <Award className="w-4 h-4" />
                                  NFT BADGE UNLOCKED!
                                  <Sparkles className="w-4 h-4" />
                                </div>
                              </motion.div>
                            )}
                            {balance > 0 && balance <= 50 && (
                              <div className="text-center text-cyan-400 text-sm font-bold">
                                💪 Save €{(51 - balance).toFixed(2)} more to unlock NFT!
                              </div>
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

          {/* Wallet & NFT Section */}
          <AnimatePresence>
            {balance !== null && balance > 50 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                  
                  <Card className="relative bg-black/80 backdrop-blur-xl border-2 border-purple-500 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b-2 border-purple-500">
                      <CardTitle className="flex items-center gap-3 text-purple-400 text-xl md:text-2xl font-black uppercase tracking-wider">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Award className="w-6 h-6" />
                        </div>
                        NFT Mint Zone
                        <div className="ml-auto text-xs bg-yellow-500/30 px-3 py-1 rounded-full border border-yellow-500 text-yellow-400">
                          MISSION 2
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      {!walletAddress ? (
                        <div className="text-center space-y-6">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                          >
                            <Wallet className="w-12 h-12 text-white" />
                          </motion.div>
                          
                          <div>
                            <p className="text-cyan-400 font-bold text-lg mb-2">⚡ INITIALIZE WALLET</p>
                            <p className="text-gray-400 text-sm">Generate your testnet credentials</p>
                          </div>

                          <Button
                            onClick={generateWallet}
                            disabled={isConnecting || !xrplLoaded}
                            className="w-full h-14 text-lg font-black uppercase tracking-wider relative overflow-hidden group"
                            style={{
                              background: 'linear-gradient(45deg, #a855f7, #ec4899)',
                              border: 'none'
                            }}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                              {isConnecting ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  >
                                    <Zap className="w-5 h-5" />
                                  </motion.div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Wallet className="w-5 h-5" />
                                  Generate Wallet
                                  <Sparkles className="w-5 h-5" />
                                </>
                              )}
                            </span>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {/* Wallet Display */}
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl blur opacity-50"></div>
                            <div className="relative bg-black/90 border-2 border-cyan-400 rounded-xl p-4 space-y-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider">🔐 Wallet ID</span>
                                <span className="text-green-400 text-xs font-bold">● ACTIVE</span>
                              </div>
                              <div className="bg-black/50 p-3 rounded-lg border border-cyan-500/30">
                                <p className="text-cyan-300 font-mono text-xs break-all">{walletAddress}</p>
                              </div>
                              
                              <div className="pt-2 border-t border-cyan-500/30">
                                <span className="text-pink-400 font-bold text-xs uppercase tracking-wider">🔑 Secret Seed</span>
                                <div className="bg-black/50 p-3 rounded-lg border border-pink-500/30 mt-2">
                                  <p className="text-pink-300 font-mono text-xs break-all">{walletSeed}</p>
                                </div>
                                <p className="text-yellow-400 text-xs mt-2 font-bold">⚠️ Save this securely!</p>
                              </div>
                            </div>
                          </div>

                          {!nftMinted ? (
                            <Button
                              onClick={mintNFT}
                              disabled={isMinting || !canMintNFT}
                              className="w-full h-16 text-xl font-black uppercase tracking-wider relative overflow-hidden"
                              style={{
                                background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #ef4444)',
                                border: '2px solid #fbbf24'
                              }}
                            >
                              {isMinting ? (
                                <span className="relative z-10 flex items-center justify-center gap-3 text-black">
                                  <motion.div
                                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    <Zap className="w-6 h-6" />
                                  </motion.div>
                                  Minting NFT...
                                </span>
                              ) : (
                                <span className="relative z-10 flex items-center justify-center gap-3 text-black">
                                  <Trophy className="w-6 h-6" />
                                  MINT NFT BADGE
                                  <Trophy className="w-6 h-6" />
                                </span>
                              )}
                            </Button>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="relative"
                            >
                              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-center border-4 border-yellow-300">
                                <motion.div
                                  animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                                  className="text-8xl mb-4"
                                >
                                  🏆
                                </motion.div>
                                <h3 className="text-3xl font-black text-black mb-2 uppercase">
                                  Victory!
                                </h3>
                                <p className="text-black/80 font-bold text-lg mb-4">
                                  Smart Saver NFT Minted
                                </p>
                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-black rounded-full">
                                  <Award className="w-5 h-5 text-yellow-400" />
                                  <span className="font-black text-yellow-400 uppercase">Level Complete</span>
                                  <Star className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="mt-4 text-sm text-black/70 font-bold">
                                  🎮 Achievement Unlocked: Financial Warrior
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Retro Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <span className="text-cyan-400 text-xs font-bold">🎮 XRP LEDGER TESTNET</span>
            </div>
            <p className="text-gray-500 text-xs">No real value • Educational purposes only</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}