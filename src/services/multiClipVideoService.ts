import { aiVisionService } from './aiVisionService';

// FFmpeg-like functionality using WebCodecs API or fallback
interface VideoClip {
  blob: Blob;
  startTime: number;
  endTime: number;
  duration: number;
}

interface MultiClipRecordingSession {
  sessionId: string;
  clips: VideoClip[];
  totalDuration: number;
  targetDuration: number;
  clipDuration: number;
  isRecording: boolean;
  currentClipIndex: number;
  onProgress?: (progress: MultiClipProgress) => void;
  onClipComplete?: (clipIndex: number, clip: VideoClip) => void;
  onSessionComplete?: (finalVideo: Blob) => void;
  onError?: (error: Error) => void;
}

interface MultiClipProgress {
  totalProgress: number; // 0-100%
  currentClip: number; // 1-3
  clipProgress: number; // 0-100% for current clip
  phase: 'recording' | 'combining' | 'converting' | 'analyzing' | 'complete';
  message: string;
}

export class MultiClipVideoService {
  private static instance: MultiClipVideoService;
  private activeSessions: Map<string, MultiClipRecordingSession> = new Map();
  private mediaRecorders: Map<string, MediaRecorder> = new Map();
  private recordingTimers: Map<string, NodeJS.Timeout> = new Map();

  public static getInstance(): MultiClipVideoService {
    if (!MultiClipVideoService.instance) {
      MultiClipVideoService.instance = new MultiClipVideoService();
    }
    return MultiClipVideoService.instance;
  }

  /**
   * Start recording session with 3x 10-second clips
   */
  public async startMultiClipRecording(
    stream: MediaStream,
    options: {
      clipDuration?: number;
      totalClips?: number;
      horseName?: string;
      outputFormat?: 'webm' | 'mp4';
      onProgress?: (progress: MultiClipProgress) => void;
      onClipComplete?: (clipIndex: number, clip: VideoClip) => void;
      onSessionComplete?: (finalVideo: Blob) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const {
      clipDuration = 9, // 9 seconds per clip (optimized for rate limiting)
      totalClips = 3,   // 3 clips total
      horseName = 'Unknown Horse',
      outputFormat = 'mp4', // Default to MP4 for better AI analysis
      onProgress,
      onClipComplete,
      onSessionComplete,
      onError
    } = options;

    console.log(`🎬 Multi-clip recording: ${totalClips}x${clipDuration}s clips (${sessionId})`);

    const session: MultiClipRecordingSession = {
      sessionId,
      clips: [],
      totalDuration: totalClips * clipDuration,
      targetDuration: totalClips * clipDuration,
      clipDuration,
      isRecording: false,
      currentClipIndex: 0,
      onProgress,
      onClipComplete,
      onSessionComplete,
      onError
    };

    this.activeSessions.set(sessionId, session);

    try {
      await this.recordNextClip(sessionId, stream);
      return sessionId;
    } catch (error) {
      console.error(`❌ Failed to start multi-clip recording:`, error);
      this.cleanup(sessionId);
      throw error;
    }
  }

  /**
   * Record the next clip in the sequence
   */
  private async recordNextClip(sessionId: string, stream: MediaStream): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const clipIndex = session.currentClipIndex;
    const totalClips = 3; // Fixed to 3 clips

    if (clipIndex >= totalClips) {
      await this.combineClipsAndAnalyze(sessionId);
      return;
    }

    // Update progress
    if (session.onProgress) {
      session.onProgress({
        totalProgress: (clipIndex / totalClips) * 70, // 70% for recording, 30% for processing
        currentClip: clipIndex + 1,
        clipProgress: 0,
        phase: 'recording',
        message: `Recording clip ${clipIndex + 1} of ${totalClips}...`
      });
    }

    try {
      // Create MediaRecorder for this clip with optimal settings
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.getBestMimeType()
      });

      const chunks: Blob[] = [];
      const startTime = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const clipBlob = new Blob(chunks, { type: mediaRecorder.mimeType });

        const clip: VideoClip = {
          blob: clipBlob,
          startTime,
          endTime,
          duration
        };

        // Add clip to session
        session.clips.push(clip);
        session.currentClipIndex++;

