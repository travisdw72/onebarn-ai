import React from 'react';
import { motion } from 'framer-motion';

interface IAnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
  variant?: 'default' | 'hover' | 'press';
}

export const AnimatedCard: React.FC<IAnimatedCardProps> = ({
  children,
  className = '',
  onClick,
  delay = 0,
  variant = 'default'
}) => {
  const baseProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.3 }
  };

  const hoverProps = variant === 'hover' ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { delay, duration: 0.3, type: 'spring' as const, stiffness: 300 }
  } : {};

  const tapProps = variant === 'press' ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <motion.div
      {...baseProps}
      {...hoverProps}
      {...tapProps}
      className={`bg-white rounded-3xl shadow-lg border border-sterling-silver/20 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}; 