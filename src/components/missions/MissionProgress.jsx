import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, CheckCircle2, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function MissionProgress({ missions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-4"
    >
      <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300">
        <CardHeader className="p-3 border-b-2 border-cyan-500/30">
          <CardTitle className="flex items-center gap-2 text-sm text-cyan-400 font-black tracking-wide">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Map className="w-4 h-4" />
            </motion.div>
            MISSIONS: {missions.filter(m => m.completed).length}/4
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`border-2 rounded-lg p-2 transition-all duration-300 ${
                  mission.completed 
                    ? 'border-cyan-400 bg-cyan-900/30' 
                    : 'border-gray-700 bg-gray-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <motion.div
                    animate={mission.completed ? { 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={mission.completed ? { 
                      duration: 2, 
                      repeat: Infinity,
                      repeatDelay: 3 
                    } : {}}
                  >
                    <mission.icon className={`w-4 h-4 ${
                      mission.completed ? 'text-cyan-400' : 'text-gray-600'
                    }`} />
                  </motion.div>
                  {mission.completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    </motion.div>
                  ) : (
                    <Lock className="w-3 h-3 text-gray-600" />
                  )}
                </div>
                <h3 className={`font-black text-xs ${
                  mission.completed ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  {mission.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}