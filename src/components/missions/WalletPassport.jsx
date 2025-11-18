import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Wallet, Zap, Trophy, Lock, CheckCircle2, Copy, ExternalLink, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function WalletPassport({
  walletAddress,
  walletSeed,
  isConnecting,
  xrplLoaded,
  missions,
  mintedNFTs,
  currentlyMinting,
  onGenerateWallet,
  onConnectXaman,
  onMintNFT
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectXaman = () => {
    if (onConnectXaman) {
      onConnectXaman();
    } else {
      // Fallback: Open XAMAN deep link
      const deepLink = 'xumm://connect';
      window.open(deepLink, '_blank');
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Connection Options */}
      {!walletAddress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-green-600/40 to-blue-600/40 backdrop-blur-sm border-2 md:border-4 border-green-400">
            <CardHeader className="p-3 md:p-4 border-b-2 border-green-400/30">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg text-green-400 font-black">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
                CONNECT WALLET
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 space-y-3">
              <Alert className="bg-blue-900/50 border-2 border-blue-400">
                <AlertDescription className="text-blue-200 text-xs md:text-sm font-bold" style={{ fontFamily: 'monospace' }}>
                  💡 Connect your Xaman wallet to mint NFTs on the XRP Ledger
                </AlertDescription>
              </Alert>

              {/* XAMAN Wallet Connection */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="bg-black/40 border-2 border-green-500 cursor-pointer hover:border-green-400 transition-all">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-green-500 border-2 border-black flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-green-400 font-black text-sm md:text-base" style={{ fontFamily: 'monospace' }}>
                            XAMAN WALLET
                          </h3>
                        </div>
                        <p className="text-gray-300 text-xs md:text-sm mb-3 font-bold" style={{ fontFamily: 'monospace' }}>
                          ✅ Secure mobile wallet<br/>
                          ✅ Real XRPL transactions<br/>
                          ✅ Mint NFT badges
                        </p>
                        <Button
                          onClick={handleConnectXaman}
                          disabled={isConnecting}
                          className="w-full bg-green-500 hover:bg-green-400 text-white border-2 border-black font-black text-xs md:text-sm"
                          style={{ fontFamily: 'monospace' }}
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
                              CONNECTING...
                            </>
                          ) : (
                            <>
                              <Smartphone className="w-4 h-4 mr-2" />
                              CONNECT XAMAN
                            </>
                          )}
                        </Button>
                        <p className="text-gray-400 text-[10px] mt-2 text-center" style={{ fontFamily: 'monospace' }}>
                          Don't have XAMAN? <a href="https://xaman.app" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">Download here</a>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Connected Wallet Display */}
      {walletAddress && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-br from-green-600/40 to-blue-600/40 backdrop-blur-sm border-2 md:border-4 border-green-400">
            <CardHeader className="p-3 md:p-4 border-b-2 border-green-400/30">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg text-green-400 font-black">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                WALLET CONNECTED
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 space-y-3">
              <div className="bg-black/50 border-2 border-green-500 rounded p-3">
                <Label className="text-green-400 font-black text-xs mb-2 block" style={{ fontFamily: 'monospace' }}>
                  YOUR ADDRESS
                </Label>
                <div className="flex items-center gap-2">
                  <code className="text-white text-[10px] md:text-xs font-bold break-all flex-1" style={{ fontFamily: 'monospace' }}>
                    {walletAddress}
                  </code>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(walletAddress)}
                    className="bg-green-500 hover:bg-green-400 text-white border-2 border-black p-2"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <a
                  href={`https://livenet.xrpl.org/accounts/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-bold mt-2 inline-flex items-center gap-1"
                  style={{ fontFamily: 'monospace' }}
                >
                  VIEW ON EXPLORER <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <Alert className="bg-green-900/50 border-2 border-green-500">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <AlertDescription className="text-green-200 text-xs font-bold" style={{ fontFamily: 'monospace' }}>
                  Your XAMAN wallet is connected securely!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* NFT Collection */}
      {walletAddress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-sm border-2 border-pink-500/50">
            <CardHeader className="p-3 md:p-4 border-b-2 border-pink-500/30">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg text-pink-400 font-black">
                <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                NFT BADGE COLLECTION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 space-y-3">
              <p className="text-gray-300 text-xs md:text-sm font-bold" style={{ fontFamily: 'monospace' }}>
                Complete missions to unlock NFT badges on the blockchain!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {missions.map((mission, index) => {
                  const isMinted = mintedNFTs[mission.nftType];
                  const canMint = mission.completed && !isMinted;
                  const isMinting = currentlyMinting === mission.nftType;

                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={canMint ? { scale: 1.05 } : {}}
                    >
                      <Card className={`${
                        isMinted 
                          ? 'bg-green-900/30 border-2 border-green-500'
                          : canMint
                          ? 'bg-yellow-900/30 border-2 border-yellow-500 cursor-pointer'
                          : 'bg-gray-900/30 border-2 border-gray-700'
                      }`}>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-12 h-12 border-2 flex items-center justify-center ${
                              isMinted ? 'border-green-500 bg-green-900/50' :
                              canMint ? 'border-yellow-500 bg-yellow-900/50' :
                              'border-gray-700 bg-gray-900/50'
                            }`}>
                              {isMinted ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                  <mission.icon className="w-6 h-6 text-green-400" />
                                </motion.div>
                              ) : canMint ? (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <mission.icon className="w-6 h-6 text-yellow-400" />
                                </motion.div>
                              ) : (
                                <Lock className="w-6 h-6 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-black text-sm ${
                                isMinted ? 'text-green-400' :
                                canMint ? 'text-yellow-400' :
                                'text-gray-500'
                              }`} style={{ fontFamily: 'monospace' }}>
                                {mission.title}
                              </h3>
                              <p className="text-gray-400 text-[10px] font-bold" style={{ fontFamily: 'monospace' }}>
                                {isMinted ? '✅ MINTED' : canMint ? '⚡ READY' : '🔒 LOCKED'}
                              </p>
                            </div>
                          </div>
                          
                          {canMint && (
                            <Button
                              onClick={() => onMintNFT(mission.nftType)}
                              disabled={isMinting}
                              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black border-2 border-black font-black text-xs"
                              style={{ fontFamily: 'monospace' }}
                            >
                              {isMinting ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="inline-block mr-2"
                                  >
                                    <Zap className="w-3 h-3" />
                                  </motion.div>
                                  MINTING...
                                </>
                              ) : (
                                <>
                                  <Trophy className="w-3 h-3 mr-2" />
                                  MINT NFT BADGE
                                </>
                              )}
                            </Button>
                          )}

                          {isMinted && (
                            <div className="bg-green-900/30 border border-green-500 rounded p-2 text-center">
                              <p className="text-green-400 text-[10px] font-black" style={{ fontFamily: 'monospace' }}>
                                🎉 OWNED!
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}