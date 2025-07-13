/**
 * 🔧 Simple Threshold Tester - Immediate Debugging Tool
 * Bypasses compilation issues to test threshold calibration immediately
 */

import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Paper, Slider, Alert } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';

interface IThresholds {
  imageQuality: number;
  occupancy: number;
  motion: number;
  duplicate: number;
}

export const SimpleThresholdTester: React.FC = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState<IThresholds>({
    imageQuality: 12,  // CALIBRATED: Was 25, now 12
    occupancy: 10,     // CALIBRATED: Was 30, now 10  
    motion: 5,         // CALIBRATED: Was 15, now 5
    duplicate: 85      // CALIBRATED: Unchanged
  });
  const [results, setResults] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple image quality assessment
  const assessImageQuality = async (imageDataUrl: string): Promise<any> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ score: 0, passed: false, reason: 'Canvas not supported' });
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple brightness calculation
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          totalBrightness += brightness;
        }
        const avgBrightness = totalBrightness / (data.length / 4);
        const brightnessScore = (avgBrightness / 255) * 100;

        // Simple contrast calculation (difference between max and min)
        let minBrightness = 255;
        let maxBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          minBrightness = Math.min(minBrightness, brightness);
          maxBrightness = Math.max(maxBrightness, brightness);
        }
        const contrastScore = ((maxBrightness - minBrightness) / 255) * 100;

        // Simulate quality score
        const qualityScore = (brightnessScore + contrastScore) / 2;
        const passed = qualityScore >= thresholds.imageQuality;

        resolve({
          score: Math.round(qualityScore),
          passed,
          reason: passed ? 'Quality sufficient' : `Quality too low: ${Math.round(qualityScore)}% < ${thresholds.imageQuality}%`,
          details: {
            brightness: Math.round(brightnessScore),
            contrast: Math.round(contrastScore),
            resolution: `${img.width}x${img.height}`
          }
        });
      };
      img.src = imageDataUrl;
    });
  };

  // Simple occupancy detection
  const detectOccupancy = async (imageDataUrl: string): Promise<any> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ hasOccupancy: false, confidence: 0, reason: 'Canvas not supported' });
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple pixel density calculation
        let nonEmptyPixels = 0;
        const totalPixels = data.length / 4;
        
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > 30) { // Not too dark
            nonEmptyPixels++;
          }
        }
        
        const density = (nonEmptyPixels / totalPixels) * 100;
        const confidence = Math.min(density / 50, 1) * 100; // Normalize to 0-100
        const hasOccupancy = confidence >= thresholds.occupancy;

        resolve({
          hasOccupancy,
          confidence: Math.round(confidence),
          reason: hasOccupancy ? 'Occupancy detected' : `Confidence too low: ${Math.round(confidence)}% < ${thresholds.occupancy}%`,
          details: {
            pixelDensity: Math.round(density),
            threshold: thresholds.occupancy
          }
        });
      };
      img.src = imageDataUrl;
    });
  };

  // Simple motion detection (placeholder)
  const detectMotion = async (): Promise<any> => {
    const motionScore = Math.random() * 20; // Simulate motion score
    const passed = motionScore >= thresholds.motion;
    
    return {
      motionDetected: passed,
      score: Math.round(motionScore),
      reason: passed ? 'Motion detected' : `Motion too low: ${Math.round(motionScore)}% < ${thresholds.motion}%`,
      details: {
        algorithm: 'simulated',
        threshold: thresholds.motion
      }
    };
  };

  // Process image with current thresholds
  const processImage = async () => {
    if (!imageData) return;

    setProcessing(true);
    setResults(null);

    try {
      // Run all assessments
      const imageQuality = await assessImageQuality(imageData);
      const occupancy = await detectOccupancy(imageData);
      const motion = await detectMotion();
      
      // Determine final decision
      const allPassed = imageQuality.passed && occupancy.hasOccupancy && motion.motionDetected;
      
      const result = {
        shouldProceed: allPassed,
        decision: allPassed ? 'PROCEED with AI Analysis' : 'SKIP Analysis',
        tokensSaved: allPassed ? 0 : 1200,
        filters: {
          imageQuality,
          occupancy,
          motion,
          duplicate: { isDuplicate: false, reason: 'First image in session' }
        },
        summary: {
          passed: [imageQuality.passed, occupancy.hasOccupancy, motion.motionDetected].filter(p => p).length,
          total: 3,
          recommendation: allPassed ? 'Process this image' : 'Skip to save tokens'
        }
      };

      setResults(result);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageData(dataUrl);
      setResults(null);
    };
    reader.readAsDataURL(file);
  };

  const styles = {
    container: {
      padding: brandConfig.spacing.lg,
      maxWidth: '1200px',
      margin: '0 auto'
    },
    paper: {
      padding: brandConfig.spacing.lg,
      margin: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.arenaSand
    },
    uploadArea: {
      border: `2px dashed ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.spacing.sm,
      padding: brandConfig.spacing.xl,
      textAlign: 'center' as const,
      cursor: 'pointer',
      backgroundColor: brandConfig.colors.arenaSand
    },
    image: {
      maxWidth: '100%',
      maxHeight: '300px',
      borderRadius: brandConfig.spacing.sm
    },
    slider: {
      color: brandConfig.colors.stableMahogany,
      margin: brandConfig.spacing.md
    },
    resultCard: {
      padding: brandConfig.spacing.md,
      margin: brandConfig.spacing.sm,
      borderRadius: brandConfig.spacing.sm,
      backgroundColor: '#ffffff'
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={{ 
        color: brandConfig.colors.stableMahogany,
        marginBottom: brandConfig.spacing.lg 
      }}>
        🔧 Simple Threshold Tester - Debug Mode
      </Typography>

      <Alert severity="info" sx={{ marginBottom: brandConfig.spacing.lg }}>
        <strong>CALIBRATED THRESHOLDS:</strong> Image Quality: {thresholds.imageQuality}% (was 25%), 
        Occupancy: {thresholds.occupancy}% (was 30%), Motion: {thresholds.motion}% (was 15%)
      </Alert>

      {/* Image Upload */}
      <Paper sx={styles.paper}>
        <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.md }}>
          📸 Upload Test Image
        </Typography>
        
        <Box 
          sx={styles.uploadArea}
          onClick={() => fileInputRef.current?.click()}
        >
          {imageData ? (
            <img src={imageData} alt="Test" style={styles.image} />
          ) : (
            <Typography>Click to select image (JPG, PNG, WEBP)</Typography>
          )}
        </Box>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </Paper>

      {/* Threshold Controls */}
      <Paper sx={styles.paper}>
        <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.md }}>
          ⚙️ Live Threshold Adjustment
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: brandConfig.spacing.lg }}>
          <Box>
            <Typography>Image Quality: {thresholds.imageQuality}%</Typography>
            <Slider
              value={thresholds.imageQuality}
              min={0}
              max={50}
              step={1}
              onChange={(_, value) => setThresholds(prev => ({ ...prev, imageQuality: value as number }))}
              sx={styles.slider}
            />
          </Box>
          
          <Box>
            <Typography>Occupancy: {thresholds.occupancy}%</Typography>
            <Slider
              value={thresholds.occupancy}
              min={0}
              max={50}
              step={1}
              onChange={(_, value) => setThresholds(prev => ({ ...prev, occupancy: value as number }))}
              sx={styles.slider}
            />
          </Box>
          
          <Box>
            <Typography>Motion: {thresholds.motion}%</Typography>
            <Slider
              value={thresholds.motion}
              min={0}
              max={30}
              step={1}
              onChange={(_, value) => setThresholds(prev => ({ ...prev, motion: value as number }))}
              sx={styles.slider}
            />
          </Box>
          
          <Box>
            <Typography>Duplicate: {thresholds.duplicate}%</Typography>
            <Slider
              value={thresholds.duplicate}
              min={50}
              max={100}
              step={1}
              onChange={(_, value) => setThresholds(prev => ({ ...prev, duplicate: value as number }))}
              sx={styles.slider}
            />
          </Box>
        </Box>
        
        <Button
          variant="contained"
          onClick={processImage}
          disabled={!imageData || processing}
          sx={{
            backgroundColor: brandConfig.colors.stableMahogany,
            marginTop: brandConfig.spacing.lg
          }}
        >
          {processing ? 'Processing...' : 'Test Current Thresholds'}
        </Button>
      </Paper>

      {/* Results */}
      {results && (
        <Paper sx={styles.paper}>
          <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.md }}>
            📊 Analysis Results
          </Typography>
          
          <Alert 
            severity={results.shouldProceed ? 'success' : 'warning'}
            sx={{ marginBottom: brandConfig.spacing.md }}
          >
            <strong>{results.decision}</strong>
            {!results.shouldProceed && ` (${results.tokensSaved} tokens saved)`}
          </Alert>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: brandConfig.spacing.md }}>
            {Object.entries(results.filters).map(([key, filter]: [string, any]) => (
              <Box key={key} sx={styles.resultCard}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
                <Typography color={filter.passed || filter.hasOccupancy || filter.motionDetected ? 'success.main' : 'error.main'}>
                  {filter.reason}
                </Typography>
                {filter.details && (
                  <Typography variant="caption" sx={{ display: 'block', marginTop: brandConfig.spacing.xs }}>
                    {JSON.stringify(filter.details)}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
          
          <Typography sx={{ marginTop: brandConfig.spacing.md }}>
            <strong>Summary:</strong> {results.summary.passed}/{results.summary.total} filters passed. 
            {results.summary.recommendation}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}; 