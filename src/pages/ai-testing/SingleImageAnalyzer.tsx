/**
 * 🧪 Single Image AI Filter Analyzer
 * Main page component for testing and calibrating AI optimization filters
 * 
 * This tool allows domain experts to:
 * - Upload barn surveillance images
 * - Adjust optimization thresholds in real-time
 * - See detailed filter results and recommendations
 * - Export calibrated settings for production use
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Divider, Alert, CircularProgress } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';
import { aiTestingData } from '../../config/aiTestingData';
import { AIOptimizationService } from '../../services/aiOptimizationService';
import { aiOptimizationConfig } from '../../config/aiOptimizationConfig';

// Component imports - we'll create these next
import { ImageUploader } from './components/ImageUploader';
import { ThresholdControls } from './components/ThresholdControls';
import { FilterResults } from './components/FilterResults';
import { RecommendationPanel } from './components/RecommendationPanel';

// Type imports
import type {
  ISingleImageAnalyzerState,
  ISingleImageAnalyzerProps,
  IThresholdValues,
  IRecommendation
} from '../../interfaces/AITestingTypes';
import type { IPreProcessingResult, IAnalysisContext } from '../../interfaces/AIOptimizationTypes';

// Custom hooks - we'll create these next
import { useThresholdManagement } from '../../hooks/useThresholdManagement';
import { useImageAnalysis } from '../../hooks/useImageAnalysis';
import { useRecommendationEngine } from '../../hooks/useRecommendationEngine';

export const SingleImageAnalyzer: React.FC<ISingleImageAnalyzerProps> = ({
  initialThresholds = {},
  onConfigurationChange,
  onResultsChange,
  debugMode = false
}) => {
  // Initialize AI Optimization Service
  const aiService = React.useRef(AIOptimizationService.getInstance());

  // State management using custom hooks
  const {
    thresholds,
    updateThreshold,
    updateThresholds,
    applyPreset,
    resetToDefaults,
    exportConfiguration,
    importConfiguration
  } = useThresholdManagement(initialThresholds);

  const {
    analyzeImage,
    isAnalyzing,
    error: analysisError,
    clearError: clearAnalysisError
  } = useImageAnalysis();

  const {
    recommendations,
    generateRecommendations,
    applyRecommendation,
    dismissRecommendation
  } = useRecommendationEngine();

  // Local state
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [results, setResults] = useState<IPreProcessingResult | null>(null);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);
  const [uiState, setUiState] = useState({
    expandedSections: {
      thresholds: true,
      results: true,
      recommendations: true,
      debug: debugMode
    },
    showTooltips: true,
    compactMode: false
  });

  // Callback when configuration changes
  useEffect(() => {
    onConfigurationChange?.(thresholds);
  }, [thresholds, onConfigurationChange]);

  // Callback when results change
  useEffect(() => {
    onResultsChange?.(results);
  }, [results, onResultsChange]);

  // Generate recommendations when results change
  useEffect(() => {
    if (results) {
      generateRecommendations(results, thresholds);
    }
  }, [results, thresholds, generateRecommendations]);

  // Handle image selection
  const handleImageSelect = useCallback(async (imageDataUrl: string, file: File) => {
    setImageData(imageDataUrl);
    setImageFile(file);
    setResults(null);
    clearAnalysisError();

    // Automatically analyze the image with current thresholds
    await analyzeImageWithCurrentThresholds(imageDataUrl);
  }, [clearAnalysisError]);

  // Handle image clear
  const handleImageClear = useCallback(() => {
    setImageData(null);
    setImageFile(null);
    setResults(null);
    clearAnalysisError();
  }, [clearAnalysisError]);

  // Analyze image with current threshold settings
  const analyzeImageWithCurrentThresholds = useCallback(async (imageDataToAnalyze?: string) => {
    const dataToAnalyze = imageDataToAnalyze || imageData;
    if (!dataToAnalyze) return;

    setProcessingStartTime(Date.now());

    try {
      // Create a temporary config with current threshold values
      const tempConfig = {
        ...aiOptimizationConfig,
        thresholds: {
          ...aiOptimizationConfig.thresholds,
          imageQuality: {
            ...aiOptimizationConfig.thresholds.imageQuality,
            minSharpness: thresholds.imageQuality
          },
          occupancy: {
            ...aiOptimizationConfig.thresholds.occupancy,
            minConfidence: thresholds.occupancy / 100
          },
          motion: {
            ...aiOptimizationConfig.thresholds.motion,
            minMotionScore: thresholds.motion
          },
          duplicate: {
            ...aiOptimizationConfig.thresholds.duplicate,
            maxSimilarity: thresholds.duplicate / 100
          }
        }
      };

      // Create analysis context
      const context: IAnalysisContext = {
        source: 'manual',
        priority: 'medium',
        sessionId: `testing_${Date.now()}`,
        expectedContent: 'horse'
      };

      // Analyze the image
      const result = await analyzeImage(dataToAnalyze, thresholds);
      setResults(result);

    } catch (error) {
      console.error('Failed to analyze image:', error);
    }
  }, [imageData, thresholds, analyzeImage]);

  // Handle threshold changes - re-analyze if image is loaded
  const handleThresholdChange = useCallback((newThresholds: IThresholdValues) => {
    updateThresholds(newThresholds);
    
    // Re-analyze current image with new thresholds
    if (imageData && !isAnalyzing) {
      analyzeImageWithCurrentThresholds();
    }
  }, [updateThresholds, imageData, isAnalyzing, analyzeImageWithCurrentThresholds]);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: 'conservative' | 'balanced' | 'aggressive') => {
    applyPreset(preset);
    
    // Re-analyze current image with preset thresholds
    if (imageData && !isAnalyzing) {
      analyzeImageWithCurrentThresholds();
    }
  }, [applyPreset, imageData, isAnalyzing, analyzeImageWithCurrentThresholds]);

  // Handle recommendation application
  const handleApplyRecommendation = useCallback((id: string) => {
    applyRecommendation(id);
    
    // Re-analyze current image with updated thresholds
    if (imageData && !isAnalyzing) {
      analyzeImageWithCurrentThresholds();
    }
  }, [applyRecommendation, imageData, isAnalyzing, analyzeImageWithCurrentThresholds]);

  // Styles using brandConfig
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
      padding: brandConfig.spacing.lg,
      fontFamily: brandConfig.typography.fontPrimary
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: brandConfig.spacing.xl,
      color: brandConfig.colors.stableMahogany
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: brandConfig.spacing.lg,
      maxWidth: '1400px',
      margin: '0 auto'
    },
    leftPanel: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.md
    },
    rightPanel: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.md
    },
    section: {
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.spacing.sm,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    sectionHeader: {
      marginBottom: brandConfig.spacing.md,
      color: brandConfig.colors.stableMahogany,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSizeLg
    },
    processingIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      padding: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.infoBlue,
      color: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.md
    },
    errorAlert: {
      marginBottom: brandConfig.spacing.md
    }
  };

  // Processing time calculation
  const processingTime = processingStartTime && results 
    ? results.processingTime.total 
    : null;

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography variant="h3" component="h1" sx={{ 
          fontFamily: brandConfig.typography.fontDisplay,
          fontWeight: brandConfig.typography.weightBold,
          marginBottom: brandConfig.spacing.sm
        }}>
          {aiTestingData.page.title}
        </Typography>
        <Typography variant="h6" component="h2" sx={{
          color: brandConfig.colors.neutralGray,
          fontWeight: brandConfig.typography.weightRegular
        }}>
          {aiTestingData.page.subtitle}
        </Typography>
        <Typography variant="body1" sx={{
          marginTop: brandConfig.spacing.sm,
          color: brandConfig.colors.textSecondary
        }}>
          {aiTestingData.page.description}
        </Typography>
      </Box>

      {/* Processing Indicator */}
      {isAnalyzing && (
        <Box sx={styles.processingIndicator}>
          <CircularProgress size={20} sx={{ color: brandConfig.colors.barnWhite }} />
          <Typography variant="body2">
            {aiTestingData.states.loading.title}
          </Typography>
        </Box>
      )}

      {/* Error Display */}
      {analysisError && (
        <Alert 
          severity="error" 
          sx={styles.errorAlert}
          onClose={clearAnalysisError}
        >
          {analysisError}
        </Alert>
      )}

      {/* Main Content Grid */}
      <Box sx={styles.mainContent}>
        {/* Left Panel */}
        <Box sx={styles.leftPanel}>
          {/* Image Upload Section */}
          <Paper sx={styles.section}>
            <Typography variant="h5" sx={styles.sectionHeader}>
              {aiTestingData.imageUpload.title}
            </Typography>
            <ImageUploader
              onImageSelect={handleImageSelect}
              onImageClear={handleImageClear}
              acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
              maxFileSize={50 * 1024 * 1024} // 50MB
              currentImage={imageData}
              isProcessing={isAnalyzing}
            />
          </Paper>

          {/* Filter Results Section */}
          <Paper sx={styles.section}>
            <Typography variant="h5" sx={styles.sectionHeader}>
              {aiTestingData.filterResults.title}
            </Typography>
            <FilterResults
              results={results}
              thresholds={thresholds}
              isLoading={isAnalyzing}
              processingTime={processingTime}
            />
          </Paper>
        </Box>

        {/* Right Panel */}
        <Box sx={styles.rightPanel}>
          {/* Threshold Controls Section */}
          <Paper sx={styles.section}>
            <Typography variant="h5" sx={styles.sectionHeader}>
              {aiTestingData.thresholdControls.title}
            </Typography>
            <ThresholdControls
              values={thresholds}
              onChange={handleThresholdChange}
              onPresetSelect={handlePresetSelect}
              onReset={resetToDefaults}
              onSave={() => {
                // TODO: Implement save functionality
                console.log('Save configuration:', thresholds);
              }}
              onExport={() => {
                // TODO: Implement export functionality
                const config = exportConfiguration();
                console.log('Export configuration:', config);
              }}
              onImport={(file: File) => {
                // TODO: Implement import functionality
                console.log('Import configuration from file:', file.name);
              }}
              disabled={isAnalyzing}
            />
          </Paper>

          {/* Recommendations Section */}
          <Paper sx={styles.section}>
            <Typography variant="h5" sx={styles.sectionHeader}>
              {aiTestingData.recommendations.title}
            </Typography>
            <RecommendationPanel
              recommendations={recommendations}
              onApply={handleApplyRecommendation}
              onDismiss={dismissRecommendation}
            />
          </Paper>
        </Box>
      </Box>

      {/* Debug Section (only in development) */}
      {debugMode && results && (
        <Paper sx={{ ...styles.section, marginTop: brandConfig.spacing.lg }}>
          <Typography variant="h5" sx={styles.sectionHeader}>
            {aiTestingData.debug.title}
          </Typography>
          <pre style={{
            backgroundColor: brandConfig.colors.neutralGray,
            color: brandConfig.colors.barnWhite,
            padding: brandConfig.spacing.md,
            borderRadius: brandConfig.spacing.sm,
            overflow: 'auto',
            fontSize: brandConfig.typography.fontSizeSm,
            fontFamily: brandConfig.typography.fontMono
          }}>
            {JSON.stringify({
              thresholds,
              results,
              processingTime,
              recommendations: recommendations.map(r => ({ id: r.id, title: r.title, category: r.category }))
            }, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
}; 