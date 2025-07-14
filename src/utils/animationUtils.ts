// Animation utilities for the coin flip effect

export const coinFlipEasing = {
  // Custom easing curve for realistic coin physics
  realistic: "easeInOut" as const,
  // Bouncy effect for settling
  bouncy: "anticipate" as const,
  // Smooth entrance
  smooth: "easeOut" as const
} as const;

export const animationDurations = {
  quick: 0.8,
  normal: 1.5,
  slow: 2.5,
  epic: 3.5
} as const;

export const coinFlipVariants = {
  // Quick flip for header/smaller logos
  quick: {
    initial: { rotateY: 0, scale: 1, opacity: 0.9 },
    animate: {
      rotateY: [0, 180, 360],
      scale: [1, 1.05, 1],
      opacity: [0.9, 1, 1],
      transition: {
        duration: animationDurations.quick,
        times: [0, 0.5, 1],
        ease: coinFlipEasing.realistic,
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 180,
      transition: { duration: 0.4, ease: coinFlipEasing.smooth }
    }
  },
  
  // Epic flip for hero sections
  epic: {
    initial: { rotateY: 0, scale: 1, opacity: 0.8 },
    animate: {
      rotateY: [0, 180, 360, 540, 720, 800, 720],
      scale: [1, 1.15, 1.08, 1.15, 1.08, 1.03, 1],
      opacity: [0.8, 1, 1, 1, 1, 1, 1],
      transition: {
        duration: animationDurations.epic,
        times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
        ease: coinFlipEasing.realistic,
      }
    },
    hover: {
      scale: 1.08,
      rotateY: 360,
      transition: { duration: 0.6, ease: coinFlipEasing.bouncy }
    }
  },
  
  // Standard flip for general use
  standard: {
    initial: { rotateY: 0, scale: 1, opacity: 0.9 },
    animate: {
      rotateY: [0, 180, 360, 540, 720],
      scale: [1, 1.08, 1.03, 1.08, 1],
      opacity: [0.9, 1, 1, 1, 1],
      transition: {
        duration: animationDurations.normal,
        times: [0, 0.25, 0.5, 0.75, 1],
        ease: coinFlipEasing.realistic,
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 360,
      transition: { duration: 0.5, ease: coinFlipEasing.smooth }
    }
  }
} as const;

export const glowVariants = {
  subtle: {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: [0, 0.2, 0.4, 0.2, 0],
      scale: [0.9, 1.1, 1.2, 1.1, 1],
      transition: { duration: animationDurations.normal, ease: coinFlipEasing.smooth }
    }
  },
  
  intense: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: [0, 0.3, 0.6, 0.3, 0],
      scale: [0.8, 1.2, 1.4, 1.2, 1],
      transition: { duration: animationDurations.epic, ease: coinFlipEasing.smooth }
    }
  }
} as const;

// Optional: Function to play sound effect (if audio files are available)
export const playFlipSound = () => {
  try {
    const audio = new Audio('/sounds/coin-flip.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fail silently if sound can't play
    });
  } catch {
    // Fail silently if audio not available
  }
};

// Animation presets based on context
export const getAnimationPreset = (variant: 'hero' | 'header' | 'mobile') => {
  switch (variant) {
    case 'hero':
      return {
        coinFlip: coinFlipVariants.epic,
        glow: glowVariants.intense,
        duration: animationDurations.epic
      };
    case 'header':
      return {
        coinFlip: coinFlipVariants.standard,
        glow: glowVariants.subtle,
        duration: animationDurations.normal
      };
    case 'mobile':
      return {
        coinFlip: coinFlipVariants.quick,
        glow: glowVariants.subtle,
        duration: animationDurations.quick
      };
    default:
      return {
        coinFlip: coinFlipVariants.standard,
        glow: glowVariants.subtle,
        duration: animationDurations.normal
      };
  }
}; 