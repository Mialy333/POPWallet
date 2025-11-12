import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, MessageCircle, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  }
];

export default function GoalsPlanner({ goals, setGoals, goalsSet, onSetGoals }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card className="bg-black/40 backdrop-blur-sm border-2 border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300">
        <CardHeader className="p-3 border-b-2 border-pink-500/30">
          <CardTitle className="flex items-center gap-2 text-base text-pink-400 font-black">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Target className="w-5 h-5" />
            </motion.div>
            MISSION 3: GOALS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {goals.map((goal, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Label className="text-pink-400 font-bold text-xs mb-1 flex items-center gap-1">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  🎯
                </motion.span>
                GOAL {index + 1}
              </Label>
              <Input
                placeholder={`e.g., ${['Save €100', 'Cut costs 20%', 'Find job'][index]}`}
                value={goal}
                onChange={(e) => {
                  const newGoals = [...goals];
                  newGoals[index] = e.target.value;
                  setGoals(newGoals);
                }}
                className="border-2 border-pink-500/50 bg-black/50 text-pink-100 h-10 text-sm font-bold hover:border-pink-400 focus:border-pink-400 transition-all"
                disabled={goalsSet}
              />
            </motion.div>
          ))}
          
          {!goalsSet ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={onSetGoals}
                className="w-full h-10 text-sm font-black bg-gradient-to-r from-pink-500 to-orange-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all"
              >
                <Target className="w-4 h-4 mr-2" />
                LOCK GOALS ⚡
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="border-2 border-pink-400 bg-pink-900/30 rounded-xl p-4 text-center"
            >
              <motion.p 
                className="text-2xl mb-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎯
              </motion.p>
              <p className="text-pink-400 font-black text-sm mb-2">GOALS ACTIVATED!</p>
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
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-2 border-purple-400 bg-purple-900/20 rounded-xl p-3 mt-4"
          >
            <h3 className="text-xs font-black text-purple-400 mb-2 flex items-center gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <MessageCircle className="w-3 h-3" />
              </motion.div>
              COMMUNITY TIPS
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {COMMUNITY_POSTS.map((post, index) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="border border-gray-700 bg-gray-900/50 rounded-lg p-2 hover:border-cyan-400 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <motion.div 
                      className="text-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {post.avatar}
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-black text-xs text-cyan-400">{post.author}</p>
                      <p className="text-xs text-gray-400">{post.city}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mb-1">{post.tip}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <motion.div whileHover={{ scale: 1.3 }}>
                      <ThumbsUp className="w-3 h-3" />
                    </motion.div>
                    {post.likes}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}