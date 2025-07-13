/**
 * 🧪 Batch Tester Component
 * Automated testing system for validating horse detection on skipped images
 */

import React, { useState, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Grid, Chip, Alert } from '@mui/material';
import { PlayArrow, Download, Assignment, Speed, CheckCircle, Error } from '@mui/icons-material';
import { BatchTestingService } from '../../services/batchTestingService';
import { getOptimizedConfig } from '../../config/horseDetectionConfig';
import { brandConfig } from '../../config/brandConfig';
import type { IBatchTestReport, IBatchTestResult } from '../../interfaces/HorseDetectionTypes';

export const BatchTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [testResults, setTestResults] = useState<IBatchTestReport | null>(null);
  const [selectedMode, setSelectedMode] = useState<'balanced' | 'precise' | 'sensitive' | 'night' | 'fast'>('balanced');

  /**
   * 🚀 Run comprehensive batch testing
   */
  const runBatchTest = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentFile('');
    setTestResults(null);

    try {
      console.log('🧪 Starting batch test with mode:', selectedMode);
      
      const config = getOptimizedConfig(selectedMode);
      const batchTester = BatchTestingService.getInstance(config);
      
      // First, let user select files
      console.log('📁 Opening file selection dialog...');
      const files = await batchTester.getImageFilesFromUserSelection();
      
      if (files.length === 0) {
        alert('No files selected. Please select images to test.');
        return;
      }
      
      console.log(`📁 Selected ${files.length} files for testing`);
      
      const results = await batchTester.runBatchTestWithFiles(
        files,
        selectedMode,
        (progressPercent: number, filename: string) => {
          setProgress(progressPercent);
          setCurrentFile(filename);
        }
      );
      
      setTestResults(results);
      console.log('✅ Batch testing completed:', results);
      
    } catch (error) {
      console.error('❌ Batch testing failed:', error);
      alert(`Batch testing failed: ${error}`);
    } finally {
      setIsRunning(false);
      setProgress(0);
      setCurrentFile('');
    }
  }, [selectedMode]);

  /**
   * 📥 Export results as JSON
   */
  const exportJSON = useCallback(() => {
    if (!testResults) return;
    
    const batchTester = BatchTestingService.getInstance(getOptimizedConfig(selectedMode));
    batchTester.exportResults(testResults);
  }, [testResults, selectedMode]);

  /**
   * 📊 Export results as CSV
   */
  const exportCSV = useCallback(() => {
    if (!testResults) return;
    
    const batchTester = BatchTestingService.getInstance(getOptimizedConfig(selectedMode));
    batchTester.exportResultsCSV(testResults);
  }, [testResults, selectedMode]);

  /**
   * 🎨 Get status color based on result
   */
  const getResultColor = (hasHorse: boolean, confidence: number) => {
    if (hasHorse && confidence > 0.7) return brandConfig.colors.success;
    if (hasHorse && confidence > 0.3) return brandConfig.colors.warning;
    if (!hasHorse) return brandConfig.colors.error;
    return brandConfig.colors.text;
  };

  const styles = {
    container: {
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.background,
      minHeight: '100vh'
    },
    card: {
      marginBottom: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    modeButton: {
      margin: brandConfig.spacing.xs,
      borderRadius: brandConfig.layout.borderRadius
    },
    progressContainer: {
      width: '100%',
      marginTop: brandConfig.spacing.md,
      marginBottom: brandConfig.spacing.sm
    },
    resultsGrid: {
      marginTop: brandConfig.spacing.lg
    },
    resultCard: {
      marginBottom: brandConfig.spacing.sm,
      borderRadius: brandConfig.layout.borderRadius,
      minHeight: '120px'
    },
    exportButtons: {
      display: 'flex',
      gap: brandConfig.spacing.sm,
      marginTop: brandConfig.spacing.md
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Card sx={styles.card}>
        <CardContent>
          <Typography variant="h4" sx={{ 
            color: brandConfig.colors.stableMahogany,
            marginBottom: brandConfig.spacing.md,
            display: 'flex',
            alignItems: 'center',
            gap: brandConfig.spacing.sm
          }}>
            <Assignment />
            🧪 Automated Batch Testing
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: brandConfig.colors.text,
            marginBottom: brandConfig.spacing.lg
          }}>
            Select images from your skipped frames directory and run comprehensive batch analysis with detailed debugging reports.
            <br /><br />
            📁 <strong>Instructions:</strong>
            <br />• Navigate to: <code>C:\Users\travi\OneDrive\Documents\Development\One_Barn\development\one_barn_app\public\images\frames\skipped</code>
            <br />• Select all images you want to test (Ctrl+A to select all)
            <br />• Click "Start Batch Testing" and select your images in the file dialog
            <br />• Get detailed JSON/CSV reports with all debug information for analysis
          </Typography>

          {/* Mode Selection */}
          <Typography variant="h6" sx={{ 
            color: brandConfig.colors.hunterGreen,
            marginBottom: brandConfig.spacing.sm
          }}>
            🎯 Detection Mode:
          </Typography>
          
          <Box sx={{ marginBottom: brandConfig.spacing.lg }}>
            {(['balanced', 'precise', 'sensitive', 'night', 'fast'] as const).map((mode) => (
              <Button
                key={mode}
                variant={selectedMode === mode ? 'contained' : 'outlined'}
                onClick={() => setSelectedMode(mode)}
                sx={{
                  ...styles.modeButton,
                  backgroundColor: selectedMode === mode ? brandConfig.colors.stableMahogany : 'transparent',
                  borderColor: brandConfig.colors.stableMahogany,
                  color: selectedMode === mode ? brandConfig.colors.arenaSand : brandConfig.colors.stableMahogany,
                  '&:hover': {
                    backgroundColor: selectedMode === mode ? brandConfig.colors.stableMahogany : brandConfig.colors.background
                  }
                }}
              >
                {mode.toUpperCase()}
              </Button>
            ))}
          </Box>

          {/* Debug Information Captured */}
          <Typography variant="h6" sx={{ 
            color: brandConfig.colors.hunterGreen,
            marginBottom: brandConfig.spacing.sm
          }}>
            🔍 Debug Information Captured:
          </Typography>
          
          <Typography variant="body2" sx={{ 
            color: brandConfig.colors.text,
            marginBottom: brandConfig.spacing.lg,
            fontSize: brandConfig.typography.fontSizeSm
          }}>
            <strong>Each image will be analyzed and the following data captured:</strong>
            <br />• <strong>Color Analysis:</strong> Brown, black, chestnut, white, gray, palomino, dun pixel counts
            <br />• <strong>Shape Analysis:</strong> Aspect ratios, shape scores, edge detection, curved elements
            <br />• <strong>Human Detection:</strong> Skin pixel detection, face feature analysis
            <br />• <strong>Black Screen Detection:</strong> Empty content, low information analysis
            <br />• <strong>Confidence Breakdown:</strong> Weighted calculations (60% color, 35% shape, 5% motion)
            <br />• <strong>Performance Metrics:</strong> Processing time, token savings, cost analysis
            <br />• <strong>Image Metadata:</strong> Dimensions, aspect ratio, pixel count
            <br />• <strong>All Console Logs:</strong> Complete debug trail for troubleshooting
          </Typography>

          {/* Run Test Button */}
          <Button
            variant="contained"
            onClick={runBatchTest}
            disabled={isRunning}
            sx={{
              backgroundColor: brandConfig.colors.hunterGreen,
              color: brandConfig.colors.arenaSand,
              padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.lg}`,
              fontSize: brandConfig.typography.fontSizeLg,
              borderRadius: brandConfig.layout.borderRadius,
                             '&:hover': {
                 backgroundColor: brandConfig.colors.hunterGreen
               },
               '&:disabled': {
                 backgroundColor: '#cccccc'
               }
            }}
                     >
             <PlayArrow sx={{ marginRight: brandConfig.spacing.sm }} />
             {isRunning ? 'Running Tests...' : 'Start Batch Testing'}
           </Button>

          {/* Progress Display */}
          {isRunning && (
            <Box sx={styles.progressContainer}>
              <Typography variant="body2" sx={{ 
                color: brandConfig.colors.text,
                marginBottom: brandConfig.spacing.xs
              }}>
                Processing: {currentFile}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress}
                                 sx={{
                   height: 8,
                   borderRadius: 4,
                   backgroundColor: '#e0e0e0',
                   '& .MuiLinearProgress-bar': {
                     backgroundColor: brandConfig.colors.hunterGreen
                   }
                 }}
              />
              <Typography variant="body2" sx={{ 
                color: brandConfig.colors.text,
                marginTop: brandConfig.spacing.xs,
                textAlign: 'center'
              }}>
                {progress}% Complete
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      {testResults && (
        <Card sx={styles.card}>
          <CardContent>
            <Typography variant="h5" sx={{ 
              color: brandConfig.colors.stableMahogany,
              marginBottom: brandConfig.spacing.md,
              display: 'flex',
              alignItems: 'center',
              gap: brandConfig.spacing.sm
            }}>
              <Speed />
              📊 Test Results Summary
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', padding: brandConfig.spacing.md }}>
                  <Typography variant="h3" sx={{ color: brandConfig.colors.hunterGreen }}>
                    {testResults.summary.totalImages}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandConfig.colors.text }}>
                    Total Images
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', padding: brandConfig.spacing.md }}>
                  <Typography variant="h3" sx={{ color: brandConfig.colors.success }}>
                    {testResults.summary.horsesDetected}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandConfig.colors.text }}>
                    Horses Detected
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', padding: brandConfig.spacing.md }}>
                  <Typography variant="h3" sx={{ color: brandConfig.colors.warning }}>
                    {testResults.summary.totalTokensSaved.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandConfig.colors.text }}>
                    Tokens Saved
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', padding: brandConfig.spacing.md }}>
                  <Typography variant="h3" sx={{ color: brandConfig.colors.stableMahogany }}>
                    ${testResults.summary.totalCostSavings.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandConfig.colors.text }}>
                    Cost Savings
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ marginTop: brandConfig.spacing.lg }}>
              <Typography variant="body2" sx={{ color: brandConfig.colors.text, marginBottom: brandConfig.spacing.sm }}>
                <strong>Average Processing Time:</strong> {testResults.summary.averageProcessingTime.toFixed(1)}ms
              </Typography>
              <Typography variant="body2" sx={{ color: brandConfig.colors.text, marginBottom: brandConfig.spacing.sm }}>
                <strong>Average Confidence:</strong> {(testResults.summary.averageConfidence * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: brandConfig.colors.text, marginBottom: brandConfig.spacing.sm }}>
                <strong>Test Duration:</strong> {(testResults.summary.testDuration / 1000).toFixed(1)} seconds
              </Typography>
            </Box>

            {/* Rejection Breakdown */}
            <Box sx={{ marginTop: brandConfig.spacing.lg }}>
              <Typography variant="h6" sx={{ 
                color: brandConfig.colors.hunterGreen,
                marginBottom: brandConfig.spacing.sm
              }}>
                🚫 Rejection Breakdown:
              </Typography>
              <Box sx={{ display: 'flex', gap: brandConfig.spacing.sm, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Human Faces: ${testResults.summary.humanFacesRejected}`}
                  color="error"
                  size="small"
                />
                <Chip 
                  label={`Black Screens: ${testResults.summary.blackScreensRejected}`}
                  color="warning"
                  size="small"
                />
                <Chip 
                  label={`Low Content: ${testResults.summary.lowContentRejected}`}
                  color="info"
                  size="small"
                />
              </Box>
            </Box>

            {/* Export Buttons */}
            <Box sx={styles.exportButtons}>
              <Button
                variant="contained"
                onClick={exportJSON}
                                 sx={{
                   backgroundColor: brandConfig.colors.stableMahogany,
                   color: brandConfig.colors.arenaSand,
                   '&:hover': {
                     backgroundColor: brandConfig.colors.stableMahogany
                   }
                 }}
              >
                <Download sx={{ marginRight: brandConfig.spacing.xs }} />
                Export JSON
              </Button>
              <Button
                variant="outlined"
                onClick={exportCSV}
                                 sx={{
                   borderColor: brandConfig.colors.stableMahogany,
                   color: brandConfig.colors.stableMahogany,
                   '&:hover': {
                     backgroundColor: brandConfig.colors.background
                   }
                 }}
              >
                <Download sx={{ marginRight: brandConfig.spacing.xs }} />
                Export CSV
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Individual Results */}
      {testResults && testResults.results.length > 0 && (
        <Card sx={styles.card}>
          <CardContent>
            <Typography variant="h5" sx={{ 
              color: brandConfig.colors.stableMahogany,
              marginBottom: brandConfig.spacing.md
            }}>
              🔍 Individual Test Results
            </Typography>

            <Grid container spacing={2} sx={styles.resultsGrid}>
              {testResults.results.map((result: IBatchTestResult, index: number) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card sx={{
                    ...styles.resultCard,
                    borderLeft: `4px solid ${getResultColor(result.hasHorse, result.finalConfidence)}`
                  }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 'bold',
                        marginBottom: brandConfig.spacing.xs,
                        fontSize: brandConfig.typography.fontSizeSm
                      }}>
                        {result.filename.length > 30 ? 
                          `${result.filename.substring(0, 30)}...` : 
                          result.filename
                        }
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: brandConfig.spacing.xs }}>
                        <Chip
                          icon={result.hasHorse ? <CheckCircle /> : <Error />}
                          label={result.hasHorse ? 'HORSE' : 'NO HORSE'}
                          color={result.hasHorse ? 'success' : 'error'}
                          size="small"
                        />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {(result.finalConfidence * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" sx={{ 
                        color: brandConfig.colors.text,
                        fontSize: brandConfig.typography.fontSizeXs,
                        marginBottom: brandConfig.spacing.xs
                      }}>
                        {result.reason}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ 
                        color: brandConfig.colors.textSecondary,
                        fontSize: brandConfig.typography.fontSizeXs
                      }}>
                        Time: {result.processingTime}ms | Tokens: {result.tokensSavedEstimate}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Errors Display */}
      {testResults && testResults.errors.length > 0 && (
        <Alert severity="warning" sx={{ marginTop: brandConfig.spacing.md }}>
          <Typography variant="body2">
            <strong>Errors occurred during testing:</strong>
          </Typography>
          {testResults.errors.map((error, index) => (
            <Typography key={index} variant="body2" sx={{ marginTop: brandConfig.spacing.xs }}>
              • {error.filename}: {error.error}
            </Typography>
          ))}
        </Alert>
      )}
    </Box>
  );
};

export default BatchTester; 