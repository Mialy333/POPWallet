import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function CitySelector({ selectedCity, onCityChange, cities }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-4"
    >
      <Card className="bg-black/40 backdrop-blur-sm border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300">
        <CardContent className="p-3">
          <Label className="text-purple-400 font-bold text-xs mb-2 flex items-center gap-1">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🏙️
            </motion.span>
            STUDY CITY
          </Label>
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger className="border-2 border-purple-500/50 bg-black/50 text-purple-100 h-10 font-bold text-sm hover:border-purple-400 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-2 border-purple-500">
              {Object.entries(cities).map(([key, data]) => (
                <SelectItem key={key} value={key} className="text-purple-100 font-bold text-sm">
                  <motion.span
                    whileHover={{ scale: 1.2 }}
                    className="inline-block"
                  >
                    {data.flag}
                  </motion.span> {data.name} (€{data.avgCost}/mo)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </motion.div>
  );
}