        // Callback for clip completion
        if (session.onClipComplete) {
          session.onClipComplete(clipIndex + 1, clip);
        }

        // Clean up
        this.mediaRecorders.delete(sessionId);
        const timer = this.recordingTimers.get(sessionId);
        if (timer) {
          clearTimeout(timer);
          this.recordingTimers.delete(sessionId);
        }

        // Record next clip immediately (no gap for exact 30.0s total)
        this.recordNextClip(sessionId, stream).catch(error => {
          console.error(`❌ Failed to record next clip:`, error);
          if (session.onError) {
            session.onError(error);
          }
        });
      };

      // Start recording
      mediaRecorder.start(1000); // Request data every second
      this.mediaRecorders.set(sessionId, mediaRecorder);
      session.isRecording = true;

      // Set timer to stop recording after clip duration
      const timer = setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          session.isRecording = false;
        }
      }, session.clipDuration * 1000);

      this.recordingTimers.set(sessionId, timer);

      // Progress tracking during recording
      const progressInterval = setInterval(() => {
        if (mediaRecorder.state !== 'recording') {
          clearInterval(progressInterval);
          return;
        }

        const elapsed = (Date.now() - startTime) / 1000;
        const clipProgress = Math.min((elapsed / session.clipDuration) * 100, 100);

        if (session.onProgress) {
          session.onProgress({
            totalProgress: ((clipIndex / totalClips) * 70) + ((clipProgress / 100) * (70 / totalClips)),
            currentClip: clipIndex + 1,
            clipProgress,
            phase: 'recording',
            message: `Recording clip ${clipIndex + 1} of ${totalClips}... ${elapsed.toFixed(1)}s/${session.clipDuration}s`
          });
        }
      }, 100);

    } catch (error) {
      console.error(`❌ Failed to record clip ${clipIndex + 1}:`, error);
      session.isRecording = false;
      throw error;
    }
  }

  /**
   * Get the best available MIME type for recording
   */
  private getBestMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/mp4;codecs=h264,aac',
      'video/webm'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'video/webm';
  }

  /**
   * Combine all clips into a single video and send to AI
   */
  private async combineClipsAndAnalyze(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    if (session.onProgress) {
      session.onProgress({
        totalProgress: 70,
        currentClip: session.clips.length,
        clipProgress: 100,
        phase: 'combining',
        message: 'Combining video clips...'
      });
    }

    try {
      // Combine clips into a single video
      const combinedVideo = await this.combineVideoBlobs(session.clips);

      if (session.onProgress) {
        session.onProgress({
          totalProgress: 85,
          currentClip: session.clips.length,
          clipProgress: 100,
          phase: 'converting',
          message: 'Converting to optimized format...'
        });
      }

      // Convert to MP4 if not already in a compatible format
      const finalVideo = await this.convertToOptimalFormat(combinedVideo);

      if (session.onProgress) {
        session.onProgress({
          totalProgress: 90,
          currentClip: session.clips.length,
          clipProgress: 100,
          phase: 'analyzing',
          message: 'Sending to AI for analysis...'
        });
      }

      // Send to AI for analysis
      const analysisResult = await aiVisionService.analyzeVideoSegment(finalVideo, {
        name: 'Multi-clip Recording',
        segmentDuration: session.totalDuration,
        priority: 'high',
        videoMode: true,
        multiClipSession: true,
        sessionId: sessionId,
        totalClips: session.clips.length,
        videoFormat: 'optimized_mp4'
      });

      if (session.onProgress) {
        session.onProgress({
          totalProgress: 100,
          currentClip: session.clips.length,
          clipProgress: 100,
          phase: 'complete',
          message: 'Analysis complete!'
        });
      }

      // Session complete callback
      if (session.onSessionComplete) {
        session.onSessionComplete(finalVideo);
      }

      // Store the result for retrieval
      this.storeSessionResult(sessionId, {
        combinedVideo: finalVideo,
        analysisResult,
        clips: session.clips
      });

    } catch (error) {
      console.error(`❌ Failed to combine clips and analyze:`, error);
      if (session.onError) {
        session.onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    } finally {
      this.cleanup(sessionId);
    }
  }

  /**
   * Combine multiple video blobs into one
   * This is a simplified approach. For production, consider using FFmpeg.wasm
   */
  private async combineVideoBlobs(clips: VideoClip[]): Promise<Blob> {
    try {
      // For proper video concatenation, we would use FFmpeg.wasm
      // For now, we'll use a simple concatenation approach
      const allChunks: Blob[] = clips.map(clip => clip.blob);
      const combinedBlob = new Blob(allChunks, { 
        type: clips[0]?.blob.type || 'video/webm' 
      });
      
      return combinedBlob;
    } catch (error) {
      console.error(`❌ Failed to combine video blobs:`, error);
      throw error;
    }
  }

  /**
   * Convert video to optimal format for AI analysis
   * This is a placeholder for MP4 conversion
   */
  private async convertToOptimalFormat(videoBlob: Blob): Promise<Blob> {
    try {
      // For now, we'll return the original blob
      // In production, you would use FFmpeg.wasm to convert to MP4
      // with specific codecs that work better with AI vision models
      
      // Check if it's already in a good format
      const mimeType = videoBlob.type;
      if (mimeType.includes('mp4') || mimeType.includes('h264')) {
        return videoBlob;
      }
      
      // For WebM, we'll keep it as-is for now
      // Future enhancement: Convert WebM to MP4 using FFmpeg.wasm
      return videoBlob;
    } catch (error) {
      console.error(`❌ Failed to convert video format:`, error);
      // Return original on conversion failure
      return videoBlob;
    }
  }

  /**
   * Stop recording session
   */
  public stopRecording(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;



    // Stop current MediaRecorder
    const mediaRecorder = this.mediaRecorders.get(sessionId);
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }

    // Clear timer
    const timer = this.recordingTimers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
    }

    session.isRecording = false;
    this.cleanup(sessionId);
  }

  /**
   * Get recording session status
   */
  public getSessionStatus(sessionId: string): {
    isRecording: boolean;
    currentClip: number;
    totalClips: number;
    clipsCompleted: number;
    totalDuration: number;
  } | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    return {
      isRecording: session.isRecording,
      currentClip: session.currentClipIndex + 1,
      totalClips: 3,
      clipsCompleted: session.clips.length,
      totalDuration: session.totalDuration
    };
  }

  /**
   * Store session result for later retrieval
   */
  private storeSessionResult(sessionId: string, result: any): void {
    try {
      // Store in localStorage with size limit check
      const resultData = {
        sessionId,
        timestamp: Date.now(),
        combinedVideoSize: result.combinedVideo.size,
        analysisResult: result.analysisResult,
        clipCount: result.clips.length
      };

      localStorage.setItem(`multiClipSession_${sessionId}`, JSON.stringify(resultData));
    } catch (error) {
      console.warn(`⚠️ Failed to store session result:`, error);
    }
  }

  /**
   * Clean up session resources
   */
  private cleanup(sessionId: string): void {
    // Remove from active sessions
    this.activeSessions.delete(sessionId);

    // Clean up MediaRecorder
    const mediaRecorder = this.mediaRecorders.get(sessionId);
    if (mediaRecorder) {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      this.mediaRecorders.delete(sessionId);
    }

    // Clear timer
    const timer = this.recordingTimers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.recordingTimers.delete(sessionId);
    }
  }

  /**
   * Get all active sessions
   */
  public getActiveSessions(): string[] {
    return Array.from(this.activeSessions.keys());
  }

  /**
   * Clean up all sessions (useful for component unmount)
   */
  public cleanupAllSessions(): void {
    for (const sessionId of this.activeSessions.keys()) {
      this.cleanup(sessionId);
    }
  }

  /**
   * Future enhancement: Load FFmpeg.wasm for proper video processing
   */
  private async loadFFmpeg(): Promise<any> {
    try {
      // Placeholder for FFmpeg.wasm integration
      // const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
      // const ffmpeg = createFFmpeg({ log: true });
      // await ffmpeg.load();
      // return ffmpeg;
      
      return null;
    } catch (error) {
      console.warn('⚠️ FFmpeg.wasm not available, using fallback video processing');
      return null;
    }
  }
}

// Export singleton instance
export const multiClipVideoService = MultiClipVideoService.getInstance();

// Export types
export type { MultiClipProgress, VideoClip, MultiClipRecordingSession }; 