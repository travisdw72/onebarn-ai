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
  Tooltip,
  Card,
  CardContent,
  Switch,
  Chip,
  Alert,
  LinearProgress,
  FormGroup,
  Checkbox
} from '@mui/material';
import { 
  Home as HomeIcon,
  Business as BusinessIcon,
  EmojiEvents as TrophyIcon,
  LocationOn as LocationIcon,
  Wifi as WifiIcon,
  Power as PowerIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Group as GroupIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigation } from '../../contexts/NavigationContext';
import { RegistrationLayout } from '../../components/registration/RegistrationLayout';
import { CameraPlacementDiagram } from '../../components/registration/CameraPlacementDiagram';
import { brandConfig } from '../../config/brandConfig';
import { registrationFormData } from '../../config/registrationFormData';
import { validateField } from '../../config/validationConfig';
import { IFacilityInfo } from '../../interfaces/RegistrationTypes';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export const RegisterFacility: React.FC = () => {
  const { navigateTo } = useNavigation();
  
  // Scroll to top when component mounts
  useScrollToTop();
  
  const [facilityData, setFacilityData] = useState<IFacilityInfo>({
    propertyType: 'home',
    wifiStrength: 'good',
    wifiUpgradeWilling: true,
    powerAvailability: 'readily',
    powerInstallPossible: true,
    hasReferral: false,
    referralCode: '',
    referrerName: '',
    installationPermission: true,
    facilityContact: {
      name: '',
      phone: ''
    },
    installationType: 'self', // Default to self-installation
    preferredTimeframe: 'flexible', // Only used for professional install
    preferredDays: 'either',
    preferredTime: 'either',
    installationNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing data on mount
  useEffect(() => {
    const existingData = localStorage.getItem('registrationData');
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        if (parsed.facilityInfo) {
          setFacilityData(parsed.facilityInfo);
        }
      } catch (error) {
        console.error('Error loading registration data:', error);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFacilityData(prev => ({
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

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFacilityData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof IFacilityInfo] as any,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate boarding facility contact info if needed using comprehensive validation
    if ((facilityData.propertyType === 'boarding' || facilityData.propertyType === 'training') && 
        !facilityData.installationPermission) {
      const contactNameValidation = validateField('firstName', facilityData.facilityContact?.name);
      if (!contactNameValidation.isValid) {
        newErrors.facilityContactName = contactNameValidation.message;
      }
      
      const contactPhoneValidation = validateField('phone', facilityData.facilityContact?.phone);
      if (!contactPhoneValidation.isValid) {
        newErrors.facilityContactPhone = contactPhoneValidation.message;
      }
    }

    // Validate referral code if they said they have one using comprehensive validation
    if (facilityData.hasReferral) {
      const referralValidation = validateField('referralCode', facilityData.referralCode);
      if (!referralValidation.isValid) {
        newErrors.referralCode = referralValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Save to localStorage
      const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
      localStorage.setItem('registrationData', JSON.stringify({
        ...existingData,
        facilityInfo: facilityData,
        currentStep: 'plans'
      }));
      
      navigateTo('register-plans');
    }
  };

  const handleBack = () => {
    // Save current progress before going back
    const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    localStorage.setItem('registrationData', JSON.stringify({
      ...existingData,
      facilityInfo: facilityData
    }));
    
    navigateTo('register-horses');
  };

  const getWifiIcon = (strength: string) => {
    switch (strength) {
      case 'excellent': return <CheckIcon sx={{ color: brandConfig.colors.hunterGreen }} />;
      case 'good': return <CheckIcon sx={{ color: brandConfig.colors.championGold }} />;
      case 'fair': return <WarningIcon sx={{ color: brandConfig.colors.championGold }} />;
      case 'poor': return <ErrorIcon sx={{ color: brandConfig.colors.alertRed }} />;
      case 'none': return <ErrorIcon sx={{ color: brandConfig.colors.alertRed }} />;
      default: return null;
    }
  };

  const getWifiStrengthColor = (strength: string) => {
    switch (strength) {
      case 'excellent': return brandConfig.colors.hunterGreen;
      case 'good': return brandConfig.colors.championGold;
      case 'fair': return brandConfig.colors.championGold;
      case 'poor': return brandConfig.colors.alertRed;
      case 'none': return brandConfig.colors.alertRed;
      default: return brandConfig.colors.neutralGray;
    }
  };

  const getWifiRecommendation = (strength: string) => {
    switch (strength) {
      case 'excellent': return 'Perfect! Your WiFi will support high-quality video streaming.';
      case 'good': return 'Great! Your WiFi should work well for our monitoring system.';
      case 'fair': return 'Good enough for basic monitoring. Consider upgrading for best results.';
      case 'poor': return 'We recommend upgrading your WiFi for reliable monitoring.';
      case 'none': return 'WiFi installation will be required for our monitoring system.';
      default: return '';
    }
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
    sectionSubtitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.textSecondary,
      marginBottom: brandConfig.spacing.xl,
      lineHeight: brandConfig.typography.lineHeightRelaxed
    },
    propertyCard: {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)'
      }
    },
    selectedCard: {
      borderColor: brandConfig.colors.stableMahogany,
      backgroundColor: brandConfig.colors.stableMahogany + '05'
    },
    propertyIcon: {
      fontSize: '3rem',
      marginBottom: brandConfig.spacing.md,
      color: brandConfig.colors.stableMahogany
    },
    propertyTitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.sm
    },
    propertyDescription: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.textSecondary,
      textAlign: 'center' as const
    },
    wifiCard: {
      padding: brandConfig.spacing.xl,
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      borderRadius: '16px',
      border: `2px solid ${brandConfig.colors.neutralGray}30`
    },
    wifiStrengthOption: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      padding: brandConfig.spacing.md,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: brandConfig.colors.neutralGray + '20'
      }
    },
    wifiStrengthSelected: {
      backgroundColor: brandConfig.colors.stableMahogany + '10',
      borderColor: brandConfig.colors.stableMahogany
    },
    recommendationAlert: {
      marginTop: brandConfig.spacing.md,
      borderRadius: '12px',
      fontWeight: brandConfig.typography.weightMedium
    },
    installationCard: {
      padding: brandConfig.spacing.lg,
      border: `1px solid ${brandConfig.colors.neutralGray}40`,
      borderRadius: '12px',
      marginBottom: brandConfig.spacing.md
    },
    installationTitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.sm
    },
    referralSection: {
      backgroundColor: brandConfig.colors.championGold + '10',
      padding: brandConfig.spacing.xl,
      borderRadius: '16px',
      border: `2px solid ${brandConfig.colors.championGold}40`
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
    installationOptionCard: {
      border: `2px solid ${brandConfig.colors.neutralGray}30`,
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)'
      }
    },
    selectedInstallationCard: {
      borderColor: brandConfig.colors.stableMahogany,
      backgroundColor: `${brandConfig.colors.stableMahogany}05`,
      boxShadow: '0 4px 20px rgba(139, 69, 19, 0.2)'
    },
    selfInstallSection: {
      marginTop: brandConfig.spacing.xl,
      padding: brandConfig.spacing.xl,
      backgroundColor: `${brandConfig.colors.hunterGreen}05`,
      borderRadius: '16px',
      border: `1px solid ${brandConfig.colors.hunterGreen}20`
    },
    professionalInstallSection: {
      marginTop: brandConfig.spacing.xl,
      padding: brandConfig.spacing.xl,
      backgroundColor: `${brandConfig.colors.championGold}05`,
      borderRadius: '16px',
      border: `1px solid ${brandConfig.colors.championGold}20`
    },
    resourcesCard: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: '12px',
      padding: brandConfig.spacing.lg,
      border: `1px solid ${brandConfig.colors.neutralGray}20`
    },
    wifiHeroSection: {
      backgroundColor: `${brandConfig.colors.championGold}10`,
      borderRadius: '20px',
      padding: brandConfig.spacing.xl,
      marginBottom: brandConfig.spacing.xxl,
      border: `2px solid ${brandConfig.colors.championGold}30`,
      position: 'relative',
      overflow: 'hidden'
    },
    wifiHeroTitle: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.md,
      fontFamily: brandConfig.typography.fontDisplay
    },
    wifiStrengthIndicator: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: '12px',
      padding: brandConfig.spacing.lg,
      marginTop: brandConfig.spacing.lg,
      border: `1px solid ${brandConfig.colors.neutralGray}20`
    },
    wifiRecommendation: {
      marginTop: brandConfig.spacing.md,
      padding: brandConfig.spacing.md,
      borderRadius: '8px',
      backgroundColor: brandConfig.colors.barnWhite,
      border: `1px solid ${brandConfig.colors.neutralGray}20`
    },
    formGroup: {
      marginBottom: brandConfig.spacing.xl
    },
    referralCard: {
      backgroundColor: `${brandConfig.colors.hunterGreen}10`,
      borderRadius: '16px',
      padding: brandConfig.spacing.lg,
      border: `2px solid ${brandConfig.colors.hunterGreen}30`,
      marginBottom: brandConfig.spacing.lg
    },
    benefitChip: {
      backgroundColor: brandConfig.colors.hunterGreen,
      color: brandConfig.colors.barnWhite,
      fontWeight: brandConfig.typography.weightMedium,
      marginRight: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.sm
    }
  };

  const propertyTypeOptions = [
    {
      id: 'home',
      icon: <HomeIcon sx={styles.propertyIcon} />,
      title: registrationFormData.facility.propertyType.options.home.title,
      description: registrationFormData.facility.propertyType.options.home.description
    },
    {
      id: 'boarding',
      icon: <BusinessIcon sx={styles.propertyIcon} />,
      title: registrationFormData.facility.propertyType.options.boarding.title,
      description: registrationFormData.facility.propertyType.options.boarding.description
    },
    {
      id: 'training',
      icon: <TrophyIcon sx={styles.propertyIcon} />,
      title: registrationFormData.facility.propertyType.options.training.title,
      description: registrationFormData.facility.propertyType.options.training.description
    },
    {
      id: 'multiple',
      icon: <LocationIcon sx={styles.propertyIcon} />,
      title: registrationFormData.facility.propertyType.options.multiple.title,
      description: registrationFormData.facility.propertyType.options.multiple.description
    }
  ];



  return (
    <RegistrationLayout
      currentStep={3}
      totalSteps={5}
      stepTitle={registrationFormData.facility.heading}
      stepDescription={registrationFormData.facility.subtitle}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Property Type Selection */}
        <Box sx={styles.section}>
          <Typography variant="h4" sx={styles.sectionTitle}>
            {registrationFormData.facility.propertyType.heading}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: brandConfig.spacing.xl, color: brandConfig.colors.neutralGray }}>
            {registrationFormData.facility.propertyType.label}
          </Typography>
          
          <Grid container spacing={3}>
            {propertyTypeOptions.map((option, index) => (
              <Grid item xs={12} sm={6} md={3} key={option.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                >
                  <Card
                    sx={[
                      styles.propertyCard,
                      facilityData.propertyType === option.id && styles.selectedCard
                    ]}
                    onClick={() => handleInputChange('propertyType', option.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', padding: brandConfig.spacing.lg }}>
                      {option.icon}
                      <Typography sx={styles.propertyTitle}>
                        {option.title}
                      </Typography>
                      <Typography sx={styles.propertyDescription}>
                        {option.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* WiFi Assessment - Hero Section */}
        <Box sx={styles.wifiHeroSection}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.md }}>
            <WifiIcon sx={{ fontSize: '2rem', color: brandConfig.colors.stableMahogany }} />
            <Typography variant="h3" sx={styles.wifiHeroTitle}>
              WiFi Assessment
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: brandConfig.colors.neutralGray, marginBottom: brandConfig.spacing.lg }}>
            Our cameras require reliable WiFi to deliver high-quality monitoring. Let's check your current setup.
          </Typography>
          
          <FormControl component="fieldset" sx={styles.formGroup}>
            <FormLabel component="legend" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightBold }}>
              {registrationFormData.facility.infrastructure.wifi.strength.label}
            </FormLabel>
            <RadioGroup
              value={facilityData.wifiStrength}
              onChange={(e) => handleInputChange('wifiStrength', e.target.value)}
              sx={{ marginTop: brandConfig.spacing.md }}
            >
              {Object.entries(registrationFormData.facility.infrastructure.wifi.strength.options).map(([key, label]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
                      {getWifiIcon(key)}
                      <Typography>{label}</Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Box sx={styles.wifiStrengthIndicator}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.md, marginBottom: brandConfig.spacing.md }}>
              <Typography variant="subtitle1" sx={{ fontWeight: brandConfig.typography.weightBold }}>
                WiFi Strength:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={facilityData.wifiStrength === 'excellent' ? 100 : 
                       facilityData.wifiStrength === 'good' ? 75 :
                       facilityData.wifiStrength === 'fair' ? 50 :
                       facilityData.wifiStrength === 'poor' ? 25 : 0}
                sx={{
                  flexGrow: 1,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: `${brandConfig.colors.neutralGray}20`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getWifiStrengthColor(facilityData.wifiStrength),
                    borderRadius: 6
                  }
                }}
              />
            </Box>
            <Alert 
              severity={facilityData.wifiStrength === 'excellent' || facilityData.wifiStrength === 'good' ? 'success' : 'warning'}
              sx={styles.wifiRecommendation}
            >
              {getWifiRecommendation(facilityData.wifiStrength)}
            </Alert>
          </Box>

          <FormGroup sx={{ marginTop: brandConfig.spacing.lg }}>
            <FormControlLabel
              control={
                <Switch
                  checked={facilityData.wifiUpgradeWilling}
                  onChange={(e) => handleInputChange('wifiUpgradeWilling', e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: brandConfig.typography.weightMedium }}>
                    {registrationFormData.facility.infrastructure.wifi.upgrade.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
                    {registrationFormData.facility.infrastructure.wifi.upgrade.help}
                  </Typography>
                </Box>
              }
            />
          </FormGroup>
        </Box>

        {/* Power Infrastructure */}
        <Box sx={styles.section}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.md, marginBottom: brandConfig.spacing.lg }}>
            <PowerIcon sx={{ fontSize: '1.5rem', color: brandConfig.colors.stableMahogany }} />
            <Typography variant="h4" sx={styles.sectionTitle}>
              Power Infrastructure
            </Typography>
          </Box>
          
          <FormControl component="fieldset" sx={styles.formGroup}>
            <FormLabel component="legend" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightBold }}>
              {registrationFormData.facility.infrastructure.power.availability.label}
            </FormLabel>
            <RadioGroup
              value={facilityData.powerAvailability}
              onChange={(e) => handleInputChange('powerAvailability', e.target.value)}
              sx={{ marginTop: brandConfig.spacing.md }}
            >
              {Object.entries(registrationFormData.facility.infrastructure.power.availability.options).map(([key, label]) => (
                <FormControlLabel key={key} value={key} control={<Radio />} label={label} />
              ))}
            </RadioGroup>
          </FormControl>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={facilityData.powerInstallPossible}
                  onChange={(e) => handleInputChange('powerInstallPossible', e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: brandConfig.typography.weightMedium }}>
                    {registrationFormData.facility.infrastructure.power.install.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
                    {registrationFormData.facility.infrastructure.power.install.help}
                  </Typography>
                </Box>
              }
            />
          </FormGroup>
        </Box>

        {/* Partnership & Referral */}
        <Box sx={styles.section}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.md, marginBottom: brandConfig.spacing.lg }}>
            <GroupIcon sx={{ fontSize: '1.5rem', color: brandConfig.colors.stableMahogany }} />
            <Typography variant="h4" sx={styles.sectionTitle}>
              {registrationFormData.facility.partnership.heading}
            </Typography>
          </Box>
          
          <FormGroup sx={{ marginBottom: brandConfig.spacing.lg }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={facilityData.hasReferral}
                  onChange={(e) => handleInputChange('hasReferral', e.target.checked)}
                />
              }
              label={registrationFormData.facility.partnership.referral.hasReferral}
            />
          </FormGroup>

          {facilityData.hasReferral && (
            <Box sx={styles.referralCard}>
              <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.md, color: brandConfig.colors.hunterGreen }}>
                Partnership Benefits
              </Typography>
              <Box sx={{ marginBottom: brandConfig.spacing.lg }}>
                <Chip label="20% Discount" sx={styles.benefitChip} />
                <Chip label="Priority Support" sx={styles.benefitChip} />
                <Chip label="Custom Integration" sx={styles.benefitChip} />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={registrationFormData.facility.partnership.referral.code.label}
                    placeholder={registrationFormData.facility.partnership.referral.code.placeholder}
                    value={facilityData.referralCode}
                    onChange={(e) => handleInputChange('referralCode', e.target.value)}
                    error={!!errors.referralCode}
                    helperText={errors.referralCode || registrationFormData.facility.partnership.referral.code.help}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={registrationFormData.facility.partnership.referral.referrer.label}
                    placeholder={registrationFormData.facility.partnership.referral.referrer.placeholder}
                    value={facilityData.referrerName}
                    onChange={(e) => handleInputChange('referrerName', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Installation Permission - Only for boarding/training facilities */}
        {(facilityData.propertyType === 'boarding' || facilityData.propertyType === 'training') && (
          <Box sx={styles.section}>
            <Typography variant="h4" sx={styles.sectionTitle}>
              Installation Permission
            </Typography>
            
            <FormGroup sx={{ marginBottom: brandConfig.spacing.lg }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={facilityData.installationPermission}
                    onChange={(e) => handleInputChange('installationPermission', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: brandConfig.typography.weightMedium }}>
                      {registrationFormData.facility.partnership.permission.hasPermission.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
                      {registrationFormData.facility.partnership.permission.hasPermission.help}
                    </Typography>
                  </Box>
                }
              />
            </FormGroup>

            {!facilityData.installationPermission && (
              <Box sx={{ marginTop: brandConfig.spacing.lg }}>
                <Typography variant="subtitle1" sx={{ marginBottom: brandConfig.spacing.md, fontWeight: brandConfig.typography.weightBold }}>
                  {registrationFormData.facility.partnership.permission.contact.label}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Name"
                      placeholder={registrationFormData.facility.partnership.permission.contact.name.placeholder}
                      value={facilityData.facilityContact?.name || ''}
                      onChange={(e) => handleNestedInputChange('facilityContact', 'name', e.target.value)}
                      error={!!errors.facilityContactName}
                      helperText={errors.facilityContactName}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Phone"
                      placeholder={registrationFormData.facility.partnership.permission.contact.phone.placeholder}
                      value={facilityData.facilityContact?.phone || ''}
                      onChange={(e) => handleNestedInputChange('facilityContact', 'phone', e.target.value)}
                      error={!!errors.facilityContactPhone}
                      helperText={errors.facilityContactPhone}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {/* Installation Setup */}
        <Box sx={styles.section}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.md, marginBottom: brandConfig.spacing.lg }}>
            <ScheduleIcon sx={{ fontSize: '1.5rem', color: brandConfig.colors.stableMahogany }} />
            <Typography variant="h4" sx={styles.sectionTitle}>
              {registrationFormData.facility.installation.heading}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ marginBottom: brandConfig.spacing.xl, color: brandConfig.colors.neutralGray }}>
            {registrationFormData.facility.installation.subtitle}
          </Typography>
          
          {/* Installation Type Selection */}
          <FormControl component="fieldset" sx={styles.formGroup}>
            <FormLabel component="legend" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightBold, marginBottom: brandConfig.spacing.md }}>
              {registrationFormData.facility.installation.installationType.label}
            </FormLabel>
            
            <Grid container spacing={3}>
              {Object.entries(registrationFormData.facility.installation.installationType.options).map(([key, option]) => (
                <Grid item xs={12} md={6} key={key}>
                  <Card 
                    sx={[
                      styles.installationOptionCard,
                      facilityData.installationType === key && styles.selectedInstallationCard
                    ]}
                    onClick={() => handleInputChange('installationType', key)}
                  >
                    <CardContent sx={{ padding: brandConfig.spacing.lg }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.md, marginBottom: brandConfig.spacing.md }}>
                        <Typography sx={{ fontSize: '1.5rem' }}>{option.icon}</Typography>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: brandConfig.typography.weightBold, color: brandConfig.colors.stableMahogany }}>
                            {option.title}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: key === 'self' ? brandConfig.colors.hunterGreen : brandConfig.colors.championGold }}>
                            {option.subtitle}
                          </Typography>
                        </Box>
                        {key === 'professional' && 'fee' in option && (
                          <Chip 
                            label={option.fee} 
                            sx={{ 
                              backgroundColor: brandConfig.colors.championGold, 
                              color: brandConfig.colors.barnWhite,
                              fontWeight: brandConfig.typography.weightBold 
                            }} 
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body2" sx={{ marginBottom: brandConfig.spacing.lg, color: brandConfig.colors.neutralGray }}>
                        {option.description}
                      </Typography>
                      
                      <Box>
                        {option.benefits.map((benefit, index) => (
                          <Typography key={index} variant="caption" sx={{ display: 'block', marginBottom: brandConfig.spacing.xs }}>
                            ✓ {benefit}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </FormControl>

          {/* Self-Installation Resources */}
          {facilityData.installationType === 'self' && (
            <Box sx={styles.selfInstallSection}>
              <Typography variant="h5" sx={styles.sectionTitle}>
                {registrationFormData.facility.installation.selfInstall.heading}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: brandConfig.spacing.lg, color: brandConfig.colors.neutralGray }}>
                {registrationFormData.facility.installation.selfInstall.description}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={styles.resourcesCard}>
                    <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.md, color: brandConfig.colors.stableMahogany }}>
                      Installation Support
                    </Typography>
                    {registrationFormData.facility.installation.selfInstall.resources.map((resource, index) => (
                      <Typography key={index} variant="body2" sx={{ marginBottom: brandConfig.spacing.sm }}>
                        {resource}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CameraPlacementDiagram showLabels={true} />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Professional Installation Details */}
          {facilityData.installationType === 'professional' && (
            <Box sx={styles.professionalInstallSection}>
              <Typography variant="h5" sx={styles.sectionTitle}>
                {registrationFormData.facility.installation.professionalInstall.heading}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: brandConfig.spacing.lg, color: brandConfig.colors.neutralGray }}>
                {registrationFormData.facility.installation.professionalInstall.description}
              </Typography>
              
              {/* Installation Fee Callout */}
              <Alert 
                severity="info" 
                sx={{ 
                  marginBottom: brandConfig.spacing.xl,
                  backgroundColor: `${brandConfig.colors.championGold}10`,
                  borderColor: brandConfig.colors.championGold
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: brandConfig.typography.weightBold }}>
                  Installation Fee: {registrationFormData.facility.installation.professionalInstall.fee.amount}
                </Typography>
                <Typography variant="body2">
                  {registrationFormData.facility.installation.professionalInstall.fee.description}
                </Typography>
              </Alert>
              
              {/* Scheduling Preferences */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset" sx={styles.formGroup}>
                    <FormLabel component="legend" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightBold }}>
                      {registrationFormData.facility.installation.professionalInstall.timeline.label}
                    </FormLabel>
                    <RadioGroup
                      value={facilityData.preferredTimeframe}
                      onChange={(e) => handleInputChange('preferredTimeframe', e.target.value)}
                      sx={{ marginTop: brandConfig.spacing.md }}
                    >
                      {Object.entries(registrationFormData.facility.installation.professionalInstall.timeline.options).map(([key, label]) => (
                        <FormControlLabel key={key} value={key} control={<Radio />} label={label} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset" sx={styles.formGroup}>
                    <FormLabel component="legend" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightBold }}>
                      {registrationFormData.facility.installation.professionalInstall.availability.label}
                    </FormLabel>
                    <RadioGroup
                      value={facilityData.preferredDays}
                      onChange={(e) => handleInputChange('preferredDays', e.target.value)}
                      sx={{ marginTop: brandConfig.spacing.md }}
                    >
                      {Object.entries(registrationFormData.facility.installation.professionalInstall.availability.options).map(([key, label]) => (
                        <FormControlLabel key={key} value={key} control={<Radio />} label={label} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset" sx={styles.formGroup}>
                    <FormLabel component="legend" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightBold }}>
                      {registrationFormData.facility.installation.professionalInstall.time.label}
                    </FormLabel>
                    <RadioGroup
                      value={facilityData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      sx={{ marginTop: brandConfig.spacing.md }}
                    >
                      {Object.entries(registrationFormData.facility.installation.professionalInstall.time.options).map(([key, label]) => (
                        <FormControlLabel key={key} value={key} control={<Radio />} label={label} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label={registrationFormData.facility.installation.professionalInstall.notes.label}
                placeholder={registrationFormData.facility.installation.professionalInstall.notes.placeholder}
                value={facilityData.installationNotes}
                onChange={(e) => handleInputChange('installationNotes', e.target.value)}
                sx={{ marginTop: brandConfig.spacing.lg }}
              />
            </Box>
          )}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={styles.buttonContainer}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={styles.backButton}
          >
            {registrationFormData.facility.buttons.back}
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={styles.nextButton}
          >
            {registrationFormData.facility.buttons.next}
          </Button>
        </Box>
      </motion.div>
    </RegistrationLayout>
  );
}; 