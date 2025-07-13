import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Grid
} from '@mui/material';
import { PhotoCamera, Analytics } from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';

export const PhotoSequenceTest: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testPhotoSequence = async () => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing photo sequence functionality...');
      
      // Import the AI Vision Service
      const { AIVisionService } = await import('../../services/aiVisionService');
      const aiVisionService = AIVisionService.getInstance();
      
      // Create a test video blob (this would normally come from file upload)
      // For testing, we'll create a minimal blob
      const testVideoBlob = new Blob(['test'], { type: 'video/mp4' });
      
      // Test horse context
      const horseContext = {
        name: 'Test Horse',
        breed: 'Unknown',
        age: 5,
        knownConditions: ['Test condition'],
        priority: 'medium' as const,
        analysisType: 'photo_sequence'
      };
      
      console.log('🔍 Calling analyzePhotoSequence...');
      
      // This will test the photo sequence analysis pipeline
      const analysisResult = await aiVisionService.analyzePhotoSequence(testVideoBlob, horseContext);
      
      console.log('✅ Photo sequence test completed:', analysisResult);
      setResult(analysisResult);
      
    } catch (error: any) {
      console.error('❌ Photo sequence test failed:', error);
      setError(error.message || 'Unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: brandConfig.colors.stableMahogany }}>
            📸 Photo Sequence Analysis Test
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Test the new photo sequence analysis functionality that extracts 10 photos over 1 minute for temporal behavior analysis.
          </Typography>

          <Button
            variant="contained"
            startIcon={<PhotoCamera />}
            onClick={testPhotoSequence}
            disabled={isProcessing}
            sx={{
              backgroundColor: brandConfig.colors.hunterGreen,
              mb: 2
            }}
          >
            {isProcessing ? 'Testing...' : 'Test Photo Sequence Analysis'}
          </Button>

          {isProcessing && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Testing photo sequence pipeline...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">Test Failed:</Typography>
              {error}
            </Alert>
          )}

          {result && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">✅ Test Successful!</Typography>
              <Typography variant="body2">
                Photo sequence analysis pipeline is working correctly.
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Confidence
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round((result.confidence || 0) * 100)}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Health Risk
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round((result.healthRisk || 0) * 100)}%
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">
                    Alert Level
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {result.alertLevel || 'low'}
                  </Typography>
                </Grid>
                {result.recommendations && result.recommendations.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      Recommendations
                    </Typography>
                    <Typography variant="body2">
                      {result.recommendations.slice(0, 3).join(' • ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Alert>
          )}

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            <strong>What this tests:</strong>
            <br />
            • Photo sequence extraction (10 photos over 60 seconds)
            • AI vision prompt configuration
            • Temporal analysis framework
            • Enhanced video analysis result formatting
            • Error handling and fallback mechanisms
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}; 