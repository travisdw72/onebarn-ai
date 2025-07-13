import React, { useState, useEffect } from 'react';
import { Card, Typography, Box } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';

interface ISimpleWyzeCameraProps {
  refreshInterval?: number; // in seconds
}

export const SimpleWyzeCamera: React.FC<ISimpleWyzeCameraProps> = ({ 
  refreshInterval = 3 
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = () => {
      const timestamp = new Date().getTime();
      const newImageUrl = `http://localhost:8888/snapshot/wyze.jpg?t=${timestamp}`;
      setImageUrl(newImageUrl);
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    // Initial fetch
    fetchImage();

    // Set up interval for refreshing
    const interval = setInterval(fetchImage, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleImageError = () => {
    setIsLoading(false);
    console.log('Image load error - check if Wyze bridge is running on localhost:8888');
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Card sx={{ 
      padding: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.layout.borderRadius
    }}>
      <Box sx={{ textAlign: 'center', marginBottom: brandConfig.spacing.md }}>
        <Typography variant="h5" sx={{ 
          color: brandConfig.colors.stableMahogany,
          fontWeight: brandConfig.typography.weightBold,
          marginBottom: brandConfig.spacing.sm
        }}>
          Wyze Camera Feed
        </Typography>
        <Typography variant="body2" sx={{ 
          color: brandConfig.colors.textSecondary,
          fontSize: brandConfig.typography.fontSizeSm
        }}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        border: `2px solid ${brandConfig.colors.stableMahogany}`,
        borderRadius: brandConfig.layout.borderRadius,
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <Typography sx={{ color: brandConfig.colors.textSecondary }}>
            Loading camera feed...
          </Typography>
        ) : (
          <img
            src={imageUrl}
            alt="Wyze Camera Feed"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        )}
      </Box>

      <Box sx={{ 
        marginTop: brandConfig.spacing.sm,
        textAlign: 'center' 
      }}>
        <Typography variant="caption" sx={{ 
          color: brandConfig.colors.textSecondary,
          fontSize: brandConfig.typography.fontSizeXs
        }}>
          Refreshing every {refreshInterval} seconds
        </Typography>
      </Box>
    </Card>
  );
}; 