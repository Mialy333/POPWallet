import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Lock, Coffee, Home as HomeIcon, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const getMarkerIcon = (category) => {
  const iconMap = {
    meal: '🍔',
    housing: '🏠',
    study: '🎓'
  };
  return iconMap[category] || '📍';
};

export default function MapExplorer({ converterUsed, cityData }) {
  if (!converterUsed) {
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
            <p className="text-gray-500 font-bold">Complete Mission 2 to unlock the map!</p>
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
      <Card className="bg-black/40 backdrop-blur-sm border-2 border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300">
        <CardHeader className="p-3 border-b-2 border-cyan-500/30">
          <CardTitle className="flex items-center gap-2 text-base text-cyan-400 font-black">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Map className="w-5 h-5" />
            </motion.div>
            {cityData.name.toUpperCase()} 
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              {cityData.flag}
            </motion.span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {[
              { icon: Coffee, label: 'MEALS', color: 'yellow' },
              { icon: HomeIcon, label: 'HOUSING', color: 'blue' },
              { icon: BookOpen, label: 'STUDY', color: 'green' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className={`px-2 py-1 bg-${item.color}-500/20 border border-${item.color}-500 rounded-full flex items-center gap-1 cursor-pointer`}
              >
                <item.icon className={`w-3 h-3 text-${item.color}-400`} />
                <span className={`text-${item.color}-400 text-xs font-bold`}>{item.label}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-64 rounded-xl overflow-hidden border-2 border-cyan-500/30"
          >
            {typeof window !== 'undefined' && (
              <MapContainer
                center={cityData.coords}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cityData.spots.map((spot) => (
                  <Marker key={spot.id} position={spot.coords}>
                    <Popup>
                      <div className="font-bold text-xs">
                        {getMarkerIcon(spot.category)} {spot.name}
                      </div>
                      <div className="text-xs text-gray-700">{spot.description}</div>
                      <div className="text-xs font-bold text-green-600 mt-1">
                        💰 {spot.price}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </motion.div>

          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {cityData.spots.map((spot, index) => (
              <motion.div 
                key={spot.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-gray-900/50 border border-gray-700 rounded-lg p-2 hover:border-cyan-400 transition-all cursor-pointer"
              >
                <p className="text-cyan-400 font-bold text-xs mb-1">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                    className="inline-block"
                  >
                    {getMarkerIcon(spot.category)}
                  </motion.span> {spot.name}
                </p>
                <p className="text-xs text-gray-400">{spot.description}</p>
                <p className="text-xs text-green-400 font-bold mt-1">💰 {spot.price}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}