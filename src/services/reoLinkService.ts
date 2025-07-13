// 📹 ReoLink E1 Pro Service
// Handles WebSocket communication and RTSP streaming for E1 Pro cameras
// ⚠️ CRITICAL: E1 Pro does NOT support HTTP API - WebSocket/RTSP only!

import { 
  reoLinkE1ProConnectionConfig, 
  reoLinkE1ProCameras, 
  reoLinkE1ProHelpers,
  reoLinkE1ProDiagnostics,
  reoLinkE1ProStreamConfig,
  reoLinkE1ProPTZConfig,
  type IReoLinkE1ProCamera,
  type IReoLinkE1ProConnection 
} from '../config/reoLinkConfig';

export interface IReoLinkE1ProStreamInfo {
  cameraId: string;
  streams: {
    main: { url: string; websocketUrl: string; status: 'active' | 'inactive' | 'error' };
    sub: { url: string; websocketUrl: string; status: 'active' | 'inactive' | 'error' };
  };
  conversionServer: {
    connected: boolean;
    host: string;
    port: number;
  };
  status: 'streaming' | 'connecting' | 'disconnected' | 'error';
}

export interface IReoLinkE1ProHealthStatus {
  cameraId: string;
  isOnline: boolean;
  rtspConnected: boolean;
  conversionServerOnline: boolean;
  websocketConnected: boolean;
  latency: number;
  streamQuality: 'excellent' | 'good' | 'poor' | 'unavailable';
  uptime: number;
  lastCheck: Date;
  errors: string[];
  diagnostics: any;
}

export interface IReoLinkE1ProPTZControl {
  cameraId: string;
  command: 'up' | 'down' | 'left' | 'right' | 'zoomIn' | 'zoomOut' | 'preset' | 'stop' | 'home';
  value?: number;
  presetId?: number;
  duration?: number;
}

export interface IReoLinkE1ProSnapshot {
  cameraId: string;
  imageData: string; // Base64 encoded
  timestamp: Date;
  quality: 'main' | 'sub';
  size: { width: number; height: number };
}

class ReoLinkE1ProService {
  private websockets: Map<string, WebSocket> = new Map();
  private connectionStatus: Map<string, boolean> = new Map();
  private streamInfo: Map<string, IReoLinkE1ProStreamInfo> = new Map();
  private healthStatus: Map<string, IReoLinkE1ProHealthStatus> = new Map();
  private reconnectTimers: Map<string, NodeJS.Timeout> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    console.log('🔧 Initializing ReoLink E1 Pro service...');
    console.log('⚠️  E1 Pro RTSP-only mode - No HTTP API support');
    
    // Test conversion server availability
    const serverAvailable = await this.testConversionServer();
    if (!serverAvailable) {
      console.error('❌ Conversion server not available! Please start rtsp-conversion-server.js');
      throw new Error('RTSP conversion server required but not available');
    }
    
