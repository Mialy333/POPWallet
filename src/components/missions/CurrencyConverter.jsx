import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plane, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function CurrencyConverter({ 
  localCurrency, 
  setLocalCurrency, 
  localAmount, 
  setLocalAmount,
  convertedEuro,
  realExchangeRate,
  isLoadingRate,
  onConvert,
  cityData
}) {
  return (
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
                <SelectTrigger className="border-2 border-purple-500/50 bg-black/50 text-purple-100 h-10 font-bold text-sm hover:border-purple-400 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-2 border-purple-500">
                  {Object.entries(CURRENCY_RATES)
                    .filter(([code]) => code !== 'EUR')
                    .map(([code, data]) => (
                      <SelectItem key={code} value={code} className="text-purple-100 font-bold text-sm">
                        <span className="flex items-center gap-2">
                          <motion.span
                            whileHover={{ scale: 1.3, rotate: 10 }}
                            className="inline-block"
                          >
                            {data.flag}
                          </motion.span>
                          <span>{code} - {data.name}</span>
                        </span>
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
              onClick={onConvert}
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
  );
}