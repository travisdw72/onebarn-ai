/**
 * 💼 BUSINESS PARTNER GUIDE - CAMERA SERVICE
 * 
 * This service manages all WebRTC camera functionality for One Barn AI demo system.
 * It handles browser camera access, device enumeration, and stream management.
 * 
 * DEMO ACCOUNT FEATURES:
 * - Real-time camera access via WebRTC
 * - Multiple camera device support (webcam, phone, etc.)
 * - Professional demo-quality video streams
 * - Comprehensive error handling and troubleshooting
 * 
 * BUSINESS PARTNER USAGE:
 * 1. Service automatically detects available cameras
 * 2. Requests browser permissions when needed
 * 3. Provides high-quality video streams for AI analysis
 * 4. Handles device switching and error recovery
 * 
 * SETUP REQUIREMENTS:
 * - HTTPS connection (required for camera access)
 * - Modern browser with WebRTC support
 * - Camera permissions granted by user
 * - demo@onevault.ai account access
 */

import { 
  IDemoCameraDevice, 
  ICameraStream, 
  ICameraPermissions,
  ICameraError,
  ICameraServiceState,
  IDemoCameraConfig 
} from '../interfaces/CameraTypes';

export class CameraService {
  private static instance: CameraService;
  private state: ICameraServiceState;
  private config: IDemoCameraConfig;
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor() {
    // 🏗️ INITIAL STATE SETUP
    this.state = {
      isInitialized: false,
      availableDevices: [],
      activeStreams: new Map(),
      permissions: {
        camera: 'prompt',
        microphone: 'prompt',
        lastChecked: new Date(),
        canRequest: true,
        userGestureRequired: false,
        browserSupported: this.checkBrowserSupport(),
        httpsRequired: !this.isHttpsOrLocalhost()
      },
      errors: [],
      isLoading: false,
      isDemoMode: false
    };

    // 📹 DEFAULT DEMO CONFIGURATION
    this.config = {
      enableDemoMode: true,
      demoAccountEmail: 'demo@onevault.ai',
      preferredResolution: {
        width: 1280,
        height: 720
      },
      preferredFrameRate: 30,
      enableAudio: true,
      enableAutoSwitch: false,
      maxRetryAttempts: 3,
      retryDelay: 2000,
      enableDiagnostics: true,
      logLevel: 'info',
      showSetupWizard: true,
      showTroubleshooting: true,
      showPermissionHelp: true,
      showDeviceSelection: true
    };

    this.initializeEventListeners();
  }

  // 🎯 SINGLETON PATTERN - Ensures single camera service instance
  public static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  // 🚀 INITIALIZATION - Initialize camera service for demo account
  public async initialize(userEmail: string): Promise<boolean> {
    try {
      this.logInfo('Initializing camera service', { userEmail });
      
      // 💼 DEMO ACCOUNT VALIDATION
      if (!this.isDemoAccount(userEmail)) {
        this.logInfo('Camera service disabled - not demo account');
        return false;
      }

      this.state.isDemoMode = true;
      this.state.isLoading = true;
      this.emit('loading', true);

      // 🔍 BROWSER COMPATIBILITY CHECK
      if (!this.state.permissions.browserSupported) {
        this.addError({
          code: 'BROWSER_UNSUPPORTED',
          message: 'Browser does not support WebRTC camera access',
          severity: 'high',
          category: 'browser',
          businessPartnerMessage: 'Please use a modern browser (Chrome, Firefox, Safari, Edge)',
          resolution: 'Switch to a compatible browser'
        });
        return false;
      }

      // 🔒 HTTPS REQUIREMENT CHECK
      if (this.state.permissions.httpsRequired) {
        this.addError({
          code: 'HTTPS_REQUIRED',
          message: 'HTTPS connection required for camera access',
          severity: 'high',
          category: 'browser',
          businessPartnerMessage: 'Camera access requires a secure connection',
          resolution: 'Use HTTPS or localhost for testing'
        });
        return false;
      }

      // 📱 DEVICE ENUMERATION
      await this.refreshDevices();
      
      this.state.isInitialized = true;
      this.state.isLoading = false;
      this.emit('initialized', true);
      this.emit('loading', false);
      
      this.logInfo('Camera service initialized successfully');
      return true;
      
    } catch (error) {
      this.state.isLoading = false;
      this.handleError(error as Error, 'INITIALIZATION_FAILED');
      return false;
    }
  }

