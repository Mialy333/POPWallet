import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Award, Lock, BadgeCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function WalletPassport({ 
  walletAddress, 
  walletSeed, 
  isConnecting, 
  xrplLoaded,
  missions,
  mintedNFTs,
  currentlyMinting,
  onGenerateWallet,
  onMintNFT
}) {
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
                  onClick={onGenerateWallet}
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
                              onClick={() => onMintNFT(mission.nftType)}
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
  );
}