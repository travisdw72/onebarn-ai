import React, { useState } from 'react';
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
  Checkbox,
  FormGroup,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import { useNavigation } from '../../contexts/NavigationContext';
import { RegistrationLayout } from '../../components/registration/RegistrationLayout';
import { brandConfig } from '../../config/brandConfig';
import { registrationFormData } from '../../config/registrationFormData';
import { validateField } from '../../config/validationConfig';
import { IOwnerProfile, IVeterinarianInfo, ITrainerInfo, IEmergencyContact } from '../../interfaces/RegistrationTypes';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export const OwnerProfile: React.FC = () => {
  const { navigateTo } = useNavigation();
  
  // Scroll to top when component mounts
  useScrollToTop();
  
  const [formData, setFormData] = useState<Partial<IOwnerProfile>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceLevel: 'intermediate',
    interests: [],
    veterinarian: {
      name: '',
      clinic: '',
      phone: '',
      email: ''
    },
    trainer: {
      name: '',
      discipline: '',
      phone: '',
      email: ''
    },
    emergencyContacts: [
      {
        name: '',
        relationship: '',
        phone: '',
        isPrimary: true
      },
      {
        name: '',
        relationship: '',
        phone: '',
        isPrimary: false
      }
    ]
  });

  const [hasTrainer, setHasTrainer] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => {
      const currentSection = prev[section as keyof IOwnerProfile];
      return {
        ...prev,
        [section]: {
          ...(currentSection && typeof currentSection === 'object' ? currentSection : {}),
          [field]: value
        }
      };
    });
  };

  const handleEmergencyContactChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts?.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...(prev.interests || []), interest]
        : (prev.interests || []).filter(i => i !== interest)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Comprehensive validation using validation config
    const firstNameValidation = validateField('firstName', formData.firstName);
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.message;
    }
    
    const lastNameValidation = validateField('lastName', formData.lastName);
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.message;
    }
    
    const emailValidation = validateField('email', formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }
    
    const phoneValidation = validateField('phone', formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }
    
    const vetNameValidation = validateField('vetName', formData.veterinarian?.name);
    if (!vetNameValidation.isValid) {
      newErrors.vetName = vetNameValidation.message;
    }
    
    const vetPhoneValidation = validateField('phone', formData.veterinarian?.phone);
    if (!vetPhoneValidation.isValid) {
      newErrors.vetPhone = vetPhoneValidation.message;
    }
    
    // Validate clinic name if provided
    if (formData.veterinarian?.clinic?.trim()) {
      const clinicNameValidation = validateField('clinicName', formData.veterinarian?.clinic);
      if (!clinicNameValidation.isValid) {
        newErrors.vetClinic = clinicNameValidation.message;
      }
    }
    
    // Validate veterinarian email if provided
    if (formData.veterinarian?.email?.trim()) {
      const vetEmailValidation = validateField('email', formData.veterinarian?.email);
      if (!vetEmailValidation.isValid) {
        newErrors.vetEmail = vetEmailValidation.message;
      }
    }
    
    const emergencyNameValidation = validateField('emergencyName', formData.emergencyContacts?.[0]?.name);
    if (!emergencyNameValidation.isValid) {
      newErrors.emergencyName = emergencyNameValidation.message;
    }
    
    const emergencyPhoneValidation = validateField('emergencyPhone', formData.emergencyContacts?.[0]?.phone);
    if (!emergencyPhoneValidation.isValid) {
      newErrors.emergencyPhone = emergencyPhoneValidation.message;
    }
    
    const emergencyRelationshipValidation = validateField('emergencyRelationship', formData.emergencyContacts?.[0]?.relationship);
    if (!emergencyRelationshipValidation.isValid) {
      newErrors.emergencyRelationship = emergencyRelationshipValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Save to local storage or context
      localStorage.setItem('registrationData', JSON.stringify({
        ownerProfile: formData,
        currentStep: 'horses'
      }));
      
      navigateTo('register-horses');
    }
  };

  const handleBack = () => {
    navigateTo('register');
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
    sectionPaper: {
      padding: brandConfig.spacing.xl,
      marginBottom: brandConfig.spacing.xl,
      backgroundColor: brandConfig.colors.surface,
      borderRadius: '16px',
      border: `1px solid ${brandConfig.colors.neutralGray}20`,
      boxShadow: '0 4px 20px rgba(139, 69, 19, 0.08)'
    },
    fieldGroup: {
      marginBottom: brandConfig.spacing.lg
    },
    helpText: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.textSecondary,
      marginTop: brandConfig.spacing.sm,
      fontStyle: 'italic'
    },
    experienceOption: {
      border: `2px solid ${brandConfig.colors.neutralGray}40`,
      borderRadius: '12px',
      padding: brandConfig.spacing.lg,
      marginBottom: brandConfig.spacing.md,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: brandConfig.colors.surface,
        borderColor: brandConfig.colors.stableMahogany + '60',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)'
      }
    },
    experienceTitle: {
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      fontSize: brandConfig.typography.fontSizeLg,
      marginBottom: brandConfig.spacing.xs
    },
    experienceDescription: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.textSecondary,
      lineHeight: brandConfig.typography.lineHeightRelaxed
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
    checkboxGroup: {
      backgroundColor: brandConfig.colors.surface,
      borderRadius: '12px',
      padding: brandConfig.spacing.lg,
      border: `1px solid ${brandConfig.colors.neutralGray}30`
    },
    checkboxItem: {
      padding: brandConfig.spacing.sm,
      borderRadius: '8px',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: brandConfig.colors.neutralGray + '10'
      }
    }
  };

  return (
    <RegistrationLayout
      currentStep={1}
      totalSteps={5}
      stepTitle={registrationFormData.ownerProfile.heading}
      stepDescription={registrationFormData.ownerProfile.subtitle}
    >
      {/* Personal Information */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        sx={styles.section}
      >
        <Typography sx={styles.sectionTitle}>
          {registrationFormData.ownerProfile.fields.personalInfo.heading}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <TextField
                fullWidth
                label={registrationFormData.ownerProfile.fields.personalInfo.firstName.label}
                placeholder={registrationFormData.ownerProfile.fields.personalInfo.firstName.placeholder}
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                sx={styles.textField}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <TextField
                fullWidth
                label={registrationFormData.ownerProfile.fields.personalInfo.lastName.label}
                placeholder={registrationFormData.ownerProfile.fields.personalInfo.lastName.placeholder}
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                sx={styles.textField}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <TextField
                fullWidth
                type="email"
                label={registrationFormData.ownerProfile.fields.personalInfo.email.label}
                placeholder={registrationFormData.ownerProfile.fields.personalInfo.email.placeholder}
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email || registrationFormData.ownerProfile.fields.personalInfo.email.help}
                required
                sx={styles.textField}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <TextField
                fullWidth
                type="tel"
                label={registrationFormData.ownerProfile.fields.personalInfo.phone.label}
                placeholder={registrationFormData.ownerProfile.fields.personalInfo.phone.placeholder}
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone || registrationFormData.ownerProfile.fields.personalInfo.phone.help}
                required
                sx={styles.textField}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ marginY: brandConfig.spacing.lg }} />

      {/* Experience Level */}
      <Box sx={styles.section}>
        <Typography sx={styles.sectionTitle}>
          {registrationFormData.ownerProfile.fields.experience.heading}
        </Typography>
        
        <FormControl fullWidth>
          <FormLabel sx={{ marginBottom: brandConfig.spacing.md }}>
            {registrationFormData.ownerProfile.fields.experience.level.label}
          </FormLabel>
          <RadioGroup
            value={formData.experienceLevel || 'intermediate'}
            onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
          >
            {Object.entries(registrationFormData.ownerProfile.fields.experience.level.options).map(([key, option]) => (
              <Paper key={key} sx={styles.experienceOption}>
                <FormControlLabel
                  value={key}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography sx={styles.experienceTitle}>
                        {option.title}
                      </Typography>
                      <Typography sx={styles.experienceDescription}>
                        {option.description}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>

        {/* Horse Activities */}
        <Box sx={styles.fieldGroup}>
          <FormLabel sx={{ marginBottom: brandConfig.spacing.md }}>
            {registrationFormData.ownerProfile.fields.experience.interests.label}
          </FormLabel>
          <FormGroup>
            <Grid container>
              {Object.entries(registrationFormData.ownerProfile.fields.experience.interests.options).map(([key, label]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.interests?.includes(key) || false}
                        onChange={(e) => handleInterestChange(key, e.target.checked)}
                      />
                    }
                    label={label}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </Box>
      </Box>

      <Divider sx={{ marginY: brandConfig.spacing.lg }} />

      {/* Veterinarian Information */}
      <Box sx={styles.section}>
        <Typography sx={styles.sectionTitle}>
          {registrationFormData.ownerProfile.fields.team.veterinarian.heading}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={registrationFormData.ownerProfile.fields.team.veterinarian.name.label}
              placeholder={registrationFormData.ownerProfile.fields.team.veterinarian.name.placeholder}
              value={formData.veterinarian?.name || ''}
              onChange={(e) => handleNestedInputChange('veterinarian', 'name', e.target.value)}
              error={!!errors.vetName}
              helperText={errors.vetName || registrationFormData.ownerProfile.fields.team.veterinarian.name.help}
              required
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={registrationFormData.ownerProfile.fields.team.veterinarian.clinic.label}
              placeholder={registrationFormData.ownerProfile.fields.team.veterinarian.clinic.placeholder}
              value={formData.veterinarian?.clinic || ''}
              onChange={(e) => handleNestedInputChange('veterinarian', 'clinic', e.target.value)}
              error={!!errors.vetClinic}
              helperText={errors.vetClinic}
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="tel"
              label={registrationFormData.ownerProfile.fields.team.veterinarian.phone.label}
              placeholder={registrationFormData.ownerProfile.fields.team.veterinarian.phone.placeholder}
              value={formData.veterinarian?.phone || ''}
              onChange={(e) => handleNestedInputChange('veterinarian', 'phone', e.target.value)}
              error={!!errors.vetPhone}
              helperText={errors.vetPhone}
              required
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="email"
              label={registrationFormData.ownerProfile.fields.team.veterinarian.email.label}
              placeholder={registrationFormData.ownerProfile.fields.team.veterinarian.email.placeholder}
              value={formData.veterinarian?.email || ''}
              onChange={(e) => handleNestedInputChange('veterinarian', 'email', e.target.value)}
              error={!!errors.vetEmail}
              helperText={errors.vetEmail}
              sx={styles.textField}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ marginY: brandConfig.spacing.lg }} />

      {/* Emergency Contacts */}
      <Box sx={styles.section}>
        <Typography sx={styles.sectionTitle}>
          {registrationFormData.ownerProfile.fields.emergency.heading}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={registrationFormData.ownerProfile.fields.emergency.primary.name.label}
              placeholder={registrationFormData.ownerProfile.fields.emergency.primary.name.placeholder}
              value={formData.emergencyContacts?.[0]?.name || ''}
              onChange={(e) => handleEmergencyContactChange(0, 'name', e.target.value)}
              error={!!errors.emergencyName}
              helperText={errors.emergencyName}
              required
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={registrationFormData.ownerProfile.fields.emergency.primary.relationship.label}
              placeholder={registrationFormData.ownerProfile.fields.emergency.primary.relationship.placeholder}
              value={formData.emergencyContacts?.[0]?.relationship || ''}
              onChange={(e) => handleEmergencyContactChange(0, 'relationship', e.target.value)}
              error={!!errors.emergencyRelationship}
              helperText={errors.emergencyRelationship}
              required
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="tel"
              label={registrationFormData.ownerProfile.fields.emergency.primary.phone.label}
              placeholder={registrationFormData.ownerProfile.fields.emergency.primary.phone.placeholder}
              value={formData.emergencyContacts?.[0]?.phone || ''}
              onChange={(e) => handleEmergencyContactChange(0, 'phone', e.target.value)}
              error={!!errors.emergencyPhone}
              helperText={errors.emergencyPhone}
              required
              sx={styles.textField}
            />
          </Grid>
        </Grid>

        {/* Backup Contact */}
        <Typography variant="h6" sx={{ marginTop: brandConfig.spacing.lg, marginBottom: brandConfig.spacing.md }}>
          {registrationFormData.ownerProfile.fields.emergency.backup.heading}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={registrationFormData.ownerProfile.fields.emergency.backup.name.label}
              placeholder={registrationFormData.ownerProfile.fields.emergency.backup.name.placeholder}
              value={formData.emergencyContacts?.[1]?.name || ''}
              onChange={(e) => handleEmergencyContactChange(1, 'name', e.target.value)}
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="tel"
              label={registrationFormData.ownerProfile.fields.emergency.backup.phone.label}
              placeholder={registrationFormData.ownerProfile.fields.emergency.backup.phone.placeholder}
              value={formData.emergencyContacts?.[1]?.phone || ''}
              onChange={(e) => handleEmergencyContactChange(1, 'phone', e.target.value)}
              sx={styles.textField}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Box sx={styles.buttonContainer}>
          <Button
            onClick={handleBack}
            sx={styles.backButton}
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Back to Registration
          </Button>
          <Button
            onClick={handleSubmit}
            sx={styles.nextButton}
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Horse Details →
          </Button>
        </Box>
      </motion.div>
    </RegistrationLayout>
  );
}; 