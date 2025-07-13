import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  TextField,
  Alert,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  PhotoCamera as PhotoIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { registrationFormData } from '../../config/registrationFormData';
import { IHorsePhoto } from '../../interfaces/RegistrationTypes';

interface IHorsePhotoUploadProps {
  photos: IHorsePhoto[];
  onPhotosChange: (photos: IHorsePhoto[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

export const HorsePhotoUpload: React.FC<IHorsePhotoUploadProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 5,
  disabled = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const photoConfig = registrationFormData.horseDetails.fields.photos;

  const styles = {
    container: {
      marginBottom: brandConfig.spacing.lg
    },
    uploadArea: {
      border: `2px dashed ${dragActive ? brandConfig.colors.stableMahogany : brandConfig.colors.neutralGray}40`,
      borderRadius: '16px',
      padding: brandConfig.spacing.xl,
      textAlign: 'center' as const,
      backgroundColor: dragActive ? `${brandConfig.colors.stableMahogany}05` : brandConfig.colors.surface,
      transition: 'all 0.3s ease',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      '&:hover': {
        borderColor: disabled ? undefined : brandConfig.colors.stableMahogany,
        backgroundColor: disabled ? undefined : `${brandConfig.colors.stableMahogany}05`
      }
    },
    uploadIcon: {
      fontSize: '3rem',
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.md
    },
    uploadText: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.xs
    },
    uploadSubtext: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray,
      marginBottom: brandConfig.spacing.md
    },
    uploadButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.lg}`,
      borderRadius: '8px',
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightMedium,
      '&:hover': {
        backgroundColor: brandConfig.colors.barnRed
      }
    },
    photosGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: brandConfig.spacing.md,
      marginTop: brandConfig.spacing.lg
    },
    photoCard: {
      position: 'relative' as const,
      borderRadius: '12px',
      overflow: 'hidden',
      border: `2px solid ${brandConfig.colors.neutralGray}20`,
      backgroundColor: brandConfig.colors.surface,
      boxShadow: '0 2px 8px rgba(139, 69, 19, 0.1)'
    },
    photoImage: {
      width: '100%',
      height: '160px',
      objectFit: 'cover' as const,
      backgroundColor: brandConfig.colors.neutralGray + '20'
    },
    photoActions: {
      position: 'absolute' as const,
      top: brandConfig.spacing.xs,
      right: brandConfig.spacing.xs,
      display: 'flex',
      gap: brandConfig.spacing.xs
    },
    actionButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: brandConfig.colors.stableMahogany,
      padding: brandConfig.spacing.xs,
      minWidth: 'auto',
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)'
      }
    },
    primaryBadge: {
      position: 'absolute' as const,
      top: brandConfig.spacing.xs,
      left: brandConfig.spacing.xs,
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightBold,
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: '12px'
    },
    photoCaption: {
      padding: brandConfig.spacing.sm,
      backgroundColor: brandConfig.colors.surface
    },
    captionField: {
      '& .MuiInputBase-root': {
        fontSize: brandConfig.typography.fontSizeSm
      }
    },
    errorAlert: {
      marginTop: brandConfig.spacing.md,
      backgroundColor: `${brandConfig.colors.barnRed}10`,
      color: brandConfig.colors.barnRed,
      border: `1px solid ${brandConfig.colors.barnRed}30`
    },
    photoCount: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.md
    },
    countChip: {
      backgroundColor: `${brandConfig.colors.stableMahogany}10`,
      color: brandConfig.colors.stableMahogany,
      fontWeight: brandConfig.typography.weightMedium
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > 10 * 1024 * 1024) {
      return photoConfig.validation.fileSize;
    }
    if (!['image/jpeg', 'image/png', 'image/heic'].includes(file.type)) {
      return photoConfig.validation.fileType;
    }
    return null;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (photos.length + validFiles.length > maxPhotos) {
      errors.push(photoConfig.validation.maxPhotos);
      return;
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
      return;
    }

    setUploadErrors([]);

    const newPhotos: IHorsePhoto[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
      caption: '',
      isPrimary: photos.length === 0, // First photo becomes primary
      uploadedAt: new Date()
    }));

    onPhotosChange([...photos, ...newPhotos]);
  };

  const handleDeletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    
    // If we deleted the primary photo, make the first remaining photo primary
    if (updatedPhotos.length > 0 && !updatedPhotos.some(p => p.isPrimary)) {
      updatedPhotos[0].isPrimary = true;
    }
    
    onPhotosChange(updatedPhotos);
  };

  const handleSetPrimary = (photoId: string) => {
    const updatedPhotos = photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    }));
    onPhotosChange(updatedPhotos);
  };

  const handleCaptionChange = (photoId: string, caption: string) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, caption } : photo
    );
    onPhotosChange(updatedPhotos);
  };

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.uploadText}>
        {photoConfig.heading}
      </Typography>
      <Typography sx={styles.uploadSubtext}>
        {photoConfig.subtitle}
      </Typography>

      {photos.length > 0 && (
        <Box sx={styles.photoCount}>
          <Chip
            icon={<ImageIcon />}
            label={`${photos.length} of ${maxPhotos} photos`}
            size="small"
            sx={styles.countChip}
          />
        </Box>
      )}

      {photos.length < maxPhotos && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={styles.uploadArea}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !disabled && document.getElementById('photo-upload')?.click()}
          >
            <input
              id="photo-upload"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/heic"
              style={{ display: 'none' }}
              onChange={handleFileInput}
              disabled={disabled}
            />

            <PhotoIcon sx={styles.uploadIcon} />
            <Typography sx={styles.uploadText}>
              {photoConfig.upload.dragText}
            </Typography>
            <Typography sx={styles.uploadSubtext}>
              {photoConfig.upload.acceptedTypes}
            </Typography>
            <Button
              variant="contained"
              sx={styles.uploadButton}
              disabled={disabled}
            >
              {photoConfig.upload.button}
            </Button>
          </Paper>
        </motion.div>
      )}

      {uploadErrors.length > 0 && (
        <Alert severity="error" sx={styles.errorAlert}>
          {uploadErrors.map((error, index) => (
            <Typography key={index} variant="body2">
              {error}
            </Typography>
          ))}
        </Alert>
      )}

      <AnimatePresence>
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Box sx={styles.photosGrid}>
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Paper sx={styles.photoCard}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Horse photo'}
                        style={styles.photoImage}
                      />
                      
                      {photo.isPrimary && (
                        <Box sx={styles.primaryBadge}>
                          <StarIcon sx={{ fontSize: '12px', marginRight: '4px' }} />
                          Primary
                        </Box>
                      )}

                      <Box sx={styles.photoActions}>
                        <IconButton
                          sx={styles.actionButton}
                          onClick={() => handleSetPrimary(photo.id)}
                          disabled={photo.isPrimary}
                        >
                          {photo.isPrimary ? <StarIcon /> : <StarOutlineIcon />}
                        </IconButton>
                        <IconButton
                          sx={styles.actionButton}
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={styles.photoCaption}>
                      <TextField
                        fullWidth
                        placeholder={photoConfig.captions.placeholder}
                        value={photo.caption || ''}
                        onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={styles.captionField}
                      />
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {photos.length === 0 && (
        <Box sx={{ textAlign: 'center', padding: brandConfig.spacing.lg }}>
          <Typography sx={styles.uploadSubtext}>
            {photoConfig.upload.help}
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 