/**
 * 📸 Image Uploader Component
 * Drag & drop image upload interface for AI testing tool
 * Supports barn surveillance image formats with preview functionality
 */

import React, { useState, useCallback, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  IconButton,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Clear as ClearIcon,
  Photo as PhotoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

import { brandConfig } from '../../../config/brandConfig';
import { aiTestingData } from '../../../config/aiTestingData';
import type { IImageUploaderProps, IImageUploadState } from '../../../interfaces/AITestingTypes';

export const ImageUploader: React.FC<IImageUploaderProps> = ({
  onImageSelect,
  onImageClear,
  acceptedFormats,
  maxFileSize,
  currentImage,
  isProcessing = false
}) => {
  const [uploadState, setUploadState] = useState<IImageUploadState>({
    file: null,
    dataUrl: null,
    isLoading: false,
    error: null,
    dragActive: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Validate file type and size
  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Unsupported file type. Please use: ${acceptedFormats.join(', ')}`;
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      return `File too large. Maximum size: ${maxSizeMB}MB`;
    }

    return null;
  }, [acceptedFormats, maxFileSize]);

  // Convert file to data URL
  const convertFileToDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    setUploadState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setUploadState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: validationError 
        }));
        return;
      }

      // Convert to data URL
      const dataUrl = await convertFileToDataUrl(file);

      // Update state
      setUploadState({
        file,
        dataUrl,
        isLoading: false,
        error: null,
        dragActive: false
      });

      // Notify parent component
      onImageSelect(dataUrl, file);

    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to process image file'
      }));
    }
  }, [validateFile, convertFileToDataUrl, onImageSelect]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setUploadState(prev => ({ ...prev, dragActive: true }));
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setUploadState(prev => ({ ...prev, dragActive: false }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, dragActive: false }));
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle clear image
  const handleClear = useCallback(() => {
    setUploadState({
      file: null,
      dataUrl: null,
      isLoading: false,
      error: null,
      dragActive: false
    });

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onImageClear();
  }, [onImageClear]);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (fileInputRef.current && !isProcessing) {
      fileInputRef.current.click();
    }
  }, [isProcessing]);

  // Styles using brandConfig
  const styles = {
    container: {
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.md
    },
    uploadArea: {
      position: 'relative' as const,
      border: `2px dashed ${uploadState.dragActive 
        ? brandConfig.colors.ribbonBlue 
        : brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.spacing.sm,
      padding: brandConfig.spacing.xl,
      textAlign: 'center' as const,
      backgroundColor: uploadState.dragActive 
        ? `${brandConfig.colors.ribbonBlue}15` 
        : brandConfig.colors.arenaSand,
      cursor: isProcessing ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      gap: brandConfig.spacing.md
    },
    uploadIcon: {
      fontSize: '3rem',
      color: uploadState.dragActive 
        ? brandConfig.colors.ribbonBlue 
        : brandConfig.colors.sterlingSilver
    },
    uploadText: {
      color: brandConfig.colors.textSecondary,
      fontWeight: brandConfig.typography.weightRegular
    },
    uploadInstruction: {
      color: brandConfig.colors.neutralGray,
      fontSize: brandConfig.typography.fontSizeSm
    },
    previewContainer: {
      position: 'relative' as const,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.spacing.sm,
      overflow: 'hidden',
      backgroundColor: brandConfig.colors.barnWhite
    },
    previewImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '300px',
      objectFit: 'contain' as const,
      display: 'block'
    },
    previewOverlay: {
      position: 'absolute' as const,
      top: brandConfig.spacing.sm,
      right: brandConfig.spacing.sm,
      display: 'flex',
      gap: brandConfig.spacing.xs
    },
    clearButton: {
      backgroundColor: brandConfig.colors.errorRed,
      color: brandConfig.colors.barnWhite,
      '&:hover': {
        backgroundColor: '#AA2222'
      }
    },
    loadingOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      gap: brandConfig.spacing.sm
    },
    errorMessage: {
      color: brandConfig.colors.errorRed,
      fontSize: brandConfig.typography.fontSizeSm,
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
      marginTop: brandConfig.spacing.sm,
      padding: brandConfig.spacing.sm,
      backgroundColor: `${brandConfig.colors.errorRed}15`,
      borderRadius: brandConfig.spacing.xs
    },
    fileInfo: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray,
      marginTop: brandConfig.spacing.sm,
      padding: brandConfig.spacing.sm,
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.spacing.xs
    },
    hiddenInput: {
      display: 'none'
    }
  };

  // Get current image (from state or prop)
  const imageToShow = currentImage || uploadState.dataUrl;
  const currentFile = uploadState.file;

  return (
    <Box sx={styles.container}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleInputChange}
        style={styles.hiddenInput}
      />

      {/* Upload area or image preview */}
      {imageToShow ? (
        <Box sx={styles.previewContainer}>
          <img
            src={imageToShow}
            alt="Preview"
            style={styles.previewImage}
          />
          
          {/* Overlay controls */}
          <Box sx={styles.previewOverlay}>
            <Tooltip title="Clear image">
              <IconButton
                onClick={handleClear}
                sx={styles.clearButton}
                size="small"
                disabled={isProcessing}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Processing overlay */}
          {isProcessing && (
            <Box sx={styles.loadingOverlay}>
              <CircularProgress size={24} />
              <Typography variant="body2">
                {aiTestingData.states.loading.description}
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Paper
          sx={styles.uploadArea}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {uploadState.isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: brandConfig.spacing.sm }}>
              <CircularProgress size={32} />
              <Typography variant="body2" sx={styles.uploadText}>
                {aiTestingData.imageUpload.preview.loadingText}
              </Typography>
            </Box>
          ) : (
            <>
              <UploadIcon sx={styles.uploadIcon} />
              <Typography variant="h6" sx={styles.uploadText}>
                {uploadState.dragActive 
                  ? aiTestingData.imageUpload.instructions.dragActive
                  : aiTestingData.imageUpload.instructions.primary}
              </Typography>
              <Typography variant="body2" sx={styles.uploadInstruction}>
                {aiTestingData.imageUpload.instructions.secondary}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<PhotoIcon />}
                sx={{
                  marginTop: brandConfig.spacing.sm,
                  borderColor: brandConfig.colors.stableMahogany,
                  color: brandConfig.colors.stableMahogany,
                  '&:hover': {
                    borderColor: brandConfig.colors.stableMahogany,
                    backgroundColor: `${brandConfig.colors.stableMahogany}10`
                  }
                }}
                disabled={isProcessing}
              >
                Browse Files
              </Button>
            </>
          )}
        </Paper>
      )}

      {/* File information */}
      {currentFile && (
        <Box sx={styles.fileInfo}>
          <Typography variant="caption" component="div">
            <strong>File:</strong> {currentFile.name}
          </Typography>
          <Typography variant="caption" component="div">
            <strong>Size:</strong> {Math.round(currentFile.size / 1024)} KB
          </Typography>
          <Typography variant="caption" component="div">
            <strong>Type:</strong> {currentFile.type}
          </Typography>
        </Box>
      )}

      {/* Error message */}
      {uploadState.error && (
        <Box sx={styles.errorMessage}>
          <WarningIcon fontSize="small" />
          <Typography variant="body2">
            {uploadState.error}
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 