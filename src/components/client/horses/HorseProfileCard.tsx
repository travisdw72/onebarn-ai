import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Activity } from 'lucide-react';
import { StatusIndicator } from '../common/StatusIndicator';
import { clientDashboardConfig } from '../../../config/clientDashboardData';
import type { IClientHorse } from '../../../interfaces/ClientTypes';

interface IHorseProfileCardProps {
  horse: IClientHorse;
  delay?: number;
}

export const HorseProfileCard: React.FC<IHorseProfileCardProps> = ({
  horse,
  delay = 0
}) => {
  const getStatusForDisplay = (status: string): 'active' | 'warning' | 'inactive' => {
    switch (status) {
      case 'active':
        return 'active';
      case 'training':
        return 'warning';
      case 'recovery':
      case 'retired':
        return 'inactive';
      default:
        return 'active';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-3xl p-6 shadow-lg border border-sterling-silver/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-stable-mahogany">{horse.name}</h3>
          <p className="text-sm text-midnight-black/70">{horse.breed} • {horse.age} years old</p>
        </div>
        <StatusIndicator status={getStatusForDisplay(horse.status)} size="sm" />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-midnight-black/70">
          <span>Location: {horse.stallLocation}</span>
          <span>Last activity: {horse.lastActivity}</span>
        </div>
      </div>

      {/* Horse Photo Placeholder */}
      <div className="bg-arena-sand rounded-2xl aspect-video mb-4 flex items-center justify-center">
        <div className="text-center text-stable-mahogany">
          <div className="text-4xl mb-2">🐎</div>
          <p className="text-sm opacity-75">{horse.name}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {horse.cameraId && (
          <button className="flex-1 bg-stable-mahogany text-arena-sand py-2 px-4 rounded-lg font-semibold hover:bg-stable-mahogany/90 transition-colors flex items-center justify-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>{clientDashboardConfig.buttons.watchLive}</span>
          </button>
        )}
        
        <button className="flex-1 bg-arena-sand text-stable-mahogany py-2 px-4 rounded-lg font-semibold border border-stable-mahogany/20 hover:bg-arena-sand/70 transition-colors flex items-center justify-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>{clientDashboardConfig.buttons.healthReport}</span>
        </button>
      </div>
    </motion.div>
  );
}; 