import React, { useRef, useEffect, useState, useCallback } from 'react';
import { brandConfig } from '../../config/brandConfig';
import type { IDemoVideoOption } from '../../config/demoVideosConfig';

interface ILocalVideoStreamPlayerProps {
  videoOption: IDemoVideoOption;
  isCapturing: boolean;
  captureInterval: number; // seconds
  onFrameCapture?: (frameData: string, frameNumber: number) => void;
  autoPlay?: boolean;
  loop?: boolean;
}

export const LocalVideoStreamPlayer: React.FC<ILocalVideoStreamPlayerProps> = ({
  videoOption,
  isCapturing,
  captureInterval,
  onFrameCapture,
  autoPlay = true,
  loop = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // Start/stop frame capture based on isCapturing prop
  useEffect(() => {
    if (isCapturing && isPlaying) {
      startFrameCapture();
    } else {
      stopFrameCapture();
    }

    return () => {
      stopFrameCapture();
    };
  }, [isCapturing, isPlaying, captureInterval]);

  // Reset frame count when video changes
  useEffect(() => {
    frameCountRef.current = 0;
  }, [videoOption.id]);

  // Update video source when videoOption changes
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Pause current video
      video.pause();
      
      // Update the video source
      video.src = videoOption.url;
      
      // Reset video state
      setVideoTime(0);
      setVideoDuration(0);
      setIsPlaying(false);
      
      // Load the new video
      video.load();
      
      // Auto-play if enabled
      if (autoPlay) {
        video.play().catch(error => {
          console.log('Auto-play prevented:', error);
        });
      }
      
      console.log(`🎬 Video source updated to: ${videoOption.name} (${videoOption.url})`);
    }
  }, [videoOption.id, videoOption.url, videoOption.name, autoPlay]);

  const startFrameCapture = useCallback(() => {
    if (captureTimerRef.current) {
      clearInterval(captureTimerRef.current);
    }

    // Capture first frame immediately
    captureFrame();

    // Set up interval for subsequent captures
    captureTimerRef.current = setInterval(() => {
      captureFrame();
    }, captureInterval * 1000);

    console.log(`🎬 Started frame capture every ${captureInterval} seconds from: ${videoOption.name}`);
  }, [captureInterval, videoOption.name]);

  const stopFrameCapture = useCallback(() => {
    if (captureTimerRef.current) {
      clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
    console.log('⏹️ Stopped frame capture');
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Stop capturing if we've reached 10 frames
    if (frameCountRef.current >= 10) {
      console.log('📊 Reached 10 frames - stopping capture automatically');
      stopFrameCapture();
      return;
    }
    
    if (!video || !canvas || video.paused || video.ended) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add timestamp overlay to simulate live stream
      const timestamp = new Date();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 280, 30);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.fillText(`Live Stream: ${timestamp.toLocaleTimeString()}`, 15, 30);

      // Add video info overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(10, canvas.height - 50, 300, 30);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.fillText(`${videoOption.name} - Frame ${frameCountRef.current + 1}`, 15, canvas.height - 30);

      // Convert to base64
      const frameData = canvas.toDataURL('image/jpeg', 0.8);
      
      frameCountRef.current += 1;
      
      if (onFrameCapture) {
        onFrameCapture(frameData, frameCountRef.current);
      }

      console.log(`📸 Captured frame ${frameCountRef.current} at ${timestamp.toLocaleTimeString()}`);
      
    } catch (error) {
      console.error('Frame capture error:', error);
    }
  }, [videoOption.name, onFrameCapture, stopFrameCapture]);

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnd = () => {
    if (loop && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div 
        className="relative rounded-lg overflow-hidden border-4 shadow-2xl"
        style={{
          borderColor: isCapturing ? brandConfig.colors.successGreen : brandConfig.colors.ribbonBlue,
          backgroundColor: '#000000',
          aspectRatio: '16/9',
          width: '100%',
          maxWidth: '800px'
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          loop={loop}
          controls
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnd}
          style={{
            backgroundColor: '#000000',
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <source src={videoOption.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Enhanced Status Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Live Status */}
          <div 
            className="px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: brandConfig.colors.barnWhite,
              border: `2px solid ${brandConfig.colors.errorRed}`
            }}
          >
            🔴 LIVE STREAM
          </div>
          
          {/* Analysis Type */}
          <div 
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: brandConfig.colors.ribbonBlue,
              color: brandConfig.colors.barnWhite
            }}
          >
            🎯 {videoOption.analysisType.toUpperCase()} ANALYSIS
          </div>
        </div>

        {/* Capture Status Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {isCapturing && (
            <div 
              className="px-3 py-1 rounded-full text-sm font-semibold animate-pulse"
              style={{
                backgroundColor: brandConfig.colors.successGreen,
                color: brandConfig.colors.barnWhite,
                boxShadow: `0 0 10px ${brandConfig.colors.successGreen}50`
              }}
            >
              📸 CAPTURING FRAMES
            </div>
          )}
          
          {/* Frame Counter */}
          {frameCountRef.current > 0 && (
            <div 
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: brandConfig.colors.championGold,
                color: brandConfig.colors.barnWhite
              }}
            >
              Frame #{frameCountRef.current}
            </div>
          )}
        </div>

        {/* Bottom Info Bar */}
        <div 
          className="absolute bottom-4 left-4 right-4 px-3 py-2 rounded-lg flex justify-between items-center text-sm"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: brandConfig.colors.barnWhite
          }}
        >
          <span>📹 {videoOption.name}</span>
          <span>
            {formatTime(videoTime)} / {formatTime(videoDuration)} 
            {isCapturing && ` • Every ${captureInterval}s`}
          </span>
        </div>
      </div>

      {/* Video Info */}
      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: `${brandConfig.colors.arenaSand}30` }}
      >
        <h3 
          className="text-lg font-semibold mb-2"
          style={{
            color: brandConfig.colors.stableMahogany,
            fontSize: brandConfig.typography.fontSizeLg,
            fontWeight: brandConfig.typography.weightSemiBold
          }}
        >
          {videoOption.name}
        </h3>
        <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
          {videoOption.description}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <span style={{ color: brandConfig.colors.ribbonBlue, fontSize: brandConfig.typography.fontSizeXs }}>
              📹 Duration: {videoOption.duration}
            </span>
            <span style={{ color: brandConfig.colors.championGold, fontSize: brandConfig.typography.fontSizeXs }}>
              🎯 Type: {videoOption.analysisType}
            </span>
          </div>
          
          <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeXs }}>
            {formatTime(videoTime)} / {formatTime(videoDuration)}
          </div>
        </div>

        {/* Analysis Features */}
        <div className="mt-3">
          <p style={{ 
            color: brandConfig.colors.stableMahogany, 
            fontSize: brandConfig.typography.fontSizeXs,
            fontWeight: brandConfig.typography.weightSemiBold,
            marginBottom: '8px'
          }}>
            🔍 AI Analysis Features:
          </p>
          <div className="flex flex-wrap gap-2">
            {videoOption.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: brandConfig.colors.pastureSage + '30',
                  color: brandConfig.colors.stableMahogany,
                  fontSize: brandConfig.typography.fontSizeXs
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
}; 