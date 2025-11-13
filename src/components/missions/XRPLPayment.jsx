import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, Zap, CheckCircle2, ExternalLink, ArrowRight, AlertTriangle, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function XRPLPayment({ 
  walletAddress, 
  converterUsed,
  localCurrency,
  currencyFlag,
  xrplTransactionDone,
  isSimulatingTx,
  txHash,
  onSimulateTransaction,
  useRealNetwork = true
}) {
  const [destinationAddress, setDestinationAddress] = useState('rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY');
  const [amount, setAmount] = useState('1');
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!walletAddress || !converterUsed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-black/40 backdrop-blur-sm border-2 border-gray-700">
          <CardContent className="p-6 md:p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-3" />
            </motion.div>
            <p className="text-gray-500 font-bold text-sm md:text-base mb-2" style={{ fontFamily: 'monospace' }}>
              🔒 MISSION LOCKED
            </p>
            <p className="text-gray-400 text-xs md:text-sm" style={{ fontFamily: 'monospace' }}>
              {!walletAddress ? 'Connect your wallet first!' : 'Complete the currency converter mission first!'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card className="bg-black/40 backdrop-blur-sm border-2 md:border-4 border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
        <CardHeader className="p-3 md:p-4 border-b-2 border-pink-500/30">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg text-pink-400 font-black">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Send className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
            MISSION 4: CROSS-BORDER PAYMENT
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-4 space-y-3 md:space-y-4">
          {/* Network Warning */}
          {useRealNetwork && (
            <Alert className="bg-orange-900/50 border-2 border-orange-500">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <AlertDescription className="text-orange-200 text-xs md:text-sm font-bold" style={{ fontFamily: 'monospace' }}>
                ⚠️ REAL BLOCKCHAIN: This uses the live XRP Ledger. Transaction fees ~0.00001 XRP ($0.000025)
              </AlertDescription>
            </Alert>
          )}

          <p className="text-gray-300 text-xs md:text-sm text-center font-bold bg-pink-900/20 border border-pink-500/30 rounded p-2 md:p-3" style={{ fontFamily: 'monospace' }}>
            💡 Simulate a real international payment using XRP Ledger blockchain technology
          </p>

          {!xrplTransactionDone ? (
            <div className="space-y-3">
              {/* Visual Payment Flow */}
              <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-2 border-pink-500/50 rounded p-3 md:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center flex-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-3xl md:text-4xl mb-2"
                    >
                      {currencyFlag}
                    </motion.div>
                    <p className="text-pink-400 font-black text-xs md:text-sm" style={{ fontFamily: 'monospace' }}>
                      YOUR HOME
                    </p>
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                      {localCurrency}
                    </p>
                  </div>

                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex-shrink-0 mx-2 md:mx-4"
                  >
                    <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />
                  </motion.div>

                  <div className="text-center flex-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                      className="text-3xl md:text-4xl mb-2"
                    >
                      🇪🇺
                    </motion.div>
                    <p className="text-cyan-400 font-black text-xs md:text-sm" style={{ fontFamily: 'monospace' }}>
                      EUROPE
                    </p>
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                      EUR / XRP
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-center">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <p className="text-gray-300 text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                    INSTANT • CHEAP • GLOBAL
                  </p>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-2">
                <div>
                  <Label className="text-pink-400 font-black text-xs mb-1 flex items-center gap-1">
                    💰 AMOUNT (XRP)
                  </Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1"
                    className="border-2 border-pink-500/50 bg-black/50 text-pink-100 font-bold text-sm"
                    style={{ fontFamily: 'monospace' }}
                  />
                  <p className="text-gray-400 text-[10px] mt-1" style={{ fontFamily: 'monospace' }}>
                    ~${(parseFloat(amount) * 2.5).toFixed(2)} USD (example rate)
                  </p>
                </div>

                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Label className="text-cyan-400 font-black text-xs mb-1 flex items-center gap-1">
                      📍 DESTINATION ADDRESS
                    </Label>
                    <Input
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      placeholder="r..."
                      className="border-2 border-cyan-500/50 bg-black/50 text-cyan-100 font-bold text-xs"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </motion.div>
                )}

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-cyan-400 text-[10px] font-bold hover:text-cyan-300 transition-colors"
                  style={{ fontFamily: 'monospace' }}
                >
                  {showAdvanced ? '▼ Hide' : '▶ Show'} Advanced Options
                </button>
              </div>

              {/* Send Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onSimulateTransaction}
                  disabled={isSimulatingTx}
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white border-4 border-black font-black text-sm md:text-base shadow-lg"
                  style={{ fontFamily: 'monospace' }}
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
                      SENDING...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      SEND PAYMENT ⚡
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/50 border border-green-500/50 rounded p-2">
                  <p className="text-green-400 font-black text-xs mb-1" style={{ fontFamily: 'monospace' }}>
                    ⚡ SPEED
                  </p>
                  <p className="text-gray-300 text-[10px] font-bold" style={{ fontFamily: 'monospace' }}>
                    3-5 seconds
                  </p>
                </div>
                <div className="bg-black/50 border border-blue-500/50 rounded p-2">
                  <p className="text-blue-400 font-black text-xs mb-1" style={{ fontFamily: 'monospace' }}>
                    💵 FEE
                  </p>
                  <p className="text-gray-300 text-[10px] font-bold" style={{ fontFamily: 'monospace' }}>
                    ~$0.000025
                  </p>
                </div>
              </div>

              {/* XAMAN Integration Hint */}
              <Alert className="bg-blue-900/50 border-2 border-blue-500">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <AlertDescription className="text-blue-200 text-[10px] md:text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                  💡 Using XAMAN? The app will open for secure signing!
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="border-2 border-green-400 bg-green-900/30 rounded p-4 md:p-6 text-center"
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity }}}
                className="inline-block mb-3"
              >
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-400" />
              </motion.div>
              <p className="text-green-400 font-black text-lg md:text-2xl mb-2" style={{ fontFamily: 'monospace' }}>
                PAYMENT SENT! 🎉
              </p>
              <p className="text-gray-300 text-xs md:text-sm mb-3 font-bold" style={{ fontFamily: 'monospace' }}>
                Your cross-border payment was successful!
              </p>
              
              {txHash && (
                <div className="bg-black/50 border border-green-500 rounded p-3 mb-3">
                  <p className="text-green-400 font-black text-xs mb-2" style={{ fontFamily: 'monospace' }}>
                    TRANSACTION HASH
                  </p>
                  <code className="text-gray-300 text-[10px] break-all block mb-2" style={{ fontFamily: 'monospace' }}>
                    {txHash}
                  </code>
                  <a
                    href={`https://livenet.xrpl.org/transactions/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-xs font-bold inline-flex items-center gap-1"
                    style={{ fontFamily: 'monospace' }}
                  >
                    VIEW ON EXPLORER <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-900/30 border border-yellow-500 rounded p-3"
              >
                <p className="text-yellow-400 font-black text-sm mb-1" style={{ fontFamily: 'monospace' }}>
                  🏆 MISSION COMPLETE!
                </p>
                <p className="text-gray-300 text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                  +250 XP • Go to WALLET tab to mint your NFT badge!
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Educational Footer */}
          {!xrplTransactionDone && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-2 md:p-3">
              <p className="text-purple-400 font-black text-xs mb-1" style={{ fontFamily: 'monospace' }}>
                💡 WHY XRPL?
              </p>
              <ul className="text-gray-300 text-[10px] font-bold space-y-1" style={{ fontFamily: 'monospace' }}>
                <li>• ⚡ 3-5 second settlement</li>
                <li>• 💰 $0.000025 fee (vs $25-50 banks)</li>
                <li>• 🌍 Send to 195+ countries instantly</li>
                <li>• 🔒 Secure blockchain technology</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}