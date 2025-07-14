/**
 * GestureManager Component
 * Handles swipe actions, long press detection, haptic feedback for barn environments
 * Optimized for one-handed operation and glove-friendly gestures
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { IMobileCapabilities } from './MobileDetector';

export interface IGestureEvent {
  type: 'swipe' | 'longPress' | 'doubleTap' | 'tap' | 'pinch';
  direction?: 'left' | 'right' | 'up' | 'down';
  target: HTMLElement;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  duration: number;
  distance: number;
  velocity: number;
  touches: number;
  data?: any;
}

export interface IGestureAction {
  id: string;
  gesture: 'swipe' | 'longPress' | 'doubleTap' | 'tap';
  direction?: 'left' | 'right' | 'up' | 'down';
  handler: (event: IGestureEvent) => void;
  icon?: React.ReactNode;
  label?: string;
  hapticPattern?: number[];
  cooldown?: number;
}

export interface IGestureManagerProps {
  children: React.ReactNode;
  capabilities: IMobileCapabilities;
  actions?: IGestureAction[];
  enableSwipe?: boolean;
  enableLongPress?: boolean;
  enableDoubleTap?: boolean;
  enableHaptics?: boolean;
  className?: string;
  onGesture?: (event: IGestureEvent) => void;
}

export const GestureManager: React.FC<IGestureManagerProps> = ({
  children,
  capabilities,
  actions = [],
  enableSwipe = true,
  enableLongPress = true,
  enableDoubleTap = true,
  enableHaptics = true,
  className = '',
  onGesture
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number; time: number } | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [doubleTapTimer, setDoubleTapTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastTap, setLastTap] = useState<{ x: number; y: number; time: number } | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [activeGesture, setActiveGesture] = useState<string | null>(null);
  const [actionCooldowns, setActionCooldowns] = useState<Map<string, number>>(new Map());

  // Haptic feedback function
  const vibrate = useCallback((pattern: number[] = [50]) => {
    if (enableHaptics && capabilities.supportsVibration && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [enableHaptics, capabilities.supportsVibration]);

  // Get gesture thresholds from config
  const getGestureThresholds = useCallback(() => {
    const base = {
      swipeThreshold: parseInt(brandConfig.mobile.gestures.swipeThreshold),
      longPressDelay: parseInt(brandConfig.mobile.gestures.longPressDelay),
      doubleTapDelay: parseInt(brandConfig.mobile.gestures.doubleTapDelay),
      tapTolerance: 10,
      velocityThreshold: 0.3
    };

    // Adjust thresholds based on capabilities
    if (capabilities.gloveMode) {
      base.swipeThreshold *= 0.8; // Reduce threshold for gloves
      base.longPressDelay *= 1.2; // Increase delay for gloves
      base.tapTolerance *= 1.5; // Increase tolerance
    }

    return base;
  }, [capabilities.gloveMode]);

  // Calculate gesture metrics
  const calculateGestureMetrics = useCallback((
    start: { x: number; y: number; time: number },
    end: { x: number; y: number; time: number }
  ) => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const duration = end.time - start.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / duration;

    let direction: 'left' | 'right' | 'up' | 'down' | undefined;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return { deltaX, deltaY, duration, distance, velocity, direction };
  }, []);

  // Execute gesture action
  const executeGestureAction = useCallback((event: IGestureEvent) => {
    const matchingAction = actions.find(action => {
      if (action.gesture !== event.type) return false;
      if (action.direction && action.direction !== event.direction) return false;
      return true;
    });

    if (matchingAction) {
      // Check cooldown
      const now = Date.now();
      const lastExecution = actionCooldowns.get(matchingAction.id) || 0;
      const cooldown = matchingAction.cooldown || 200;
      
      if (now - lastExecution < cooldown) {
        return;
      }

      // Update cooldown
      setActionCooldowns(prev => new Map(prev).set(matchingAction.id, now));

      // Haptic feedback
      if (matchingAction.hapticPattern) {
        vibrate(matchingAction.hapticPattern);
      } else {
        vibrate(brandConfig.mobile.haptics.patterns.success);
      }

      // Execute action
      matchingAction.handler(event);
    }

    // Global gesture handler
    onGesture?.(event);
  }, [actions, actionCooldowns, onGesture, vibrate]);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startPoint = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    
    setTouchStart(startPoint);
    setTouchEnd(null);
    setActiveGesture('touch-start');

    // Clear any existing timers
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
    if (doubleTapTimer) {
      clearTimeout(doubleTapTimer);
    }

    // Start long press timer
    if (enableLongPress) {
      const timer = setTimeout(() => {
        setIsLongPressing(true);
        setActiveGesture('long-press');
        
        const longPressEvent: IGestureEvent = {
          type: 'longPress',
          target: e.target as HTMLElement,
          startPoint: { x: startPoint.x, y: startPoint.y },
          endPoint: { x: startPoint.x, y: startPoint.y },
          duration: Date.now() - startPoint.time,
          distance: 0,
          velocity: 0,
          touches: e.touches.length
        };

        executeGestureAction(longPressEvent);
      }, getGestureThresholds().longPressDelay);
      
      setLongPressTimer(timer);
    }
  }, [enableLongPress, longPressTimer, doubleTapTimer, getGestureThresholds, executeGestureAction]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || isLongPressing) return;

    const touch = e.touches[0];
    const currentPoint = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    
    const metrics = calculateGestureMetrics(touchStart, currentPoint);
    
    // Cancel long press if movement is too much
    if (metrics.distance > getGestureThresholds().tapTolerance) {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      setIsLongPressing(false);
      setActiveGesture('swipe');
    }

    setTouchEnd(currentPoint);
  }, [touchStart, isLongPressing, longPressTimer, calculateGestureMetrics, getGestureThresholds]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const endPoint = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    
    // Clear timers
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    // If it was a long press, don't process further
    if (isLongPressing) {
      setIsLongPressing(false);
      setActiveGesture(null);
      return;
    }

    const metrics = calculateGestureMetrics(touchStart, endPoint);
    const thresholds = getGestureThresholds();

    // Determine gesture type
    if (metrics.distance > thresholds.swipeThreshold && enableSwipe) {
      // Swipe gesture
      const swipeEvent: IGestureEvent = {
        type: 'swipe',
        direction: metrics.direction,
        target: e.target as HTMLElement,
        startPoint: { x: touchStart.x, y: touchStart.y },
        endPoint: { x: endPoint.x, y: endPoint.y },
        duration: metrics.duration,
        distance: metrics.distance,
        velocity: metrics.velocity,
        touches: e.touches.length
      };

      executeGestureAction(swipeEvent);
      setActiveGesture('swipe');
    } else if (metrics.distance <= thresholds.tapTolerance) {
      // Tap or double tap
      const tapEvent: IGestureEvent = {
        type: 'tap',
        target: e.target as HTMLElement,
        startPoint: { x: touchStart.x, y: touchStart.y },
        endPoint: { x: endPoint.x, y: endPoint.y },
        duration: metrics.duration,
        distance: metrics.distance,
        velocity: metrics.velocity,
        touches: e.touches.length
      };

      if (enableDoubleTap && lastTap) {
        const timeSinceLastTap = endPoint.time - lastTap.time;
        const distanceFromLastTap = Math.sqrt(
          Math.pow(endPoint.x - lastTap.x, 2) + Math.pow(endPoint.y - lastTap.y, 2)
        );

        if (timeSinceLastTap < thresholds.doubleTapDelay && distanceFromLastTap < thresholds.tapTolerance) {
          // Double tap
          const doubleTapEvent: IGestureEvent = {
            ...tapEvent,
            type: 'doubleTap'
          };

          executeGestureAction(doubleTapEvent);
          setActiveGesture('double-tap');
          setLastTap(null);
          return;
        }
      }

      // Single tap
      executeGestureAction(tapEvent);
      setActiveGesture('tap');
      setLastTap(endPoint);

      // Clear double tap timer
      if (doubleTapTimer) {
        clearTimeout(doubleTapTimer);
      }

      const timer = setTimeout(() => {
        setLastTap(null);
      }, thresholds.doubleTapDelay);

      setDoubleTapTimer(timer);
    }

    // Reset states
    setTouchStart(null);
    setTouchEnd(null);
    
    // Clear active gesture after a delay
    setTimeout(() => {
      setActiveGesture(null);
    }, 100);
  }, [
    touchStart,
    isLongPressing,
    longPressTimer,
    doubleTapTimer,
    lastTap,
    enableSwipe,
    enableDoubleTap,
    calculateGestureMetrics,
    getGestureThresholds,
    executeGestureAction
  ]);

  // Handle context menu (disable on touch devices)
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (capabilities.isTouchDevice) {
      e.preventDefault();
    }
  }, [capabilities.isTouchDevice]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
      if (doubleTapTimer) {
        clearTimeout(doubleTapTimer);
      }
    };
  }, [longPressTimer, doubleTapTimer]);

  // Component styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    touchAction: 'manipulation',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...(activeGesture && {
      background: 'rgba(139, 69, 19, 0.1)',
      transition: 'background 0.2s ease'
    })
  };

  return (
    <div
      ref={containerRef}
      className={`gesture-manager ${className} ${activeGesture ? `gesture-${activeGesture}` : ''}`}
      style={containerStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
    >
      {children}
    </div>
  );
};

// Hook for easier usage
export const useGestureManager = (
  capabilities: IMobileCapabilities,
  actions: IGestureAction[] = []
) => {
  const [gestureEvent, setGestureEvent] = useState<IGestureEvent | null>(null);
  const [activeGesture, setActiveGesture] = useState<string | null>(null);

  const handleGesture = useCallback((event: IGestureEvent) => {
    setGestureEvent(event);
    setActiveGesture(`${event.type}-${event.direction || 'none'}`);
    
    // Clear after a delay
    setTimeout(() => {
      setActiveGesture(null);
    }, 1000);
  }, []);

  return {
    gestureEvent,
    activeGesture,
    GestureManager: (props: Omit<IGestureManagerProps, 'capabilities' | 'actions' | 'onGesture'>) => (
      <GestureManager
        {...props}
        capabilities={capabilities}
        actions={actions}
        onGesture={handleGesture}
      />
    )
  };
};

// Common gesture actions for equestrian environment
export const createHorseCardGestures = (
  horseId: string,
  onQuickActions: (horseId: string) => void,
  onViewDetails: (horseId: string) => void,
  onRefresh: () => void,
  onFullscreen: () => void
): IGestureAction[] => [
  {
    id: `horse-${horseId}-quick-actions`,
    gesture: 'swipe',
    direction: 'left',
    handler: () => onQuickActions(horseId),
    icon: '⚡',
    label: 'Quick Actions',
    hapticPattern: [100, 50, 100]
  },
  {
    id: `horse-${horseId}-details`,
    gesture: 'swipe',
    direction: 'right',
    handler: () => onViewDetails(horseId),
    icon: '👁️',
    label: 'View Details',
    hapticPattern: [150]
  },
  {
    id: `horse-${horseId}-refresh`,
    gesture: 'swipe',
    direction: 'down',
    handler: onRefresh,
    icon: '🔄',
    label: 'Refresh',
    hapticPattern: [50, 30, 50]
  },
  {
    id: `horse-${horseId}-fullscreen`,
    gesture: 'swipe',
    direction: 'up',
    handler: onFullscreen,
    icon: '🔍',
    label: 'Fullscreen',
    hapticPattern: [200]
  },
  {
    id: `horse-${horseId}-menu`,
    gesture: 'longPress',
    handler: () => onQuickActions(horseId),
    icon: '📋',
    label: 'Menu',
    hapticPattern: [100, 50, 100, 50, 100]
  }
];

// Emergency gesture actions
export const createEmergencyGestures = (
  onEmergencyCall: (type: string) => void,
  onEmergencyRecord: () => void,
  onEmergencyAlert: () => void
): IGestureAction[] => [
  {
    id: 'emergency-call-vet',
    gesture: 'doubleTap',
    handler: () => onEmergencyCall('veterinarian'),
    icon: '🚨',
    label: 'Call Vet',
    hapticPattern: [300, 200, 300, 200, 300]
  },
  {
    id: 'emergency-record',
    gesture: 'longPress',
    handler: onEmergencyRecord,
    icon: '📹',
    label: 'Emergency Record',
    hapticPattern: [500, 100, 500]
  },
  {
    id: 'emergency-alert-staff',
    gesture: 'swipe',
    direction: 'up',
    handler: onEmergencyAlert,
    icon: '📢',
    label: 'Alert Staff',
    hapticPattern: [200, 100, 200, 100, 200]
  }
];

// Utility functions
export const getGestureDescription = (event: IGestureEvent): string => {
  const { type, direction, distance, velocity } = event;
  
  const descriptions = {
    tap: 'Tap',
    doubleTap: 'Double Tap',
    longPress: 'Long Press',
    swipe: `Swipe ${direction}`,
    pinch: 'Pinch'
  };

  let description = descriptions[type] || type;
  
  if (type === 'swipe') {
    description += ` (${Math.round(distance)}px, ${velocity.toFixed(1)}px/ms)`;
  }

  return description;
};

export const isGestureValid = (event: IGestureEvent, capabilities: IMobileCapabilities): boolean => {
  const thresholds = {
    minSwipeDistance: capabilities.gloveMode ? 30 : 50,
    maxTapDistance: capabilities.gloveMode ? 15 : 10,
    minVelocity: capabilities.gloveMode ? 0.2 : 0.3
  };

  switch (event.type) {
    case 'swipe':
      return event.distance >= thresholds.minSwipeDistance && 
             event.velocity >= thresholds.minVelocity;
    case 'tap':
    case 'doubleTap':
      return event.distance <= thresholds.maxTapDistance;
    case 'longPress':
      return event.distance <= thresholds.maxTapDistance;
    default:
      return true;
  }
}; 