  // 🎥 DEVICE ENUMERATION - Get available camera devices
  public async refreshDevices(): Promise<IDemoCameraDevice[]> {
    try {
      this.logInfo('Refreshing camera devices');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new Error('Device enumeration not supported');
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      this.state.availableDevices = await Promise.all(
        videoDevices.map(async (device, index) => {
          const capabilities = await this.getDeviceCapabilities(device.deviceId);
          
          return {
            deviceId: device.deviceId,
            label: device.label || `Camera ${index + 1}`,
            kind: device.kind as 'videoinput',
            groupId: device.groupId,
            isDefault: index === 0,
            isAvailable: true,
            capabilities
          };
        })
      );

      this.emit('devicesChanged', this.state.availableDevices);
      this.logInfo('Device refresh complete', { 
        deviceCount: this.state.availableDevices.length 
      });
      
      return this.state.availableDevices;
      
    } catch (error) {
      this.handleError(error as Error, 'DEVICE_ENUMERATION_FAILED');
      return [];
    }
  }

  // 🔐 PERMISSION MANAGEMENT - Request camera permissions
  public async requestPermissions(): Promise<boolean> {
    try {
      this.logInfo('Requesting camera permissions');
      
      // 📱 REQUEST MEDIA PERMISSIONS
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: this.config.preferredResolution.width },
          height: { ideal: this.config.preferredResolution.height },
          frameRate: { ideal: this.config.preferredFrameRate }
        },
        audio: this.config.enableAudio
      });

      // 🔄 UPDATE PERMISSION STATUS
      this.state.permissions = {
        ...this.state.permissions,
        camera: 'granted',
        microphone: this.config.enableAudio ? 'granted' : 'prompt',
        lastChecked: new Date(),
        canRequest: true
      };

      // 🛑 STOP TEMPORARY STREAM
      stream.getTracks().forEach(track => track.stop());
      
      // 📱 REFRESH DEVICES WITH LABELS
      await this.refreshDevices();
      
      this.emit('permissionsChanged', this.state.permissions);
      this.logInfo('Permissions granted successfully');
      
      return true;
      
    } catch (error) {
      this.handlePermissionError(error as Error);
      return false;
    }
  }

  // 🎬 CAMERA STREAM MANAGEMENT - Start camera stream
  public async startCamera(deviceId: string): Promise<ICameraStream | null> {
    try {
      this.logInfo('Starting camera stream', { deviceId });
      
      // 🔍 VALIDATE DEVICE
      const device = this.getDeviceById(deviceId);
      if (!device) {
        throw new Error(`Device not found: ${deviceId}`);
      }

      // 🔐 CHECK PERMISSIONS
      if (this.state.permissions.camera !== 'granted') {
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Camera permissions required');
        }
      }

      // 📱 CREATE MEDIA STREAM
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: this.config.preferredResolution.width },
          height: { ideal: this.config.preferredResolution.height },
          frameRate: { ideal: this.config.preferredFrameRate }
        },
        audio: this.config.enableAudio
      });

      // 📊 CREATE STREAM OBJECT
      const cameraStream: ICameraStream = {
        id: `stream_${Date.now()}`,
        deviceId,
        stream,
        isActive: true,
        isRecording: false,
        quality: {
          width: this.config.preferredResolution.width,
          height: this.config.preferredResolution.height,
          frameRate: this.config.preferredFrameRate
        },
        lastUpdated: new Date()
      };

      // 💾 STORE STREAM
      this.state.activeStreams.set(cameraStream.id, cameraStream);
      
      // 🎧 MONITOR STREAM EVENTS
      this.setupStreamEventListeners(cameraStream);
      
      this.emit('streamStarted', cameraStream);
      this.logInfo('Camera stream started successfully', { 
        streamId: cameraStream.id,
        deviceId 
      });
      
      return cameraStream;
      
    } catch (error) {
      this.handleError(error as Error, 'STREAM_START_FAILED');
      return null;
    }
  }

  // 🛑 STOP CAMERA STREAM
  public async stopCamera(streamId: string): Promise<void> {
    try {
      this.logInfo('Stopping camera stream', { streamId });
      
      const cameraStream = this.state.activeStreams.get(streamId);
      if (!cameraStream) {
        throw new Error(`Stream not found: ${streamId}`);
      }

      // 🛑 STOP ALL TRACKS
      if (cameraStream.stream) {
        cameraStream.stream.getTracks().forEach(track => {
          track.stop();
        });
      }

      // 📝 UPDATE STREAM STATUS
      cameraStream.isActive = false;
      cameraStream.stream = null;
      cameraStream.lastUpdated = new Date();

      // 🗑️ REMOVE FROM ACTIVE STREAMS
      this.state.activeStreams.delete(streamId);
      
      this.emit('streamStopped', streamId);
      this.logInfo('Camera stream stopped successfully', { streamId });
      
    } catch (error) {
      this.handleError(error as Error, 'STREAM_STOP_FAILED');
    }
  }

  // 🔄 CAMERA SWITCHING - Switch between camera devices
  public async switchCamera(deviceId: string): Promise<ICameraStream | null> {
    try {
      this.logInfo('Switching camera device', { deviceId });
      
      // 🛑 STOP ALL ACTIVE STREAMS
      const activeStreams = Array.from(this.state.activeStreams.values());
      await Promise.all(
        activeStreams.map(stream => this.stopCamera(stream.id))
      );

      // 🎬 START NEW STREAM
      return await this.startCamera(deviceId);
      
    } catch (error) {
      this.handleError(error as Error, 'CAMERA_SWITCH_FAILED');
      return null;
    }
  }

  // 🔍 UTILITY METHODS
  public getDeviceById(deviceId: string): IDemoCameraDevice | null {
    return this.state.availableDevices.find(device => device.deviceId === deviceId) || null;
  }

  public getStreamById(streamId: string): ICameraStream | null {
    return this.state.activeStreams.get(streamId) || null;
  }

  public getDefaultDevice(): IDemoCameraDevice | null {
    return this.state.availableDevices.find(device => device.isDefault) || 
           this.state.availableDevices[0] || null;
  }

  public isDeviceAvailable(deviceId: string): boolean {
    return this.state.availableDevices.some(device => 
      device.deviceId === deviceId && device.isAvailable
    );
  }

  // 📊 STATE GETTERS
  public getState(): ICameraServiceState {
    return { ...this.state };
  }

  public getDevices(): IDemoCameraDevice[] {
    return [...this.state.availableDevices];
  }

  public getActiveStreams(): ICameraStream[] {
    return Array.from(this.state.activeStreams.values());
  }

  public getErrors(): ICameraError[] {
    return [...this.state.errors];
  }

  public clearErrors(): void {
    this.state.errors = [];
    this.emit('errorsCleared');
  }

  // 🎧 EVENT SYSTEM
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // 🔧 PRIVATE HELPER METHODS

  private isDemoAccount(userEmail: string): boolean {
    return userEmail === this.config.demoAccountEmail;
  }

  private checkBrowserSupport(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      navigator.mediaDevices.enumerateDevices
    );
  }

  private isHttpsOrLocalhost(): boolean {
    return location.protocol === 'https:' || 
           location.hostname === 'localhost' || 
           location.hostname === '127.0.0.1';
  }

  private async getDeviceCapabilities(deviceId: string): Promise<any> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      });
      
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      // 🛑 STOP TEMPORARY STREAM
      stream.getTracks().forEach(track => track.stop());
      
      return capabilities;
    } catch (error) {
      return null;
    }
  }

  private setupStreamEventListeners(cameraStream: ICameraStream): void {
    if (!cameraStream.stream) return;

    cameraStream.stream.getTracks().forEach(track => {
      track.addEventListener('ended', () => {
        this.logInfo('Stream track ended', { streamId: cameraStream.id });
        this.emit('streamEnded', cameraStream.id);
      });

      track.addEventListener('mute', () => {
        this.logInfo('Stream track muted', { streamId: cameraStream.id });
        this.emit('streamMuted', cameraStream.id);
      });

      track.addEventListener('unmute', () => {
        this.logInfo('Stream track unmuted', { streamId: cameraStream.id });
        this.emit('streamUnmuted', cameraStream.id);
      });
    });
  }

  private handlePermissionError(error: Error): void {
    let errorCode = 'PERMISSION_DENIED';
    let businessPartnerMessage = 'Camera permissions are required for demo functionality';
    let resolution = 'Please click "Allow" when prompted for camera access';

    if (error.name === 'NotAllowedError') {
      errorCode = 'PERMISSION_DENIED';
      businessPartnerMessage = 'Camera access was denied';
      resolution = 'Please refresh the page and allow camera access';
    } else if (error.name === 'NotFoundError') {
      errorCode = 'NO_CAMERA_FOUND';
      businessPartnerMessage = 'No camera devices found';
      resolution = 'Please ensure a camera is connected and try again';
    }

    this.addError({
      code: errorCode,
      message: error.message,
      severity: 'high',
      category: 'permission',
      businessPartnerMessage,
      resolution,
      technicalDetails: error.toString()
    });

    this.state.permissions.camera = 'denied';
    this.emit('permissionsChanged', this.state.permissions);
  }

  private handleError(error: Error, code: string): void {
    this.addError({
      code,
      message: error.message,
      severity: 'medium',
      category: 'device',
      businessPartnerMessage: 'Camera operation failed',
      resolution: 'Please try again or contact support',
      technicalDetails: error.toString()
    });
  }

  private addError(error: ICameraError): void {
    this.state.errors.push(error);
    this.emit('error', error);
    this.logError(error.message, error);
  }

  private initializeEventListeners(): void {
    // 📱 DEVICE CHANGE DETECTION
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        this.logInfo('Device change detected');
        this.refreshDevices();
      });
    }
  }

  // 📝 LOGGING METHODS
  private logInfo(message: string, data?: any): void {
    if (this.config.logLevel === 'info' || this.config.logLevel === 'debug') {
      console.log(`[CameraService] ${message}`, data || '');
    }
  }

  private logError(message: string, error?: any): void {
    if (this.config.logLevel !== 'error') {
      console.error(`[CameraService] ${message}`, error || '');
    }
  }

  // 🧹 CLEANUP
  public async cleanup(): Promise<void> {
    this.logInfo('Cleaning up camera service');
    
    // 🛑 STOP ALL STREAMS
    const activeStreams = Array.from(this.state.activeStreams.values());
    await Promise.all(
      activeStreams.map(stream => this.stopCamera(stream.id))
    );

    // 🗑️ CLEAR STATE
    this.state.activeStreams.clear();
    this.state.availableDevices = [];
    this.state.errors = [];
    this.state.isInitialized = false;
    this.state.isDemoMode = false;
    
    // 🎧 CLEAR EVENT LISTENERS
    this.eventListeners.clear();
    
    this.logInfo('Camera service cleanup complete');
  }
}

// 🎯 SINGLETON EXPORT
export default CameraService.getInstance(); 