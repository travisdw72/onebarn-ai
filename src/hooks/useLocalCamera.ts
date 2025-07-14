/**
 * 💼 BUSINESS PARTNER GUIDE - LOCAL CAMERA HOOK
 * 
 * This React hook provides a clean interface for camera functionality in demo components.
 * It manages camera permissions, device enumeration, and stream handling for business partners.
 * 
 * DEMO FEATURES:
 * - Real-time camera device detection
 * - Automatic permission management
 * - Stream lifecycle management
 * - Error handling and recovery
 * - Device switching capabilities
 * 
 * BUSINESS PARTNER USAGE:
 * ```typescript
 * const { 
 *   devices, 
 *   streams, 
 *   permissions, 
 *   requestPermissions,
 *   startCamera,
 *   switchCamera 
 * } = useLocalCamera();
 * ```
 * 
 * INTEGRATION EXAMPLE:
 * - Import hook in LiveVideoGrid component
 * - Use streams to display real camera feeds
 * - Handle permissions and device selection
 * - Provide professional demo experience
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGetIdentity } from '@refinedev/core';
import CameraService from '../services/CameraService';
import { 
  IDemoCameraDevice, 
  ICameraStream, 
  ICameraPermissions,
  ICameraError,
  IUseCameraProps,
  IUseCameraReturn 
} from '../interfaces/CameraTypes';

export const useLocalCamera = (props: IUseCameraProps = {}): IUseCameraReturn => {
  // 🎯 DEMO ACCOUNT VALIDATION - Use prop first, fallback to identity
  let isDemoAccount = props.isDemoAccount || false;
  
  // Only use useGetIdentity if explicitly enabled and not provided via props
  let identity = null;
  try {
    if (!props.isDemoAccount && props.useRefineIdentity !== false) {
      const { data } = useGetIdentity();
      identity = data;
      isDemoAccount = (identity as any)?.email === 'demo@onevault.ai';
    }
  } catch (error) {
    // Gracefully handle cases where QueryClient isn't available
    console.warn('[useLocalCamera] QueryClient not available, using props.isDemoAccount');
    isDemoAccount = props.isDemoAccount || false;
  }
  
  // 📱 CAMERA STATE MANAGEMENT
  const [devices, setDevices] = useState<IDemoCameraDevice[]>([]);
  const [streams, setStreams] = useState<ICameraStream[]>([]);
  const [permissions, setPermissions] = useState<ICameraPermissions>({
    camera: 'prompt',
    microphone: 'prompt',
    lastChecked: new Date(),
    canRequest: true,
    userGestureRequired: false,
    browserSupported: true,
    httpsRequired: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ICameraError[]>([]);
  
  // 🔄 SERVICE REFERENCE
  const cameraService = useRef(CameraService);
  const isInitialized = useRef(false);
  
  // 🎧 EVENT HANDLERS
  const handleDevicesChanged = useCallback((newDevices: IDemoCameraDevice[]) => {
    setDevices(newDevices);
    props.onDeviceChange?.(newDevices);
  }, [props.onDeviceChange]);
  
  const handlePermissionsChanged = useCallback((newPermissions: ICameraPermissions) => {
    setPermissions(newPermissions);
    props.onPermissionChange?.(newPermissions);
  }, [props.onPermissionChange]);
  
  const handleStreamStarted = useCallback((stream: ICameraStream) => {
    setStreams(prev => [...prev, stream]);
    props.onStreamChange?.(streams);
  }, [props.onStreamChange, streams]);
  
  const handleStreamStopped = useCallback((streamId: string) => {
    setStreams(prev => prev.filter(stream => stream.id !== streamId));
    props.onStreamChange?.(streams);
  }, [props.onStreamChange, streams]);
  
  const handleError = useCallback((error: ICameraError) => {
    setErrors(prev => [...prev, error]);
    props.onError?.(error);
  }, [props.onError]);
  
  const handleLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);
  
  // 🚀 INITIALIZATION EFFECT
  useEffect(() => {
    if (!isDemoAccount || isInitialized.current) {
      return;
    }
    
    const initializeCamera = async () => {
      try {
        // 📝 BUSINESS PARTNER LOG
        console.log('[useLocalCamera] Initializing camera for demo account');
        
        // 🎧 SETUP EVENT LISTENERS
        cameraService.current.on('devicesChanged', handleDevicesChanged);
        cameraService.current.on('permissionsChanged', handlePermissionsChanged);
        cameraService.current.on('streamStarted', handleStreamStarted);
        cameraService.current.on('streamStopped', handleStreamStopped);
        cameraService.current.on('error', handleError);
        cameraService.current.on('loading', handleLoading);
        
        // 🚀 INITIALIZE SERVICE
        const initialized = await cameraService.current.initialize((identity as any)?.email || '');
        
        if (initialized) {
          // 📊 LOAD INITIAL STATE
          const initialState = cameraService.current.getState();
          setDevices(initialState.availableDevices);
          setPermissions(initialState.permissions);
          setStreams(initialState.activeStreams ? Array.from(initialState.activeStreams.values()) : []);
          setErrors(initialState.errors);
          setIsLoading(initialState.isLoading);
          
          // 🎬 AUTO-START IF REQUESTED
          if (props.autoStart) {
            const defaultDevice = cameraService.current.getDefaultDevice();
            if (defaultDevice) {
              await startCamera(defaultDevice.deviceId);
            }
          }
          
          isInitialized.current = true;
          console.log('[useLocalCamera] Camera initialized successfully');
        }
        
      } catch (error) {
        console.error('[useLocalCamera] Initialization failed:', error);
        handleError({
          code: 'HOOK_INITIALIZATION_FAILED',
          message: 'Failed to initialize camera hook',
          severity: 'high',
          category: 'device',
          businessPartnerMessage: 'Camera setup failed during initialization',
          resolution: 'Please refresh the page and try again',
          technicalDetails: error instanceof Error ? error.toString() : 'Unknown error'
        });
      }
    };
    
    initializeCamera();
    
    // 🧹 CLEANUP ON UNMOUNT
    return () => {
      if (isInitialized.current) {
        cameraService.current.off('devicesChanged', handleDevicesChanged);
        cameraService.current.off('permissionsChanged', handlePermissionsChanged);
        cameraService.current.off('streamStarted', handleStreamStarted);
        cameraService.current.off('streamStopped', handleStreamStopped);
        cameraService.current.off('error', handleError);
        cameraService.current.off('loading', handleLoading);
        
        // 🛑 STOP ALL STREAMS
        streams.forEach(stream => {
          cameraService.current.stopCamera(stream.id);
        });
        
        isInitialized.current = false;
        console.log('[useLocalCamera] Camera hook cleanup complete');
      }
    };
  }, [isDemoAccount, (identity as any)?.email, props.autoStart, handleDevicesChanged, handlePermissionsChanged, handleStreamStarted, handleStreamStopped, handleError, handleLoading]);
  
  // 🔐 PERMISSION MANAGEMENT
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (!isDemoAccount) {
      console.log('[useLocalCamera] Permission request denied - not demo account');
      return false;
    }
    
    try {
      console.log('[useLocalCamera] Requesting camera permissions');
      const granted = await cameraService.current.requestPermissions();
      
      if (granted) {
        console.log('[useLocalCamera] Permissions granted successfully');
      } else {
        console.log('[useLocalCamera] Permissions denied');
      }
      
      return granted;
    } catch (error) {
      console.error('[useLocalCamera] Permission request failed:', error);
      return false;
    }
  }, [isDemoAccount]);
  
  // 🎬 CAMERA STREAM MANAGEMENT
  const startCamera = useCallback(async (deviceId: string): Promise<ICameraStream | null> => {
    if (!isDemoAccount) {
      console.log('[useLocalCamera] Camera start denied - not demo account');
      return null;
    }
    
    try {
      console.log('[useLocalCamera] Starting camera stream', { deviceId });
      const stream = await cameraService.current.startCamera(deviceId);
      
      if (stream) {
        console.log('[useLocalCamera] Camera stream started successfully', {
          streamId: stream.id,
          deviceId: stream.deviceId
        });
      }
      
      return stream;
    } catch (error) {
      console.error('[useLocalCamera] Camera start failed:', error);
      return null;
    }
  }, [isDemoAccount]);
  
  const stopCamera = useCallback(async (streamId: string): Promise<void> => {
    if (!isDemoAccount) {
      console.log('[useLocalCamera] Camera stop denied - not demo account');
      return;
    }
    
    try {
      console.log('[useLocalCamera] Stopping camera stream', { streamId });
      await cameraService.current.stopCamera(streamId);
      console.log('[useLocalCamera] Camera stream stopped successfully');
    } catch (error) {
      console.error('[useLocalCamera] Camera stop failed:', error);
    }
  }, [isDemoAccount]);
  
  const switchCamera = useCallback(async (deviceId: string): Promise<ICameraStream | null> => {
    if (!isDemoAccount) {
      console.log('[useLocalCamera] Camera switch denied - not demo account');
      return null;
    }
    
    try {
      console.log('[useLocalCamera] Switching camera device', { deviceId });
      const stream = await cameraService.current.switchCamera(deviceId);
      
      if (stream) {
        console.log('[useLocalCamera] Camera switched successfully', {
          streamId: stream.id,
          deviceId: stream.deviceId
        });
      }
      
      return stream;
    } catch (error) {
      console.error('[useLocalCamera] Camera switch failed:', error);
      return null;
    }
  }, [isDemoAccount]);
  
  // 🔄 DEVICE REFRESH
  const refreshDevices = useCallback(async (): Promise<void> => {
    if (!isDemoAccount) {
      console.log('[useLocalCamera] Device refresh denied - not demo account');
      return;
    }
    
    try {
      console.log('[useLocalCamera] Refreshing camera devices');
      await cameraService.current.refreshDevices();
      console.log('[useLocalCamera] Device refresh complete');
    } catch (error) {
      console.error('[useLocalCamera] Device refresh failed:', error);
    }
  }, [isDemoAccount]);
  
  // 🧹 ERROR MANAGEMENT
  const clearErrors = useCallback((): void => {
    setErrors([]);
    cameraService.current.clearErrors();
    console.log('[useLocalCamera] Errors cleared');
  }, []);
  
  // 🔍 UTILITY FUNCTIONS
  const getDeviceById = useCallback((deviceId: string): IDemoCameraDevice | null => {
    return devices.find(device => device.deviceId === deviceId) || null;
  }, [devices]);
  
  const getStreamById = useCallback((streamId: string): ICameraStream | null => {
    return streams.find(stream => stream.id === streamId) || null;
  }, [streams]);
  
  const isDeviceAvailable = useCallback((deviceId: string): boolean => {
    return devices.some(device => device.deviceId === deviceId && device.isAvailable);
  }, [devices]);
  
  const getDefaultDevice = useCallback((): IDemoCameraDevice | null => {
    return devices.find(device => device.isDefault) || devices[0] || null;
  }, [devices]);
  
  // 💼 BUSINESS PARTNER DEMO STATUS
  const isDemoModeActive = isDemoAccount && isInitialized.current;
  
  // 📝 DEVELOPMENT LOGGING
  useEffect(() => {
    if (isDemoAccount) {
      console.log('[useLocalCamera] Demo mode active', {
        devicesCount: devices.length,
        streamsCount: streams.length,
        permissionsGranted: permissions.camera === 'granted',
        errorsCount: errors.length,
        isLoading
      });
    }
  }, [isDemoAccount, devices.length, streams.length, permissions.camera, errors.length, isLoading]);
  
  // 🎯 RETURN HOOK INTERFACE
  return {
    // 📊 STATE
    devices: isDemoModeActive ? devices : [],
    streams: isDemoModeActive ? streams : [],
    permissions: isDemoModeActive ? permissions : {
      camera: 'prompt',
      microphone: 'prompt',
      lastChecked: new Date(),
      canRequest: false,
      userGestureRequired: false,
      browserSupported: false,
      httpsRequired: false
    },
    isLoading: isDemoModeActive ? isLoading : false,
    errors: isDemoModeActive ? errors : [],
    
    // 🎬 ACTIONS
    requestPermissions: isDemoModeActive ? requestPermissions : async () => false,
    startCamera: isDemoModeActive ? startCamera : async () => null,
    stopCamera: isDemoModeActive ? stopCamera : async () => {},
    switchCamera: isDemoModeActive ? switchCamera : async () => null,
    refreshDevices: isDemoModeActive ? refreshDevices : async () => {},
    clearErrors: isDemoModeActive ? clearErrors : () => {},
    
    // 🔍 UTILITIES
    getDeviceById: isDemoModeActive ? getDeviceById : () => null,
    getStreamById: isDemoModeActive ? getStreamById : () => null,
    isDeviceAvailable: isDemoModeActive ? isDeviceAvailable : () => false,
    getDefaultDevice: isDemoModeActive ? getDefaultDevice : () => null
  };
};

export default useLocalCamera; 