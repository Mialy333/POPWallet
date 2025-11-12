import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function XRPLPayment({ 
  walletAddress,
  converterUsed,
  localCurrency,
  currencyFlag,
  xrplTransactionDone,
  isSimulatingTx,
  txHash,
  onSimulateTransaction
}) {
  if (!walletAddress || !converterUsed) {
    return (
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
            <p className="text-gray-500 font-bold mb-2">Complete Mission 2 and create wallet first!</p>
            <p className="text-xs text-gray-600">You need to convert currency and have a wallet</p>
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
                    {currencyFlag}
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
                onClick={onSimulateTransaction}
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
  );
}