    // Initialize health monitoring for all enabled cameras
    const enabledCameras = reoLinkE1ProHelpers.getEnabledCameras();
    for (const camera of enabledCameras) {
      await this.initializeCamera(camera);
    }
  }

  // 🔌 Connection Management
  private async testConversionServer(): Promise<boolean> {
    try {
      const { host, port } = reoLinkE1ProConnectionConfig.conversionServer;
      const response = await fetch(`http://${host}:${port}/status`);
      const data = await response.json();
      
      console.log('✅ Conversion server available:', data.status);
      return data.status === 'running';
    } catch (error) {
      console.error('❌ Conversion server test failed:', error);
      return false;
    }
  }

  private async initializeCamera(camera: IReoLinkE1ProCamera): Promise<boolean> {
    try {
      console.log(`🎥 Initializing camera: ${camera.name} (${camera.host})`);
      
      // Test RTSP connection
      const rtspTest = await reoLinkE1ProDiagnostics.testRTSPConnection(camera);
      if (!rtspTest) {
        console.warn(`⚠️  RTSP connection test failed for ${camera.name}`);
      }
      
      // Initialize WebSocket connection
      await this.connectWebSocket(camera);
      
      // Set up health monitoring
      this.initializeHealthMonitoring(camera);
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to initialize camera ${camera.name}:`, error);
      return false;
    }
  }

  private async connectWebSocket(camera: IReoLinkE1ProCamera): Promise<void> {
    return new Promise((resolve, reject) => {
      const { conversionServer } = reoLinkE1ProConnectionConfig;
      const wsUrl = `ws://${conversionServer.host}:${conversionServer.websocketPort}`;
      const ws = new WebSocket(wsUrl);
      
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('WebSocket connection timeout'));
      }, 10000);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        console.log(`✅ WebSocket connected for ${camera.name}`);
        
        this.websockets.set(camera.id, ws);
        this.connectionStatus.set(camera.id, true);
        
        // Send initial configuration
        ws.send(JSON.stringify({
          type: 'configure',
          cameraId: camera.id,
          quality: 'main'
        }));
        
        resolve();
      };
      
      ws.onmessage = (event) => {
        this.handleWebSocketMessage(camera.id, JSON.parse(event.data));
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error(`❌ WebSocket error for ${camera.name}:`, error);
        this.connectionStatus.set(camera.id, false);
        this.scheduleReconnect(camera);
        reject(error);
      };
      
      ws.onclose = () => {
        console.log(`🔌 WebSocket closed for ${camera.name}`);
        this.connectionStatus.set(camera.id, false);
        this.websockets.delete(camera.id);
        this.scheduleReconnect(camera);
      };
    });
  }

  private scheduleReconnect(camera: IReoLinkE1ProCamera): void {
    // Clear existing timer
    const existingTimer = this.reconnectTimers.get(camera.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    // Schedule reconnection
    const timer = setTimeout(async () => {
      console.log(`🔄 Attempting to reconnect ${camera.name}...`);
      try {
        await this.connectWebSocket(camera);
      } catch (error) {
        console.error(`❌ Reconnection failed for ${camera.name}:`, error);
        this.scheduleReconnect(camera); // Try again
      }
    }, reoLinkE1ProStreamConfig.websocket.reconnectDelay);
    
    this.reconnectTimers.set(camera.id, timer);
  }

  private handleWebSocketMessage(cameraId: string, message: any): void {
    switch (message.type) {
      case 'connected':
        console.log(`📡 Stream connected for camera ${cameraId}`);
        this.updateStreamStatus(cameraId, 'streaming');
        break;
        
      case 'stream_data':
        // Handle streaming data
        this.emitEvent('streamData', { cameraId, data: message.data });
        break;
        
      case 'stream_progress':
        console.log(`📊 Stream progress for ${cameraId}: ${message.status}`);
        break;
        
      case 'stream_error':
        console.error(`❌ Stream error for ${cameraId}:`, message.error);
        this.updateStreamStatus(cameraId, 'error');
        break;
        
      case 'ptz_command':
        console.log(`🎮 PTZ command acknowledged for ${cameraId}:`, message.command);
        break;
        
      case 'pong':
        // Update health status
        this.updateLastPing(cameraId);
        break;
        
      default:
        console.log(`📝 Unknown message type: ${message.type}`);
    }
  }

  // 📺 Stream Management
  async getStreamInfo(cameraId: string): Promise<IReoLinkE1ProStreamInfo | null> {
    try {
      const camera = reoLinkE1ProHelpers.getCameraById(cameraId);
      if (!camera) {
        throw new Error(`Camera ${cameraId} not found`);
      }

      const { conversionServer } = reoLinkE1ProConnectionConfig;
      const isConnected = this.connectionStatus.get(cameraId) || false;
      
      const streamInfo: IReoLinkE1ProStreamInfo = {
          cameraId,
          streams: {
            main: { 
            url: camera.hlsStreams.main,
            websocketUrl: `ws://${conversionServer.host}:${conversionServer.websocketPort}`,
            status: isConnected ? 'active' : 'inactive'
            },
            sub: { 
            url: camera.hlsStreams.sub,
            websocketUrl: `ws://${conversionServer.host}:${conversionServer.websocketPort}`,
            status: isConnected ? 'active' : 'inactive'
          }
        },
        conversionServer: {
          connected: await this.testConversionServer(),
          host: conversionServer.host,
          port: conversionServer.port
        },
        status: isConnected ? 'streaming' : 'disconnected'
      };

      this.streamInfo.set(cameraId, streamInfo);
      return streamInfo;
    } catch (error) {
      console.error('Failed to get stream info:', error);
      return null;
    }
  }

  async startStream(cameraId: string, quality: 'main' | 'sub' = 'main'): Promise<boolean> {
    try {
      const { conversionServer } = reoLinkE1ProConnectionConfig;
      
      const response = await fetch(`http://${conversionServer.host}:${conversionServer.port}/stream/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quality })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to start stream: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Stream started for ${cameraId}:`, data);
      
      this.updateStreamStatus(cameraId, 'streaming');
      return true;
    } catch (error) {
      console.error(`❌ Failed to start stream for ${cameraId}:`, error);
      this.updateStreamStatus(cameraId, 'error');
      return false;
    }
  }

  async stopStream(cameraId: string): Promise<boolean> {
    try {
      const streamInfo = this.streamInfo.get(cameraId);
      if (!streamInfo) {
        return true; // Already stopped
      }
      
      const { conversionServer } = reoLinkE1ProConnectionConfig;
      
      const response = await fetch(`http://${conversionServer.host}:${conversionServer.port}/stream/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quality: 'main' })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to stop stream: ${response.status}`);
      }
      
      console.log(`🛑 Stream stopped for ${cameraId}`);
      this.updateStreamStatus(cameraId, 'disconnected');
        return true;
    } catch (error) {
      console.error(`❌ Failed to stop stream for ${cameraId}:`, error);
      return false;
    }
  }

  private updateStreamStatus(cameraId: string, status: IReoLinkE1ProStreamInfo['status']): void {
    const streamInfo = this.streamInfo.get(cameraId);
    if (streamInfo) {
      streamInfo.status = status;
      this.streamInfo.set(cameraId, streamInfo);
      this.emitEvent('streamStatusChange', { cameraId, status });
    }
  }

  // 🎮 PTZ Control
  async controlPTZ(control: IReoLinkE1ProPTZControl): Promise<boolean> {
    try {
      const ws = this.websockets.get(control.cameraId);
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        throw new Error('WebSocket not connected');
      }

      // Send PTZ command via WebSocket
      ws.send(JSON.stringify({
        type: 'ptz_control',
        command: control.command,
        value: control.value,
        presetId: control.presetId,
        duration: control.duration || 1000
      }));
      
      // Also send to conversion server HTTP endpoint
      const { conversionServer } = reoLinkE1ProConnectionConfig;
      
      await fetch(`http://${conversionServer.host}:${conversionServer.port}/ptz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: control.command,
          value: control.value,
          presetId: control.presetId
        })
      });

      console.log(`🎮 PTZ command sent: ${control.command} for camera ${control.cameraId}`);
      return true;
    } catch (error) {
      console.error('PTZ control failed:', error);
      return false;
    }
  }

  async moveToPreset(cameraId: string, presetId: number): Promise<boolean> {
    const preset = reoLinkE1ProPTZConfig.presets[presetId];
    if (!preset) {
      console.error(`Preset ${presetId} not found`);
      return false;
    }
    
    console.log(`🎯 Moving to preset ${presetId}: ${preset.name}`);
    return this.controlPTZ({
      cameraId,
      command: 'preset',
      presetId
    });
  }

  // 📸 Snapshot Capture
  async captureSnapshot(cameraId: string, quality: 'main' | 'sub' = 'main'): Promise<IReoLinkE1ProSnapshot | null> {
    try {
      const { conversionServer } = reoLinkE1ProConnectionConfig;
      
      const response = await fetch(`http://${conversionServer.host}:${conversionServer.port}/snapshot?quality=${quality}`);
      
      if (!response.ok) {
        throw new Error(`Snapshot capture failed: ${response.status}`);
      }
      
      const imageBuffer = await response.arrayBuffer();
      const imageData = Buffer.from(imageBuffer).toString('base64');
      
      const snapshot: IReoLinkE1ProSnapshot = {
        cameraId,
        imageData: `data:image/jpeg;base64,${imageData}`,
        timestamp: new Date(),
        quality,
        size: { width: 1920, height: 1080 } // Default size
      };
      
      console.log(`📸 Snapshot captured for ${cameraId}`);
      return snapshot;
    } catch (error) {
      console.error(`❌ Snapshot capture failed for ${cameraId}:`, error);
      return null;
    }
  }

  // 🏥 Health Monitoring
  private initializeHealthMonitoring(camera: IReoLinkE1ProCamera): void {
    const interval = setInterval(async () => {
      await this.performHealthCheck(camera.id);
    }, camera.healthCheck.intervalSeconds * 1000);
    
    // Store interval for cleanup
    this.reconnectTimers.set(`health_${camera.id}`, interval);
  }

  private async performHealthCheck(cameraId: string): Promise<void> {
    const camera = reoLinkE1ProHelpers.getCameraById(cameraId);
      if (!camera) return;

      const startTime = Date.now();
    
    try {
      // Run comprehensive diagnostics
      const diagnostics = await reoLinkE1ProDiagnostics.runFullDiagnostics(camera);
      
      const healthStatus: IReoLinkE1ProHealthStatus = {
        cameraId,
        isOnline: diagnostics.overallHealth !== 'failed',
        rtspConnected: diagnostics.rtspConnection,
        conversionServerOnline: diagnostics.conversionServer,
        websocketConnected: diagnostics.websocketConnection,
        latency: Date.now() - startTime,
        streamQuality: this.determineStreamQuality(diagnostics),
        uptime: this.calculateUptime(cameraId),
        lastCheck: new Date(),
        errors: [],
        diagnostics
      };
      
      // Send ping via WebSocket
      const ws = this.websockets.get(cameraId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      } else {
        healthStatus.errors.push('WebSocket not connected');
      }
      
      this.healthStatus.set(cameraId, healthStatus);
      this.emitEvent('healthUpdate', healthStatus);

    } catch (error) {
      console.error(`Health check failed for ${cameraId}:`, error);
      
      const errorHealth: IReoLinkE1ProHealthStatus = {
        cameraId,
        isOnline: false,
        rtspConnected: false,
        conversionServerOnline: false,
        websocketConnected: false,
        latency: Date.now() - startTime,
        streamQuality: 'unavailable',
        uptime: 0,
        lastCheck: new Date(),
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        diagnostics: null
      };
      
      this.healthStatus.set(cameraId, errorHealth);
    }
  }

  private determineStreamQuality(diagnostics: any): IReoLinkE1ProHealthStatus['streamQuality'] {
    if (!diagnostics.rtspConnection) return 'unavailable';
    if (diagnostics.overallHealth === 'healthy') return 'excellent';
    if (diagnostics.overallHealth === 'degraded') return 'good';
    return 'poor';
  }

  private calculateUptime(cameraId: string): number {
    const health = this.healthStatus.get(cameraId);
    if (!health) return 0;
    
    // Simple uptime calculation based on connection status
    return this.connectionStatus.get(cameraId) ? 100 : 0;
  }

  private updateLastPing(cameraId: string): void {
    const health = this.healthStatus.get(cameraId);
    if (health) {
      health.lastCheck = new Date();
      this.healthStatus.set(cameraId, health);
    }
  }

  async getHealthStatus(cameraId: string): Promise<IReoLinkE1ProHealthStatus | null> {
    return this.healthStatus.get(cameraId) || null;
  }

  async getAllHealthStatuses(): Promise<IReoLinkE1ProHealthStatus[]> {
    return Array.from(this.healthStatus.values());
  }

  // 🎯 Camera Management
  async getCameraList(): Promise<IReoLinkE1ProCamera[]> {
    return reoLinkE1ProHelpers.getEnabledCameras();
  }

  async getCameraInfo(cameraId: string): Promise<IReoLinkE1ProCamera | null> {
    return reoLinkE1ProHelpers.getCameraById(cameraId) || null;
  }

  // 📡 Event Management
  private emitEvent(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });
  }

  addEventListener(eventType: string, listener: Function): void {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.push(listener);
    this.eventListeners.set(eventType, listeners);
  }

  removeEventListener(eventType: string, listener: Function): void {
    const listeners = this.eventListeners.get(eventType) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(eventType, listeners);
    }
  }

  // 🧹 Cleanup
  async disconnect(): Promise<void> {
    console.log('🛑 Disconnecting ReoLink E1 Pro service...');
    
    // Close all WebSocket connections
    for (const ws of this.websockets.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    }
    
    // Clear all timers
    for (const timer of this.reconnectTimers.values()) {
      clearTimeout(timer);
    }
    
    // Clear all data
    this.websockets.clear();
    this.connectionStatus.clear();
    this.streamInfo.clear();
    this.healthStatus.clear();
    this.reconnectTimers.clear();
    this.eventListeners.clear();
  }

  // 🔧 Configuration Updates
  async updateCameraConfig(cameraId: string, config: Partial<IReoLinkE1ProCamera>): Promise<boolean> {
    console.log(`🔧 Camera configuration updates not supported for E1 Pro cameras`);
    console.log(`⚠️  E1 Pro cameras must be configured through ReoLink app`);
    return false;
  }

  // 🧪 Testing and Diagnostics
  async testConnection(cameraId: string): Promise<boolean> {
    const camera = reoLinkE1ProHelpers.getCameraById(cameraId);
    if (!camera) return false;
    
    const diagnostics = await reoLinkE1ProDiagnostics.runFullDiagnostics(camera);
    return diagnostics.overallHealth === 'healthy';
  }

  async getConnectionDiagnostics(cameraId: string): Promise<any> {
    const camera = reoLinkE1ProHelpers.getCameraById(cameraId);
    if (!camera) return null;
    
    return await reoLinkE1ProDiagnostics.runFullDiagnostics(camera);
  }
}

// Export singleton service instance
export const reoLinkE1ProService = new ReoLinkE1ProService();

// Export legacy compatibility (for gradual migration)
export const reoLinkService = reoLinkE1ProService;
export type IReoLinkStreamInfo = IReoLinkE1ProStreamInfo;
export type IReoLinkHealthStatus = IReoLinkE1ProHealthStatus;
export type IReoLinkPTZControl = IReoLinkE1ProPTZControl; 