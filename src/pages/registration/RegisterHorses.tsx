import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Grid,
  Paper,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Pets as PetsIcon } from '@mui/icons-material';
import { useNavigation } from '../../contexts/NavigationContext';
import { RegistrationLayout } from '../../components/registration/RegistrationLayout';
import { HorsePhotoUpload } from '../../components/registration/HorsePhotoUpload';
import { brandConfig } from '../../config/brandConfig';
import { registrationFormData } from '../../config/registrationFormData';
import { validateField } from '../../config/validationConfig';
import { IHorseDetails } from '../../interfaces/RegistrationTypes';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export const RegisterHorses: React.FC = () => {
  const { navigateTo } = useNavigation();
  
  // Scroll to top when component mounts
  useScrollToTop();
  
  const [horses, setHorses] = useState<IHorseDetails[]>([
    {
      name: '',
      showName: '',
      age: 0,
      breed: '',
      gender: 'mare',
      color: '',
      markings: '',
      photos: [],
      medicalConditions: '',
      currentMedications: '',
      recentVetCare: '',
      temperament: 'calm',
      habits: '',
      stressTriggers: '',
      facilityType: 'home',
      stallIdentifier: '',
      turnoutSchedule: ''
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing data on mount
  useEffect(() => {
    const existingData = localStorage.getItem('registrationData');
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        if (parsed.horses && parsed.horses.length > 0) {
          setHorses(parsed.horses);
        }
      } catch (error) {
        console.error('Error loading registration data:', error);
      }
    }
  }, []);

  const handleHorseInputChange = (index: number, field: string, value: any) => {
    setHorses(prev => prev.map((horse, i) => 
      i === index ? { ...horse, [field]: value } : horse
    ));
    
    // Clear error when user starts typing
    const errorKey = `horse${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const addHorse = () => {
    if (horses.length < 10) { // Max 10 horses
      setHorses(prev => [...prev, {
        name: '',
        showName: '',
        age: 0,
        breed: '',
        gender: 'mare',
        color: '',
        markings: '',
        photos: [],
        medicalConditions: '',
        currentMedications: '',
        recentVetCare: '',
        temperament: 'calm',
        habits: '',
        stressTriggers: '',
        facilityType: 'home',
        stallIdentifier: '',
        turnoutSchedule: ''
      }]);
    }
  };

  const removeHorse = (index: number) => {
    if (horses.length > 1) { // Keep at least 1 horse
      setHorses(prev => prev.filter((_, i) => i !== index));
      
      // Clear errors for removed horse
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`horse${index}_`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    horses.forEach((horse, index) => {
      // Comprehensive validation using validation config
      const nameValidation = validateField('horseName', horse.name);
      if (!nameValidation.isValid) {
        newErrors[`horse${index}_name`] = nameValidation.message;
      }
      
      const ageValidation = validateField('horseAge', horse.age);
      if (!ageValidation.isValid) {
        newErrors[`horse${index}_age`] = ageValidation.message;
      }
      
      const breedValidation = validateField('breed', horse.breed);
      if (!breedValidation.isValid) {
        newErrors[`horse${index}_breed`] = breedValidation.message;
      }
      
      const colorValidation = validateField('color', horse.color);
      if (!colorValidation.isValid) {
        newErrors[`horse${index}_color`] = colorValidation.message;
      }
      
      // Validate markings if provided
      if (horse.markings?.trim()) {
        const markingsValidation = validateField('markings', horse.markings);
        if (!markingsValidation.isValid) {
          newErrors[`horse${index}_markings`] = markingsValidation.message;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Save to localStorage
      const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      localStorage.setItem('registrationData', JSON.stringify({
        ...existingData,
        horses: horses,
        currentStep: 'facility'
      }));
      
      navigateTo('register-facility');
    }
  };

  const handleBack = () => {
    // Save current progress before going back
    const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    localStorage.setItem('registrationData', JSON.stringify({
      ...existingData,
      horses: horses
    }));
    
    navigateTo('register-owner');
  };

  const styles = {
    section: {
      marginBottom: brandConfig.spacing.xxl
    },
    sectionTitle: {
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.xl,
      fontFamily: brandConfig.typography.fontDisplay,
      letterSpacing: '-0.01em'
    },
    horseCard: {
      backgroundColor: brandConfig.colors.surface,
      borderRadius: '16px',
      padding: brandConfig.spacing.xl,
      marginBottom: brandConfig.spacing.lg,
      border: `1px solid ${brandConfig.colors.neutralGray}20`,
      boxShadow: '0 4px 20px rgba(139, 69, 19, 0.08)',
      position: 'relative' as const
    },
    horseHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: brandConfig.spacing.lg,
      paddingBottom: brandConfig.spacing.md,
      borderBottom: `2px solid ${brandConfig.colors.neutralGray}20`
    },
    horseTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm
    },
    horseName: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontDisplay
    },
    horseNumber: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.textSecondary,
      fontWeight: brandConfig.typography.weightMedium
    },
    removeButton: {
      color: brandConfig.colors.error || '#d32f2f',
      '&:hover': {
        backgroundColor: brandConfig.colors.error + '10' || '#d32f2f10'
      }
    },
    fieldGroup: {
      marginBottom: brandConfig.spacing.lg
    },
    groupTitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.md,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        fontSize: brandConfig.typography.fontSizeBase,
        '& fieldset': {
          borderColor: brandConfig.colors.neutralGray + '60',
          borderWidth: '2px'
        },
        '&:hover fieldset': {
          borderColor: brandConfig.colors.stableMahogany + '80'
        },
        '&.Mui-focused fieldset': {
          borderColor: brandConfig.colors.stableMahogany,
          borderWidth: '2px'
        }
      },
      '& .MuiInputLabel-root': {
        fontSize: brandConfig.typography.fontSizeBase,
        fontWeight: brandConfig.typography.weightMedium,
        '&.Mui-focused': {
          color: brandConfig.colors.stableMahogany
        }
      }
    },
    addHorseButton: {
      backgroundColor: brandConfig.colors.surface,
      border: `3px dashed ${brandConfig.colors.stableMahogany}60`,
      borderRadius: '16px',
      padding: brandConfig.spacing.xxl,
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: brandConfig.spacing.xl,
      '&:hover': {
        backgroundColor: brandConfig.colors.stableMahogany + '05',
        borderColor: brandConfig.colors.stableMahogany,
        transform: 'translateY(-2px)'
      }
    },
    addHorseContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: brandConfig.spacing.md
    },
    addHorseIcon: {
      fontSize: '3rem',
      color: brandConfig.colors.stableMahogany,
      opacity: 0.7
    },
    addHorseText: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontDisplay
    },
    addHorseSubtext: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.textSecondary
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: brandConfig.spacing.xxl,
      paddingTop: brandConfig.spacing.xl,
      borderTop: `2px solid ${brandConfig.colors.neutralGray}20`
    },
    backButton: {
      color: brandConfig.colors.textSecondary,
      fontSize: brandConfig.typography.fontSizeLg,
      padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
      border: `2px solid ${brandConfig.colors.neutralGray}40`,
      borderRadius: '12px',
      fontWeight: brandConfig.typography.weightMedium,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: brandConfig.colors.surface,
        borderColor: brandConfig.colors.neutralGray,
        transform: 'translateY(-2px)'
      }
    },
    nextButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xxl}`,
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(139, 69, 19, 0.3)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: brandConfig.colors.stableMahoganyDark || brandConfig.colors.stableMahogany,
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 35px rgba(139, 69, 19, 0.4)'
      }
    },
    horseCount: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.textSecondary,
      marginBottom: brandConfig.spacing.lg,
      textAlign: 'center' as const
    }
  };

  const renderHorseForm = (horse: IHorseDetails, index: number) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Paper sx={styles.horseCard}>
        {/* Horse Header */}
        <Box sx={styles.horseHeader}>
          <Box sx={styles.horseTitle}>
            <PetsIcon sx={{ color: brandConfig.colors.stableMahogany }} />
            <Box>
              <Typography sx={styles.horseName}>
                {horse.name || `Horse ${index + 1}`}
              </Typography>
              <Typography sx={styles.horseNumber}>
                {registrationFormData.horseDetails.fields.basic.name.help}
              </Typography>
            </Box>
          </Box>
          {horses.length > 1 && (
            <Tooltip title={registrationFormData.horseDetails.buttons.removeHorse}>
              <IconButton 
                onClick={() => removeHorse(index)}
                sx={styles.removeButton}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Basic Information */}
        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.groupTitle}>
            {registrationFormData.horseDetails.fields.basic.heading}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label={registrationFormData.horseDetails.fields.basic.name.label}
                  placeholder={registrationFormData.horseDetails.fields.basic.name.placeholder}
                  value={horse.name}
                  onChange={(e) => handleHorseInputChange(index, 'name', e.target.value)}
                  error={!!errors[`horse${index}_name`]}
                  helperText={errors[`horse${index}_name`] || registrationFormData.horseDetails.fields.basic.name.help}
                  required
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label={registrationFormData.horseDetails.fields.basic.showName.label}
                  placeholder={registrationFormData.horseDetails.fields.basic.showName.placeholder}
                  value={horse.showName || ''}
                  onChange={(e) => handleHorseInputChange(index, 'showName', e.target.value)}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  type="number"
                  label={registrationFormData.horseDetails.fields.basic.age.label}
                  placeholder={registrationFormData.horseDetails.fields.basic.age.placeholder}
                  value={horse.age || ''}
                  onChange={(e) => handleHorseInputChange(index, 'age', parseInt(e.target.value) || 0)}
                  error={!!errors[`horse${index}_age`]}
                  helperText={errors[`horse${index}_age`]}
                  required
                  inputProps={{ min: 1, max: 40 }}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              >
                <FormControl fullWidth required error={!!errors[`horse${index}_gender`]}>
                  <FormLabel sx={{ fontWeight: brandConfig.typography.weightMedium, marginBottom: 1 }}>
                    {registrationFormData.horseDetails.fields.basic.gender.label}
                  </FormLabel>
                  <RadioGroup
                    value={horse.gender}
                    onChange={(e) => handleHorseInputChange(index, 'gender', e.target.value)}
                    row
                  >
                    {Object.entries(registrationFormData.horseDetails.fields.basic.gender.options).map(([value, label]) => (
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={<Radio sx={{ color: brandConfig.colors.stableMahogany }} />}
                        label={label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={4}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label={registrationFormData.horseDetails.fields.basic.breed.label}
                  placeholder={registrationFormData.horseDetails.fields.basic.breed.placeholder}
                  value={horse.breed}
                  onChange={(e) => handleHorseInputChange(index, 'breed', e.target.value)}
                  error={!!errors[`horse${index}_breed`]}
                  helperText={errors[`horse${index}_breed`]}
                  required
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label={registrationFormData.horseDetails.fields.basic.color.label}
                  placeholder={registrationFormData.horseDetails.fields.basic.color.placeholder}
                  value={horse.color}
                  onChange={(e) => handleHorseInputChange(index, 'color', e.target.value)}
                  error={!!errors[`horse${index}_color`]}
                  helperText={errors[`horse${index}_color`]}
                  required
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label={registrationFormData.horseDetails.fields.basic.markings.label}
                  placeholder={registrationFormData.horseDetails.fields.basic.markings.placeholder}
                  value={horse.markings || ''}
                  onChange={(e) => handleHorseInputChange(index, 'markings', e.target.value)}
                  error={!!errors[`horse${index}_markings`]}
                  helperText={errors[`horse${index}_markings`] || registrationFormData.horseDetails.fields.basic.markings.help}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ marginY: brandConfig.spacing.lg }} />

        {/* Horse Photos */}
        <Box sx={styles.fieldGroup}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
          >
            <HorsePhotoUpload
              photos={horse.photos || []}
              onPhotosChange={(photos) => handleHorseInputChange(index, 'photos', photos)}
              maxPhotos={5}
            />
          </motion.div>
        </Box>

        <Divider sx={{ marginY: brandConfig.spacing.lg }} />

        {/* Health Information */}
        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.groupTitle}>
            {registrationFormData.horseDetails.fields.health.heading}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={registrationFormData.horseDetails.fields.health.conditions.label}
                  placeholder={registrationFormData.horseDetails.fields.health.conditions.placeholder}
                  value={horse.medicalConditions || ''}
                  onChange={(e) => handleHorseInputChange(index, 'medicalConditions', e.target.value)}
                  helperText={registrationFormData.horseDetails.fields.health.conditions.help}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={registrationFormData.horseDetails.fields.health.medications.label}
                  placeholder={registrationFormData.horseDetails.fields.health.medications.placeholder}
                  value={horse.currentMedications || ''}
                  onChange={(e) => handleHorseInputChange(index, 'currentMedications', e.target.value)}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={registrationFormData.horseDetails.fields.health.vetHistory.label}
                  placeholder={registrationFormData.horseDetails.fields.health.vetHistory.placeholder}
                  value={horse.recentVetCare || ''}
                  onChange={(e) => handleHorseInputChange(index, 'recentVetCare', e.target.value)}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ marginY: brandConfig.spacing.lg }} />

        {/* Behavior & Personality */}
        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.groupTitle}>
            {registrationFormData.horseDetails.fields.behavior.heading}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
              >
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: brandConfig.typography.weightMedium, marginBottom: 2 }}>
                    {registrationFormData.horseDetails.fields.behavior.temperament.label}
                  </FormLabel>
                  <RadioGroup
                    value={horse.temperament}
                    onChange={(e) => handleHorseInputChange(index, 'temperament', e.target.value)}
                  >
                    {Object.entries(registrationFormData.horseDetails.fields.behavior.temperament.options).map(([value, label]) => (
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={<Radio sx={{ color: brandConfig.colors.stableMahogany }} />}
                        label={label}
                        sx={{ marginBottom: 1 }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={registrationFormData.horseDetails.fields.behavior.habits.label}
                  placeholder={registrationFormData.horseDetails.fields.behavior.habits.placeholder}
                  value={horse.habits || ''}
                  onChange={(e) => handleHorseInputChange(index, 'habits', e.target.value)}
                  helperText={registrationFormData.horseDetails.fields.behavior.habits.help}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={registrationFormData.horseDetails.fields.behavior.triggers.label}
                  placeholder={registrationFormData.horseDetails.fields.behavior.triggers.placeholder}
                  value={horse.stressTriggers || ''}
                  onChange={(e) => handleHorseInputChange(index, 'stressTriggers', e.target.value)}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ marginY: brandConfig.spacing.lg }} />

        {/* Location Information */}
        <Box sx={styles.fieldGroup}>
          <Typography sx={styles.groupTitle}>
            {registrationFormData.horseDetails.fields.location.heading}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.4 }}
              >
                <FormControl fullWidth>
                  <FormLabel sx={{ fontWeight: brandConfig.typography.weightMedium, marginBottom: 2 }}>
                    {registrationFormData.horseDetails.fields.location.facility.label}
                  </FormLabel>
                  <RadioGroup
                    value={horse.facilityType}
                    onChange={(e) => handleHorseInputChange(index, 'facilityType', e.target.value)}
                  >
                    <FormControlLabel
                      value="home"
                      control={<Radio sx={{ color: brandConfig.colors.stableMahogany }} />}
                      label={registrationFormData.horseDetails.fields.location.facility.home}
                    />
                    <FormControlLabel
                      value="boarding"
                      control={<Radio sx={{ color: brandConfig.colors.stableMahogany }} />}
                      label={registrationFormData.horseDetails.fields.location.facility.boarding}
                    />
                    <FormControlLabel
                      value="training"
                      control={<Radio sx={{ color: brandConfig.colors.stableMahogany }} />}
                      label={registrationFormData.horseDetails.fields.location.facility.training}
                    />
                  </RadioGroup>
                </FormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label={registrationFormData.horseDetails.fields.location.stall.label}
                  placeholder={registrationFormData.horseDetails.fields.location.stall.placeholder}
                  value={horse.stallIdentifier || ''}
                  onChange={(e) => handleHorseInputChange(index, 'stallIdentifier', e.target.value)}
                  helperText={registrationFormData.horseDetails.fields.location.stall.help}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.7 + index * 0.1, duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label={registrationFormData.horseDetails.fields.location.turnout.label}
                  placeholder={registrationFormData.horseDetails.fields.location.turnout.placeholder}
                  value={horse.turnoutSchedule || ''}
                  onChange={(e) => handleHorseInputChange(index, 'turnoutSchedule', e.target.value)}
                  sx={styles.textField}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );

  return (
    <RegistrationLayout
      currentStep={2}
      totalSteps={5}
      stepTitle={registrationFormData.horseDetails.heading}
      stepDescription={registrationFormData.horseDetails.subtitle}
    >
      {/* Horse Count Display */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Typography sx={styles.horseCount}>
          {horses.length === 1 ? '1 Horse' : `${horses.length} Horses`} • Maximum 10 horses per registration
        </Typography>
      </motion.div>

      {/* Existing Horses */}
      {horses.map((horse, index) => renderHorseForm(horse, index))}

      {/* Add Horse Button */}
      {horses.length < 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + horses.length * 0.1, duration: 0.5 }}
        >
          <Box 
            sx={styles.addHorseButton}
            onClick={addHorse}
          >
            <Box sx={styles.addHorseContent}>
              <AddIcon sx={styles.addHorseIcon} />
              <Typography sx={styles.addHorseText}>
                {registrationFormData.horseDetails.buttons.addHorse}
              </Typography>
              <Typography sx={styles.addHorseSubtext}>
                Add details for another horse you want to monitor
              </Typography>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + horses.length * 0.1, duration: 0.5 }}
      >
        <Box sx={styles.buttonContainer}>
          <Button
            onClick={handleBack}
            sx={styles.backButton}
          >
            {registrationFormData.horseDetails.buttons.back}
          </Button>
          
          <Button
            onClick={handleSubmit}
            sx={styles.nextButton}
          >
            {registrationFormData.horseDetails.buttons.next}
          </Button>
        </Box>
      </motion.div>
    </RegistrationLayout>
  );
}; 