import { wyzeConfig } from '../config/wyzeConfig';

export interface WyzeCamera {
  id: string;
  name: string;
  mac: string;
  rtspUrl: string;
  hlsUrl: string;
  status: 'online' | 'offline' | 'unknown';
}

export class WyzeService {
  private baseUrl = wyzeConfig.api.baseUrl;
  private bridgeUrl = wyzeConfig.bridge.baseUrl;
  private accessToken: string | null = null;

  /**
   * Test connection to Wyze bridge
   */
  async testBridgeConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.bridgeUrl}/api/status`);
      return response.ok;
    } catch (error) {
      console.error('Wyze bridge connection failed:', error);
      return false;
    }
  }

  /**
   * Get list of cameras from Wyze bridge
   */
  async getCameras(): Promise<WyzeCamera[]> {
    try {
      const response = await fetch(`${this.bridgeUrl}/api/cameras`);
      const data = await response.json();
      
      return data.cameras?.map((camera: any) => ({
        id: camera.mac,
        name: camera.nickname || camera.name,
        mac: camera.mac,
        rtspUrl: `rtsp://localhost:8554/${camera.name}`,
        hlsUrl: `http://localhost:3002/hls/${camera.name}.m3u8`,
        status: camera.status
      })) || [];
    } catch (error) {
      console.error('Failed to get cameras from Wyze bridge:', error);
      return [];
    }
  }

  /**
   * Send PTZ command to Wyze camera
   */
  async sendPTZCommand(cameraId: string, command: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.bridgeUrl}/api/ptz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camera: cameraId,
          command: command
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('PTZ command failed:', error);
      return false;
    }
  }

  /**
   * Get stream URL for specific camera
   */
  getStreamUrl(cameraName: string, format: 'rtsp' | 'hls' = 'hls'): string {
    if (format === 'rtsp') {
      return `rtsp://localhost:8554/${cameraName}`;
    }
    return `http://localhost:3002/hls/${cameraName}.m3u8`;
  }

  /**
   * Capture snapshot from Wyze camera
   */
  async captureSnapshot(cameraId: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.bridgeUrl}/api/snapshot/${cameraId}`);
      
      if (response.ok) {
        return await response.blob();
      }
      
      return null;
    } catch (error) {
      console.error('Failed to capture snapshot:', error);
      return null;
    }
  }

  /**
   * Get camera status and diagnostics
   */
  async getCameraStatus(cameraId: string): Promise<any> {
    try {
      const response = await fetch(`${this.bridgeUrl}/api/status/${cameraId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get camera status:', error);
      return null;
    }
  }

  /**
   * Start recording on Wyze camera
   */
  async startRecording(cameraId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.bridgeUrl}/api/record/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera: cameraId })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  /**
   * Stop recording on Wyze camera
   */
  async stopRecording(cameraId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.bridgeUrl}/api/record/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera: cameraId })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return false;
    }
  }
}

export const wyzeService = new WyzeService(); 