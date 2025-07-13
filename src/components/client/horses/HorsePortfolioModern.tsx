import React from 'react';
import { motion } from 'framer-motion';
import { HorseProfileCard } from './HorseProfileCard';
import { clientDashboardData } from '../../../config/clientDashboardData';

export const HorsePortfolioModern: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {clientDashboardData.horses.map((horse, index) => (
        <HorseProfileCard 
          key={horse.id} 
          horse={horse} 
          delay={index * 0.1}
        />
      ))}
    </motion.div>
  );
}; 