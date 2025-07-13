import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Play, Pause, Settings } from 'lucide-react';
import { StatusIndicator } from '../common/StatusIndicator';
import { clientDashboardConfig } from '../../../config/clientDashboardData';
import type { ICameraFeed } from '../../../interfaces/ClientTypes';

interface ICameraFeedCardProps {
  camera: ICameraFeed;
  delay?: number;
}

export const CameraFeedCard: React.FC<ICameraFeedCardProps> = ({
  camera,
  delay = 0
}) => {
  const getStatusForDisplay = (status: string): 'online' | 'offline' | 'maintenance' => {
    return status as 'online' | 'offline' | 'maintenance';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-3xl p-6 shadow-lg border border-sterling-silver/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-stable-mahogany">{camera.name}</h3>
          <p className="text-sm text-midnight-black/70">{camera.location}</p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIndicator status={getStatusForDisplay(camera.status)} size="sm" />
          <span className="text-xs text-midnight-black/50">{camera.quality}</span>
        </div>
      </div>

      {/* Camera Feed Placeholder */}
      <div className="bg-midnight-black rounded-2xl aspect-video mb-4 flex items-center justify-center">
        <div className="text-center text-arena-sand">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm opacity-75">Live Feed</p>
          {camera.horseId && (
            <p className="text-xs opacity-60 mt-1">
              {clientDashboardConfig.messages.currentlyVisible.replace('{cameraName}', camera.name)}
            </p>
          )}
        </div>
      </div>

      {/* Camera Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button className="bg-stable-mahogany text-arena-sand p-2 rounded-lg hover:bg-stable-mahogany/90 transition-colors">
            <Play className="w-4 h-4" />
          </button>
          <button className="bg-arena-sand text-stable-mahogany p-2 rounded-lg border border-stable-mahogany/20 hover:bg-arena-sand/70 transition-colors">
            <Pause className="w-4 h-4" />
          </button>
          <button className="bg-arena-sand text-stable-mahogany p-2 rounded-lg border border-stable-mahogany/20 hover:bg-arena-sand/70 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Camera Features */}
      <div>
        <h4 className="text-sm font-semibold text-stable-mahogany mb-2">Features</h4>
        <div className="flex flex-wrap gap-2">
          {camera.features.map((feature, index) => (
            <span 
              key={index}
              className="text-xs bg-arena-sand/50 text-stable-mahogany px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {camera.isPremium && (
        <div className="mt-4 p-3 bg-champion-gold/10 border border-champion-gold/20 rounded-lg">
          <p className="text-xs text-stable-mahogany font-medium">
            🌟 Premium Feature
          </p>
        </div>
      )}
    </motion.div>
  );
}; 