import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, TrendingUp, Award, Sparkles, Euro } from "lucide-react";
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

      // Connect to testnet
      const client = new window.xrpl.Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      // Recreate wallet from seed
      const wallet = window.xrpl.Wallet.fromSeed(walletSeed);

      // Fund the wallet on testnet (required for first-time accounts)
      await client.fundWallet(wallet);

      // Prepare NFT mint transaction
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

      // Auto-fill, sign, and submit
      const prepared = await client.autofill(nftMintTx);
      const signed = wallet.sign(prepared);
      const result = await client.submitAndWait(signed.tx_blob);

      if (result.result.meta.TransactionResult === 'tesSUCCESS') {
        setNftMinted(true);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CampusFi
          </h1>
          <p className="text-gray-600">Smart budgeting for smart students</p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Budget Calculator Card */}
        <Card className="mb-6 shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Euro className="w-5 h-5" />
              Monthly Budget Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="income" className="text-sm font-medium">Monthly Income (€)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="1000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expenses" className="text-sm font-medium">Monthly Expenses (€)</Label>
                <Input
                  id="expenses"
                  type="number"
                  placeholder="800"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={calculateBalance} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Calculate Balance
              </Button>
            </div>

            {/* Balance Result */}
            <AnimatePresence>
              {balance !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
                >
                  <p className="text-sm text-gray-600 mb-1">Your Monthly Savings</p>
                  <p className={`text-4xl font-bold ${balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{balance.toFixed(2)}
                  </p>
                  {balance > 50 && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Eligible for Smart Saver NFT!
                    </p>
                  )}
                  {balance > 0 && balance <= 50 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Save €{(51 - balance).toFixed(2)} more to earn your NFT badge!
                    </p>
                  )}
                  {balance <= 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Try reducing expenses to build savings!
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Wallet & NFT Section */}
        <AnimatePresence>
          {balance !== null && balance > 50 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Claim Your Smart Saver NFT
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {!walletAddress ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Generate a testnet wallet to mint your NFT badge
                      </p>
                      <Button
                        onClick={generateWallet}
                        disabled={isConnecting || !xrplLoaded}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        {isConnecting ? 'Generating...' : 'Generate Wallet'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Wallet Info */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Testnet Wallet Address</p>
                        <p className="text-sm font-mono break-all text-gray-800">{walletAddress}</p>
                        <p className="text-xs text-gray-500 mt-3 mb-1">Secret Seed (Keep safe!)</p>
                        <p className="text-sm font-mono break-all text-gray-800">{walletSeed}</p>
                      </div>

                      {!nftMinted ? (
                        <Button
                          onClick={mintNFT}
                          disabled={isMinting || !canMintNFT}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          {isMinting ? 'Minting NFT...' : 'Mint Smart Saver NFT'}
                        </Button>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200"
                        >
                          <div className="text-6xl mb-3">🎉</div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Congratulations!
                          </h3>
                          <p className="text-gray-600">
                            Your Smart Saver NFT has been minted on XRP Ledger Testnet!
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                            <Award className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-800">Smart Saver Badge</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>💡 This app uses XRP Ledger Testnet for learning purposes</p>
          <p className="mt-1">Testnet XRP has no real-world value</p>
        </motion.div>
      </div>
    </div>
  );
}