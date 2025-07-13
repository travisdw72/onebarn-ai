import React from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Share, Calendar, Clock } from 'lucide-react';
import { clientDashboardData, clientDashboardConfig } from '../../../config/clientDashboardData';
import type { IRecording } from '../../../interfaces/ClientTypes';

interface IRecordingCardProps {
  recording: IRecording;
  delay?: number;
}

const RecordingCard: React.FC<IRecordingCardProps> = ({ recording, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-3xl p-6 shadow-lg border border-sterling-silver/20"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-stable-mahogany">{recording.title}</h3>
          <p className="text-sm text-midnight-black/70">{recording.cameraName}</p>
        </div>
        <span className="text-xs bg-arena-sand text-stable-mahogany px-2 py-1 rounded">
          {recording.duration}
        </span>
      </div>

      {/* Recording Thumbnail Placeholder */}
      <div className="bg-midnight-black rounded-2xl aspect-video mb-4 flex items-center justify-center">
        <div className="text-center text-arena-sand">
          <div className="text-4xl mb-2">🎥</div>
          <p className="text-sm opacity-75">Recording Preview</p>
        </div>
      </div>

      {/* Recording Details */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-midnight-black/70">
          <Calendar className="w-4 h-4" />
          <span>{recording.date}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-midnight-black/70">
          <Clock className="w-4 h-4" />
          <span>{recording.startTime} - {recording.endTime}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-stable-mahogany text-arena-sand py-2 px-3 rounded-lg font-semibold hover:bg-stable-mahogany/90 transition-colors flex items-center justify-center space-x-2">
          <Play className="w-4 h-4" />
          <span>{clientDashboardConfig.buttons.play}</span>
        </button>
        
        {recording.isDownloadable && (
          <button className="bg-arena-sand text-stable-mahogany py-2 px-3 rounded-lg font-semibold border border-stable-mahogany/20 hover:bg-arena-sand/70 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        )}
        
        <button className="bg-arena-sand text-stable-mahogany py-2 px-3 rounded-lg font-semibold border border-stable-mahogany/20 hover:bg-arena-sand/70 transition-colors">
          <Share className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const RecordingsList: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stable-mahogany">
          {clientDashboardConfig.headers.recordedFootage}
        </h2>
        <div className="flex space-x-2">
          <button className="bg-arena-sand text-stable-mahogany px-4 py-2 rounded-lg font-semibold border border-stable-mahogany/20 hover:bg-arena-sand/70 transition-colors">
            {clientDashboardConfig.buttons.filterByDate}
          </button>
          <button className="bg-stable-mahogany text-arena-sand px-4 py-2 rounded-lg font-semibold hover:bg-stable-mahogany/90 transition-colors">
            {clientDashboardConfig.buttons.downloadAll}
          </button>
        </div>
      </div>

      {/* Recordings Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {clientDashboardData.recordings.map((recording, index) => (
          <RecordingCard 
            key={recording.id} 
            recording={recording} 
            delay={index * 0.1}
          />
        ))}
      </motion.div>
    </div>
  );
}; 