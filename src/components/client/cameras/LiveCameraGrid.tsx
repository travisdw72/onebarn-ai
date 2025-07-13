import React from 'react';
import { motion } from 'framer-motion';
import { CameraFeedCard } from './CameraFeedCard';
import { clientDashboardData } from '../../../config/clientDashboardData';

export const LiveCameraGrid: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {clientDashboardData.cameras.map((camera, index) => (
        <CameraFeedCard 
          key={camera.id} 
          camera={camera} 
          delay={index * 0.1}
        />
      ))}
    </motion.div>
  );
}; 