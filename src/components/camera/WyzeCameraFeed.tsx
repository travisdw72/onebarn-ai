import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { wyzeService, WyzeCamera } from '../../services/wyzeService';
import { wyzeConfig } from '../../config/wyzeConfig';

interface WyzeCameraFeedProps {
  cameraId: string;
  width?: number;
  height?: number;
  enablePTZ?: boolean;
  autoPlay?: boolean;
  onError?: (error: string) => void;
  onFrameCapture?: (imageData: string) => void;
  onAIAnalysis?: (analysisData: any) => void;
}

export const WyzeCameraFeed: React.FC<WyzeCameraFeedProps> = ({
  cameraId,
  width = 640,
  height = 480,
  enablePTZ = true,
  autoPlay = true,
  onError,
  onFrameCapture,
  onAIAnalysis
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [camera, setCamera] = useState<WyzeCamera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [lastSnapshot, setLastSnapshot] = useState<string>('');
  const [snapshotInterval, setSnapshotInterval] = useState<NodeJS.Timeout | null>(null);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any[]>([]);
  const [snapshotCount, setSnapshotCount] = useState<number>(0);

  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, [cameraId]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setConnectionStatus('connecting');

      // Test bridge connection
      const bridgeConnected = await wyzeService.testBridgeConnection();
      if (!bridgeConnected) {
        throw new Error('Wyze bridge is not running. Please start the bridge first.');
      }

      // For Wyze snapshots, we'll use a different approach
      // Start snapshot polling for AI analysis
      startSnapshotPolling();
      
      setConnectionStatus('connected');
      setIsLoading(false);
      
    } catch (error) {
      console.error('Failed to initialize Wyze camera:', error);
      setConnectionStatus('error');
      setIsLoading(false);
      onError?.(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const initializeHLS = async (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        reject(new Error('Video element not available'));
        return;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(url);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('🎥 HLS media attached');
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('🎥 HLS manifest parsed');
          if (autoPlay && videoRef.current) {
            videoRef.current.play();
          }
          resolve();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('🎥 HLS error:', data);
          if (data.fatal) {
            reject(new Error(`HLS error: ${data.type} ${data.details}`));
          }
        });

        hlsRef.current = hls;
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoRef.current.src = url;
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (autoPlay && videoRef.current) {
            videoRef.current.play();
          }
          resolve();
        });
      } else {
        reject(new Error('HLS not supported'));
      }
    });
  };

  const cleanup = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    if (snapshotInterval) {
      clearInterval(snapshotInterval);
      setSnapshotInterval(null);
    }
  };

  const startSnapshotPolling = () => {
    // Get snapshots every 2 seconds for AI analysis
    const interval = setInterval(async () => {
      try {
        // Fetch latest snapshot from Wyze bridge directly (bypassing proxy issues)
        const snapshotUrl = `http://localhost:8888/snapshot/wyze.jpg?${Date.now()}`;
        const response = await fetch(snapshotUrl, {
          mode: 'cors',
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setLastSnapshot(imageUrl);
          setSnapshotCount(prev => prev + 1);
          
          // Convert to base64 for AI analysis
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            performAIAnalysis(base64);
          };
          reader.readAsDataURL(blob);
          
          // Clean up old object URL
          setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
        }
      } catch (error) {
        console.error('Snapshot polling error:', error);
      }
    }, 2000); // Poll every 2 seconds
    
    setSnapshotInterval(interval);
  };

  const performAIAnalysis = async (imageBase64: string) => {
    try {
      // Simple motion detection and object analysis
      const analysisResult = {
        timestamp: new Date().toISOString(),
        imageSize: imageBase64.length,
        motionDetected: Math.random() > 0.7, // Simulate motion detection
        objectsDetected: Math.floor(Math.random() * 3), // Simulate object count
        confidence: Math.random() * 100,
        frameNumber: snapshotCount
      };
      
      setAiAnalysisResults(prev => [...prev.slice(-9), analysisResult]); // Keep last 10 results
      
      // Call parent callbacks if provided
      if (onFrameCapture) {
        onFrameCapture(imageBase64);
      }
      
      if (onAIAnalysis) {
        onAIAnalysis(analysisResult);
      }
      
      console.log('🤖 AI Analysis:', analysisResult);
    } catch (error) {
      console.error('AI analysis error:', error);
    }
  };

  const handlePTZCommand = async (command: string) => {
    if (!camera) return;
    
    try {
      const success = await wyzeService.sendPTZCommand(camera.id, command);
      if (!success) {
        console.error('PTZ command failed:', command);
      }
    } catch (error) {
      console.error('PTZ error:', error);
    }
  };

  const captureSnapshot = async () => {
    if (!camera) return;
    
    try {
      const blob = await wyzeService.captureSnapshot(camera.id);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setLastSnapshot(url);
        
        // Download the snapshot
        const link = document.createElement('a');
        link.href = url;
        link.download = `wyze-${camera.name}-${Date.now()}.jpg`;
        link.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error('Snapshot capture failed:', error);
    }
  };

  const renderConnectionStatus = () => {
    const statusConfig = {
      connecting: { color: '#ff9800', text: 'Connecting...' },
      connected: { color: '#4caf50', text: 'Connected' },
      disconnected: { color: '#f44336', text: 'Disconnected' },
      error: { color: '#f44336', text: 'Error' }
    };

    const status = statusConfig[connectionStatus];
    
    return (
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        background: 'rgba(0,0,0,0.7)', 
        color: 'white', 
        padding: '4px 8px', 
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <span style={{ color: status.color }}>●</span> {status.text}
      </div>
    );
  };

  const renderPTZControls = () => {
    if (!enablePTZ || !camera) return null;

    return (
      <div style={{ 
        position: 'absolute', 
        bottom: 10, 
        right: 10, 
        background: 'rgba(0,0,0,0.7)', 
        borderRadius: '8px',
        padding: '8px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
          <div></div>
          <button 
            onClick={() => handlePTZCommand('up')}
            style={{ padding: '8px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ↑
          </button>
          <div></div>
          
          <button 
            onClick={() => handlePTZCommand('left')}
            style={{ padding: '8px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ←
          </button>
          <button 
            onClick={() => handlePTZCommand('home')}
            style={{ padding: '8px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ⌂
          </button>
          <button 
            onClick={() => handlePTZCommand('right')}
            style={{ padding: '8px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            →
          </button>
          
          <div></div>
          <button 
            onClick={() => handlePTZCommand('down')}
            style={{ padding: '8px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            ↓
          </button>
          <div></div>
        </div>
        
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
          <button 
            onClick={() => handlePTZCommand('zoom_in')}
            style={{ padding: '4px 8px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            +
          </button>
          <button 
            onClick={() => handlePTZCommand('zoom_out')}
            style={{ padding: '4px 8px', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            -
          </button>
          <button 
            onClick={captureSnapshot}
            style={{ padding: '4px 8px', background: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            📷
          </button>
        </div>
      </div>
    );
  };

  const renderAIAnalysisOverlay = () => {
    if (aiAnalysisResults.length === 0) return null;
    
    const latestResult = aiAnalysisResults[aiAnalysisResults.length - 1];
    
    return (
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '11px',
        maxWidth: '200px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          🤖 AI Analysis
        </div>
        <div>Motion: {latestResult.motionDetected ? '✅' : '❌'}</div>
        <div>Objects: {latestResult.objectsDetected}</div>
        <div>Confidence: {Math.round(latestResult.confidence)}%</div>
        <div>Frame: #{latestResult.frameNumber}</div>
        <div style={{ fontSize: '10px', opacity: 0.7 }}>
          {new Date(latestResult.timestamp).toLocaleTimeString()}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{ 
        width, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <div>Loading Wyze camera...</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width, height }}>
      {/* Snapshot Display */}
      {lastSnapshot ? (
        <img
          src={lastSnapshot}
          alt="Wyze Camera Snapshot"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
            background: '#000'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          background: '#000',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '16px'
        }}>
          Waiting for Wyze snapshots...
        </div>
      )}
      
      {renderConnectionStatus()}
      {renderPTZControls()}
      {renderAIAnalysisOverlay()}
      
      {/* Camera info */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        Wyze V4 - Snapshots ({snapshotCount})
      </div>
    </div>
  );
}; 