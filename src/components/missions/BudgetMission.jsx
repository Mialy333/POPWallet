import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BudgetMission({ income, setIncome, expenses, setExpenses, balance, onCalculate }) {
  const getSpendingPercentage = () => {
    if (!income || !expenses) return 0;
    return Math.min((parseFloat(expenses) / parseFloat(income)) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'from-green-400 to-cyan-400';
    if (percentage < 75) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-pink-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300">
        <CardHeader className="p-3 border-b-2 border-cyan-500/30">
          <CardTitle className="flex items-center gap-2 text-base text-cyan-400 font-black">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Coins className="w-5 h-5" />
            </motion.div>
            MISSION 1: BUDGET
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Label className="text-cyan-400 font-bold text-xs mb-1 flex items-center gap-1">
                <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                  💰
                </motion.span>
                INCOME (€)
              </Label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="border-2 border-cyan-500/50 bg-black/50 text-cyan-100 h-10 text-sm font-bold hover:border-cyan-400 focus:border-cyan-400 transition-all"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Label className="text-pink-400 font-bold text-xs mb-1 flex items-center gap-1">
                <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}>
                  📊
                </motion.span>
                EXPENSES (€)
              </Label>
              <Input
                type="number"
                placeholder="e.g., 800"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="border-2 border-pink-500/50 bg-black/50 text-pink-100 h-10 text-sm font-bold hover:border-pink-400 focus:border-pink-400 transition-all"
              />
            </motion.div>
          </div>

          {income && expenses && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-xs font-bold text-cyan-400">
                <span>USAGE</span>
                <motion.span
                  key={getSpendingPercentage()}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                >
                  {getSpendingPercentage().toFixed(0)}%
                </motion.span>
              </div>
              <div className="relative h-6 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-500/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getSpendingPercentage()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${getProgressColor(getSpendingPercentage())}`}
                />
              </div>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={onCalculate}
              className="w-full h-10 text-sm font-black bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all"
            >
              <Trophy className="w-4 h-4 mr-2" />
              CALCULATE ⚡
            </Button>
          </motion.div>

          <AnimatePresence mode="wait">
            {balance !== null && (
              <motion.div
                key="balance-result"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`border-2 rounded-xl p-4 ${
                  balance > 0 ? 'border-cyan-400 bg-cyan-900/30' : 'border-red-400 bg-red-900/30'
                }`}
              >
                <p className="text-xs font-bold text-gray-300 mb-2">MONTHLY SAVINGS</p>
                <motion.div 
                  className={`text-3xl font-black text-center mb-2 ${
                    balance > 0 ? 'text-cyan-400' : 'text-red-400'
                  }`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  €{Math.abs(balance).toFixed(2)}
                </motion.div>
                {balance > 50 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <motion.span 
                      className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border-2 border-yellow-500 rounded-full text-yellow-400 text-xs font-black"
                      animate={{ 
                        boxShadow: [
                          '0 0 0px rgba(234, 179, 8, 0.5)',
                          '0 0 20px rgba(234, 179, 8, 0.8)',
                          '0 0 0px rgba(234, 179, 8, 0.5)'
                        ]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Trophy className="w-3 h-3" />
                      </motion.div>
                      COMPLETE! ⚡
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}