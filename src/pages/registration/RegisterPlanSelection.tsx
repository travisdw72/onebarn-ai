import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { brandConfig } from '../../config/brandConfig';
import { registrationWorkflowConfig } from '../../config/registrationWorkflowConfig';
import { pricingCalculator } from '../../config/pricingCalculator';
import { useNavigation } from '../../contexts/NavigationContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import { Header } from '../../components/layout/Header';
import { 
  ISelectedPlan,
  IPlanSelection,
  ICameraSelection,
  ISmartRecommendations
} from '../../interfaces/RegistrationTypes';
import { useScrollToTop } from '../../hooks/useScrollToTop';

interface IRegisterPlanSelectionProps {
  onNext: (data: IPlanSelection) => void;
  onBack: () => void;
  initialData?: Partial<IPlanSelection>;
  horseCount: number;
  facilityData: any;
}

export const RegisterPlanSelection: React.FC<IRegisterPlanSelectionProps> = ({
  onNext,
  onBack,
  initialData,
  horseCount,
  facilityData
}) => {
  const { navigateTo } = useNavigation();
  
  // Scroll to top when component mounts
  useScrollToTop();
  
  const [selections, setSelections] = useState<IPlanSelection>({
    selectedPlan: initialData?.selectedPlan || 'professional',
    billingCycle: initialData?.billingCycle || 'monthly',
    cameras: initialData?.cameras || [],
    selectedBundle: initialData?.selectedBundle || '',
    installationPreference: initialData?.installationPreference || 'professional',
    purchaseVsLease: initialData?.purchaseVsLease || 'lease'
  });

  const [additionalCameraCount, setAdditionalCameraCount] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [smartRecommendations, setSmartRecommendations] = useState<ISmartRecommendations>({
    recommendedPlan: 'professional',
    reasoning: [],
    savings: 0
  });

  const [installationPreference, setInstallationPreference] = useState<'self' | 'professional'>('self');

  // Calculate pricing breakdown using additionalCameraCount
  const pricingBreakdown = pricingCalculator.calculateTotal(
    selections.selectedPlan,
    horseCount,
    additionalCameraCount, // Fixed: Use additionalCameraCount instead of selections.cameras.length
    selections.billingCycle,
    selections.selectedBundle,
    referralCode,
    selections.purchaseVsLease // Include purchase vs lease preference
  );

  // Get current camera pricing from calculator
  const cameraPricing = pricingCalculator.getCameraPricing(selections.selectedPlan);

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAdditionalCameraPrice = (planId: string): string => {
    const pricing = pricingCalculator.getCameraPricing(planId as any);
    return `$${pricing.purchase}`;
  };

  const getAdditionalCameraPriceNumber = (planId: string): number => {
    const pricing = pricingCalculator.getCameraPricing(planId as any);
    return pricing.purchase;
  };

  // Event handlers
  const handleAdditionalCameraChange = (change: number) => {
    setAdditionalCameraCount(Math.max(0, additionalCameraCount + change));
  };

  const handlePlanSelect = (planId: 'starter' | 'professional' | 'estate') => {
    setSelections(prev => ({
      ...prev,
      selectedPlan: planId
    }));
  };

  const handleBillingToggle = (annual: boolean) => {
    setSelections(prev => ({
      ...prev,
      billingCycle: annual ? 'annual' : 'monthly'
    }));
  };

  const handlePurchaseVsLeaseToggle = (value: 'lease' | 'purchase') => {
    setSelections(prev => ({
      ...prev,
      purchaseVsLease: value
    }));
  };

  const handleApplyReferralCode = () => {
    if (referralCode.trim()) {
      const validation = pricingCalculator.validateReferralCode(referralCode.trim());
      if (validation.valid) {
        // The referral code is already applied in the pricing calculation
        // We could show a success message here
        console.log('Referral code applied successfully:', referralCode, 'Discount:', validation.discount);
      } else {
        console.log('Invalid referral code:', referralCode);
        // Could show error message here
      }
    }
  };

  const validateSelections = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selections.selectedPlan) {
      newErrors.plan = 'Please select a software plan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSelections()) {
      const planData: IPlanSelection = {
        ...selections,
        additionalCameraCount,
        referralCode: referralCode.trim()
      };
      onNext(planData);
    }
  };

  // Load installation preference from localStorage
  useEffect(() => {
    const existingData = localStorage.getItem('registrationData');
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        if (parsed.facilityInfo?.installationType) {
          setInstallationPreference(parsed.facilityInfo.installationType);
        }
      } catch (error) {
        console.error('Error loading installation preference:', error);
      }
    }
  }, []);

  // Generate smart recommendations
  useEffect(() => {
    const recommendations: string[] = [];
    let recommendedPlan: 'starter' | 'professional' | 'estate' = 'professional';

    if (horseCount > 10) {
      recommendations.push(`With ${horseCount} horses, the Estate plan offers the best value and comprehensive coverage.`);
      recommendedPlan = 'estate';
    } else if (horseCount > 5) {
      recommendations.push(`For ${horseCount} horses, the Professional plan provides optimal monitoring capabilities.`);
      recommendedPlan = 'professional';
    } else {
      recommendations.push(`The Starter plan is perfect for smaller operations with ${horseCount} horses.`);
      recommendedPlan = 'starter';
    }

    if (facilityData?.hasMultipleBarns) {
      recommendations.push('Multiple barn locations benefit from centralized monitoring and alerts.');
    }

    if (facilityData?.hasSpecialNeeds) {
      recommendations.push('Special needs horses require enhanced monitoring for optimal care.');
    }

    setSmartRecommendations({
      recommendedPlan,
      reasoning: recommendations,
      savings: 0
    });
  }, [horseCount, facilityData]);

  const styles = {
    heroSection: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand} 0%, ${brandConfig.colors.stableMahogany} 100%)`,
      padding: `${brandConfig.spacing.xxl} 0`,
      color: brandConfig.colors.barnWhite,
      textAlign: 'center' as const
    },
    heroTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: '3.5rem',
      fontWeight: 400,
      marginBottom: brandConfig.spacing.lg,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.02em'
    },
    heroSubtitle: {
      fontSize: '1.3rem',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto'
    },
    contentSection: {
      padding: `${brandConfig.spacing.xxl} 0`,
      backgroundColor: brandConfig.colors.barnWhite,
      minHeight: '100vh'
    },
    sectionTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: '2.5rem',
      fontWeight: 400,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.xl,
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.02em'
    },
    billingToggle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: brandConfig.spacing.md,
      marginBottom: brandConfig.spacing.xl,
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.arenaSand + '20',
      borderRadius: '16px'
    },
    planGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: brandConfig.spacing.xl,
      marginBottom: brandConfig.spacing.xxl
    },
    planCard: {
      cursor: 'pointer',
      borderRadius: '16px',
      border: `3px solid ${brandConfig.colors.neutralGray}20`,
      transition: 'all 0.3s ease',
      height: '100%',
      '&:hover': {
        borderColor: brandConfig.colors.stableMahogany,
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 24px ${brandConfig.colors.stableMahogany}20`
      }
    },
    planCardSelected: {
      borderColor: brandConfig.colors.stableMahogany,
      backgroundColor: brandConfig.colors.stableMahogany + '05',
      boxShadow: `0 8px 16px ${brandConfig.colors.stableMahogany}20`
    },
    planCardPopular: {
      position: 'relative' as const,
      '&::before': {
        content: '"Most Popular"',
        position: 'absolute' as const,
        top: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: brandConfig.colors.championGold,
        color: brandConfig.colors.midnightBlack,
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 700,
        zIndex: 1
      }
    },
    planName: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: '2rem',
      fontWeight: 400,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.sm,
      textTransform: 'uppercase' as const
    },
    planPrice: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      marginBottom: brandConfig.spacing.lg,
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: '3rem',
      fontWeight: 700,
      color: brandConfig.colors.hunterGreen
    },
    planPriceUnit: {
      fontSize: '1.2rem',
      color: brandConfig.colors.neutralGray,
      marginLeft: brandConfig.spacing.xs
    },
    planFeatures: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    planFeature: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.sm,
      fontSize: '1rem',
      color: brandConfig.colors.neutralGray
    },
    equipmentSection: {
      marginBottom: brandConfig.spacing.xxl,
      padding: brandConfig.spacing.xl,
      backgroundColor: brandConfig.colors.arenaSand + '10',
      borderRadius: '16px'
    },
    orderSummary: {
      position: 'sticky' as const,
      top: brandConfig.spacing.xl,
      padding: brandConfig.spacing.xl,
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: '16px',
      border: `2px solid ${brandConfig.colors.stableMahogany}20`,
      height: 'fit-content'
    },
    summaryTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: '1.5rem',
      fontWeight: 400,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.lg,
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: brandConfig.spacing.md,
      padding: `${brandConfig.spacing.sm} 0`,
      borderBottom: `1px solid ${brandConfig.colors.neutralGray}20`
    },
    summaryTotal: {
      marginTop: brandConfig.spacing.lg,
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.championGold + '10',
      borderRadius: '12px',
      border: `2px solid ${brandConfig.colors.championGold}40`
    },
    totalAmount: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: '2rem',
      fontWeight: 700,
      color: brandConfig.colors.hunterGreen
    }
  };

  const handleLogoClick = () => {
    navigateTo('home');
  };

  const handleHelpClick = () => {
    window.open('mailto:support@onebarn.ai?subject=Registration Help', '_blank');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: brandConfig.gradients.heroPrimary,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: brandConfig.gradients.heroOverlay,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.2,
        },
      }} />
      
      {/* Registration Header */}
      <Header showNavigation={true} />

      {/* Hero Section */}
      <Box sx={[styles.heroSection, { position: 'relative', zIndex: 10 }]}>
        <Container maxWidth="lg">
          <Typography sx={styles.heroTitle}>
            Choose Your Perfect Plan
          </Typography>
          <Typography sx={styles.heroSubtitle}>
            Select the monitoring solution that fits your operation perfectly
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={[styles.contentSection, { position: 'relative', zIndex: 10 }]}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Plans Section */}
            <Grid item xs={12} lg={8}>
              {/* Smart Recommendations */}
              {smartRecommendations.reasoning.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="info" 
                    icon={<TrendingUpIcon />}
                    sx={{ 
                      marginBottom: brandConfig.spacing.xl,
                      backgroundColor: brandConfig.colors.ribbonBlue + '10',
                      color: brandConfig.colors.ribbonBlue,
                      borderRadius: '12px',
                      fontSize: '1rem'
                    }}
                  >
                    <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.sm }}>
                      Smart Recommendations for Your Facility
                    </Typography>
                    {smartRecommendations.reasoning.map((reason, index) => (
                      <Typography key={index} variant="body2" sx={{ marginBottom: brandConfig.spacing.xs }}>
                        • {reason}
                      </Typography>
                    ))}
                  </Alert>
                </motion.div>
              )}

              {/* Billing Toggle */}
              <Box sx={styles.billingToggle}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Monthly Billing
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selections.billingCycle === 'annual'}
                      onChange={(e) => handleBillingToggle(e.target.checked)}
                      size="medium"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: brandConfig.colors.championGold,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: brandConfig.colors.championGold,
                        },
                      }}
                    />
                  }
                  label=""
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Annual Billing
                </Typography>
                {selections.billingCycle === 'annual' && (
                  <Chip
                    label="Save 20%"
                    sx={{
                      backgroundColor: brandConfig.colors.championGold,
                      color: brandConfig.colors.midnightBlack,
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  />
                )}
              </Box>

              {/* Software Plans */}
              <Typography sx={styles.sectionTitle}>
                Software Plans
              </Typography>

              <Box sx={styles.planGrid}>
                {Object.entries(registrationWorkflowConfig.plans).map(([planId, plan]) => (
                  <motion.div
                    key={planId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      sx={[
                        styles.planCard,
                        selections.selectedPlan === planId && styles.planCardSelected,
                        planId === 'professional' && styles.planCardPopular
                      ]}
                      onClick={() => handlePlanSelect(planId as any)}
                    >
                      <CardContent sx={{ padding: brandConfig.spacing.xl }}>
                        <Typography sx={styles.planName}>
                          {plan.displayName}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ 
                          color: brandConfig.colors.neutralGray,
                          marginBottom: brandConfig.spacing.lg,
                          fontSize: '1.1rem'
                        }}>
                          {plan.subtitle}
                        </Typography>
                        
                        <Box sx={styles.planPrice}>
                          {formatCurrency(pricingCalculator.calculateSoftwarePrice(
                            planId as any,
                            horseCount,
                            selections.billingCycle
                          ).currentPrice)}
                          <Typography sx={styles.planPriceUnit}>
                            /month
                          </Typography>
                        </Box>

                        {selections.billingCycle === 'annual' && (
                          <Typography variant="body2" sx={{ 
                            color: brandConfig.colors.championGold,
                            marginBottom: brandConfig.spacing.md,
                            fontWeight: 600
                          }}>
                            Annual savings: {formatCurrency(pricingCalculator.calculateSoftwarePrice(
                              planId as any,
                              horseCount,
                              'annual'
                            ).savings)}
                          </Typography>
                        )}

                        <ul style={styles.planFeatures}>
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} style={styles.planFeature}>
                              <CheckIcon sx={{ color: brandConfig.colors.successGreen, fontSize: '1.2rem' }} />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <Box sx={{
                          marginTop: brandConfig.spacing.lg,
                          padding: brandConfig.spacing.md,
                          backgroundColor: brandConfig.colors.championGold + '15',
                          borderRadius: '8px',
                          border: `1px solid ${brandConfig.colors.championGold}40`
                        }}>
                          <Typography variant="body2" sx={{ 
                            color: brandConfig.colors.stableMahogany,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            textAlign: 'center'
                          }}>
                            ✓ Up to {plan.horses.included} horses
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: brandConfig.colors.stableMahogany,
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            textAlign: 'center',
                            marginTop: brandConfig.spacing.xs
                          }}>
                            ✓ {plan.cameras.included} cameras included
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>

              {/* Additional Camera Equipment Section */}
              <Box sx={styles.equipmentSection}>
                <Typography sx={styles.sectionTitle}>
                  Additional Camera Equipment
                </Typography>
                <Typography variant="subtitle1" sx={{
                  textAlign: 'center',
                  color: brandConfig.colors.neutralGray,
                  marginBottom: brandConfig.spacing.xl,
                  fontSize: '1.1rem'
                }}>
                  Your plan includes cameras - add more for expanded coverage
                </Typography>
                
                <Grid container spacing={4} sx={{ marginBottom: brandConfig.spacing.xxl }}>
                  {/* Professional Camera Card */}
                  <Grid item xs={12} md={5}>
                    <Card sx={{
                      height: '100%',
                      padding: brandConfig.spacing.xl,
                      textAlign: 'center',
                      border: `2px solid ${brandConfig.colors.hunterGreen}20`,
                      borderRadius: '16px',
                      backgroundColor: brandConfig.colors.barnWhite,
                      transition: 'all 0.3s ease'
                    }}>
                      <Box sx={{ fontSize: '4rem', marginBottom: brandConfig.spacing.md }}>📷</Box>
                      <Typography sx={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: brandConfig.colors.stableMahogany,
                        marginBottom: brandConfig.spacing.sm
                      }}>
                        Professional AI Camera
                      </Typography>

                      {/* Lease/Purchase Toggle */}
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: brandConfig.spacing.lg
                      }}>
                        <ToggleButtonGroup
                          value={selections.purchaseVsLease}
                          exclusive
                          onChange={(e, value) => value && handlePurchaseVsLeaseToggle(value)}
                          size="small"
                          sx={{
                            '& .MuiToggleButton-root': {
                              border: `1px solid ${brandConfig.colors.stableMahogany}40`,
                              color: brandConfig.colors.stableMahogany,
                              '&.Mui-selected': {
                                backgroundColor: brandConfig.colors.stableMahogany,
                                color: brandConfig.colors.barnWhite
                              }
                            }
                          }}
                        >
                          <ToggleButton value="lease">
                            Lease (Recommended)
                          </ToggleButton>
                          <ToggleButton value="purchase">
                            Purchase
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>

                      {/* Dynamic Pricing */}
                      <Typography sx={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: brandConfig.colors.hunterGreen,
                        marginBottom: brandConfig.spacing.md
                      }}>
                        {selections.purchaseVsLease === 'lease' 
                          ? `$${cameraPricing.lease}/mo`
                          : `${formatCurrency(cameraPricing.purchase)} + $${cameraPricing.apiCost}/mo`
                        }
                      </Typography>

                      <Typography variant="body2" sx={{ 
                        color: brandConfig.colors.neutralGray,
                        marginBottom: brandConfig.spacing.lg,
                        lineHeight: 1.6
                      }}>
                        4K Ultra HD • 160° field of view • Advanced night vision • Weatherproof • AI-powered analytics
                      </Typography>

                      {/* Quantity Controls */}
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: brandConfig.spacing.md,
                        marginBottom: brandConfig.spacing.lg
                      }}>
                        <IconButton
                          onClick={() => handleAdditionalCameraChange(-1)}
                          disabled={additionalCameraCount === 0}
                          sx={{
                            backgroundColor: brandConfig.colors.stableMahogany + '10',
                            color: brandConfig.colors.stableMahogany,
                            '&:hover': {
                              backgroundColor: brandConfig.colors.stableMahogany + '20'
                            }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{
                          fontSize: '2rem',
                          fontWeight: 700,
                          color: brandConfig.colors.stableMahogany,
                          minWidth: '60px',
                          textAlign: 'center'
                        }}>
                          {additionalCameraCount}
                        </Typography>
                        <IconButton
                          onClick={() => handleAdditionalCameraChange(1)}
                          sx={{
                            backgroundColor: brandConfig.colors.stableMahogany + '10',
                            color: brandConfig.colors.stableMahogany,
                            '&:hover': {
                              backgroundColor: brandConfig.colors.stableMahogany + '20'
                            }
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>

                      {selections.purchaseVsLease === 'lease' ? (
                        <Typography variant="body2" sx={{
                          color: brandConfig.colors.championGold,
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}>
                          Lower upfront cost • Includes maintenance, support & API costs
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{
                          color: brandConfig.colors.stableMahogany,
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}>
                          One-time purchase • Monthly API costs for AI analysis
                        </Typography>
                      )}
                    </Card>
                  </Grid>

                  {/* Benefits Section */}
                  <Grid item xs={12} md={7}>
                    <Typography sx={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: brandConfig.colors.stableMahogany,
                      marginBottom: brandConfig.spacing.lg
                    }}>
                      Why Add More Cameras?
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ fontSize: '2.5rem', marginBottom: brandConfig.spacing.sm }}>🎯</Box>
                          <Typography sx={{ fontWeight: 700, marginBottom: brandConfig.spacing.sm }}>
                            Complete Coverage
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
                            Monitor multiple stalls, paddocks, and turnout areas simultaneously
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ fontSize: '2.5rem', marginBottom: brandConfig.spacing.sm }}>⚡</Box>
                          <Typography sx={{ fontWeight: 700, marginBottom: brandConfig.spacing.sm }}>
                            Backup Protection
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
                            Redundant monitoring ensures you never miss critical moments
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ fontSize: '2.5rem', marginBottom: brandConfig.spacing.sm }}>📊</Box>
                          <Typography sx={{ fontWeight: 700, marginBottom: brandConfig.spacing.sm }}>
                            Better Analytics
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
                            Multiple angles provide more comprehensive behavioral insights
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ fontSize: '2.5rem', marginBottom: brandConfig.spacing.sm }}>💎</Box>
                          <Typography sx={{ fontWeight: 700, marginBottom: brandConfig.spacing.sm }}>
                            Volume Discounts
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
                            $10 savings per camera!
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Order Summary Sidebar */}
            <Grid item xs={12} lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Paper sx={styles.orderSummary}>
                  <Typography sx={styles.summaryTitle}>
                    Order Summary
                  </Typography>

                  {/* Software Summary */}
                  <Box sx={styles.summaryRow}>
                    <Typography variant="body1">
                      Software Subscription
                      {selections.billingCycle === 'annual' && (
                        <span style={{ color: brandConfig.colors.championGold, fontSize: '0.9rem', marginLeft: '8px' }}>
                          (Annual)
                        </span>
                      )}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatCurrency(pricingBreakdown.software.currentPrice)}/mo
                    </Typography>
                  </Box>

                  {/* Hardware Summary */}
                  <Box sx={styles.summaryRow}>
                    <Typography variant="body1">
                      Camera Equipment
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Included in plan
                    </Typography>
                  </Box>

                  {/* Additional Cameras */}
                  {additionalCameraCount > 0 && (
                    <Box sx={styles.summaryRow}>
                      <Typography variant="body1">
                        Additional Cameras ({additionalCameraCount})
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selections.purchaseVsLease === 'lease' 
                          ? `$${cameraPricing.lease * additionalCameraCount}/mo`
                          : `${formatCurrency(cameraPricing.purchase * additionalCameraCount)} upfront`
                        }
                      </Typography>
                    </Box>
                  )}
                  
                  {/* API Costs for Purchased Cameras */}
                  {additionalCameraCount > 0 && selections.purchaseVsLease === 'purchase' && (
                    <Box sx={styles.summaryRow}>
                      <Typography variant="body1">
                        API & Monitoring ({additionalCameraCount} cameras)
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ${cameraPricing.apiCost * additionalCameraCount}/mo
                      </Typography>
                    </Box>
                  )}

                  {/* Shipping & Handling Note */}
                  <Box sx={styles.summaryRow}>
                    <Typography variant="body1">
                      Shipping & Handling
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600,
                      color: brandConfig.colors.neutralGray,
                      fontStyle: 'italic'
                    }}>
                      Calculated next
                    </Typography>
                  </Box>
                  
                  {/* Installation Summary */}
                  <Box sx={styles.summaryRow}>
                    <Typography variant="body1">
                      {installationPreference === 'professional' ? 'Professional Installation' : 'Self-Installation Kit'}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600,
                      color: installationPreference === 'professional' ? brandConfig.colors.stableMahogany : brandConfig.colors.successGreen,
                      fontStyle: 'normal'
                    }}>
                      {installationPreference === 'professional' ? 'Starting at $199' : 'Included'}
                    </Typography>
                  </Box>
                  
                  {/* Installation Note */}
                  <Box sx={{ marginLeft: brandConfig.spacing.md, marginBottom: brandConfig.spacing.sm }}>
                    <Typography variant="body2" sx={{ 
                      color: brandConfig.colors.neutralGray,
                      fontSize: '0.85rem',
                      fontStyle: 'italic'
                    }}>
                      {installationPreference === 'professional' 
                        ? 'Final cost calculated on next screen based on your facility requirements'
                        : 'Complete setup guide, video tutorials & phone support included'
                      }
                    </Typography>
                  </Box>

                  {/* Annual Savings */}
                  {selections.billingCycle === 'annual' && pricingBreakdown.discounts.annual > 0 && (
                    <Box sx={styles.summaryRow}>
                      <Typography variant="body1" sx={{ color: brandConfig.colors.successGreen }}>
                        Annual Billing Savings
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 600,
                        color: brandConfig.colors.successGreen
                      }}>
                        -{formatCurrency(pricingBreakdown.discounts.annual)}
                      </Typography>
                    </Box>
                  )}

                  {/* Other Discounts */}
                  {(pricingBreakdown.discounts.bundle > 0 || pricingBreakdown.discounts.referral > 0) && (
                    <Box sx={styles.summaryRow}>
                      <Typography variant="body1" sx={{ color: brandConfig.colors.successGreen }}>
                        Discounts & Savings
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 600,
                        color: brandConfig.colors.successGreen
                      }}>
                        -{formatCurrency(pricingBreakdown.discounts.bundle + pricingBreakdown.discounts.referral)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={styles.summaryTotal}>
                    <Box sx={styles.summaryRow}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Monthly Recurring
                      </Typography>
                      <Typography sx={styles.totalAmount}>
                        {formatCurrency(
                          pricingBreakdown.software.currentPrice + 
                          (selections.purchaseVsLease === 'lease' && additionalCameraCount > 0 
                            ? (cameraPricing.lease * additionalCameraCount)
                            : (additionalCameraCount > 0 ? cameraPricing.apiCost * additionalCameraCount : 0))
                        )}/mo
                      </Typography>
                    </Box>
                    
                    {/* Only show one-time payment if cameras are purchased */}
                    {(selections.purchaseVsLease === 'purchase' && additionalCameraCount > 0) && (
                      <Box sx={styles.summaryRow}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          One-time Payment
                        </Typography>
                        <Typography sx={styles.totalAmount}>
                          {formatCurrency(cameraPricing.purchase * additionalCameraCount)}
                          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>
                            (Camera equipment only)
                          </Typography>
                        </Typography>
                      </Box>
                    )}

                    <Box sx={styles.summaryRow}>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700,
                        color: brandConfig.colors.championGold
                      }}>
                        First Year Total
                      </Typography>
                      <Typography sx={[styles.totalAmount, { 
                        color: brandConfig.colors.championGold,
                        fontSize: '2.5rem'
                      }]}>
                        {formatCurrency(
                          (pricingBreakdown.software.currentPrice * 12) + 
                          (selections.purchaseVsLease === 'purchase' && additionalCameraCount > 0
                            ? (cameraPricing.purchase * additionalCameraCount) + (cameraPricing.apiCost * additionalCameraCount * 12)
                            : (cameraPricing.lease * additionalCameraCount * 12))
                        )}
                        <Typography variant="caption" sx={{ display: 'block', fontSize: '0.9rem', opacity: 0.8 }}>
                          *Excludes shipping & setup costs
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Referral Code Input */}
                  <Box sx={{ marginTop: brandConfig.spacing.lg }}>
                    <Typography variant="body2" sx={{ 
                      marginBottom: brandConfig.spacing.sm,
                      fontWeight: 600
                    }}>
                      Have a referral code?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: brandConfig.spacing.sm }}>
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Enter code"
                        style={{
                          flex: 1,
                          padding: brandConfig.spacing.sm,
                          borderRadius: '8px',
                          border: `2px solid ${brandConfig.colors.stableMahogany}30`,
                          fontSize: '1rem',
                          fontFamily: brandConfig.typography.fontPrimary
                        }}
                      />
                      <Button
                        variant="outlined"
                        onClick={handleApplyReferralCode}
                        disabled={!referralCode.trim()}
                        sx={{
                          borderColor: brandConfig.colors.stableMahogany,
                          color: brandConfig.colors.stableMahogany,
                          '&:hover': {
                            borderColor: brandConfig.colors.stableMahogany,
                            backgroundColor: brandConfig.colors.stableMahogany + '10'
                          }
                        }}
                      >
                        Apply
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* Navigation Buttons */}
            <Grid item xs={12}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: brandConfig.spacing.xxl,
                padding: `${brandConfig.spacing.xl} 0`
              }}>
                <Button
                  variant="outlined"
                  onClick={onBack}
                  sx={{
                    padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
                    borderRadius: '12px',
                    borderColor: brandConfig.colors.neutralGray,
                    color: brandConfig.colors.neutralGray,
                    fontSize: '1rem',
                    fontWeight: 600,
                    minWidth: '140px',
                    minHeight: '48px',
                    '&:hover': {
                      borderColor: brandConfig.colors.stableMahogany,
                      color: brandConfig.colors.stableMahogany
                    }
                  }}
                >
                  ← Back to Facility
                </Button>

                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selections.selectedPlan}
                  sx={{
                    padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
                    borderRadius: '12px',
                    backgroundColor: brandConfig.colors.stableMahogany,
                    color: brandConfig.colors.barnWhite,
                    fontSize: '1rem',
                    fontWeight: 600,
                    minWidth: '140px',
                    minHeight: '48px',
                    '&:hover': {
                      backgroundColor: brandConfig.colors.stableMahoganyDark
                    },
                    '&:disabled': {
                      backgroundColor: brandConfig.colors.neutralGray + '40',
                      color: brandConfig.colors.neutralGray
                    }
                  }}
                >
                  Continue to Payment →
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom Reassurance Section - As Footer */}
      <Box sx={{
        backgroundColor: brandConfig.colors.hunterGreen,
        color: brandConfig.colors.barnWhite,
        padding: `${brandConfig.spacing.xxl} 0`,
        marginTop: brandConfig.spacing.xxl,
        position: 'relative',
        zIndex: 10
      }}>
        <Container maxWidth="lg">
          <Typography sx={{
            fontFamily: brandConfig.typography.fontDisplay,
            fontSize: '2.5rem',
            fontWeight: 400,
            textAlign: 'center',
            marginBottom: brandConfig.spacing.xl,
            textTransform: 'uppercase',
            letterSpacing: '0.02em'
          }}>
            You're Making the Best Choice for Your Horses
          </Typography>
          
          <Grid container spacing={4} sx={{ marginBottom: brandConfig.spacing.xl }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: '3rem', marginBottom: brandConfig.spacing.md }}>🏆</Box>
                <Typography sx={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 700, 
                  marginBottom: brandConfig.spacing.sm,
                  color: brandConfig.colors.championGold
                }}>
                  Industry Leading Technology
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Our AI has analyzed over 2.5 million hours of horse behavior, making it the most advanced equine monitoring system available.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: '3rem', marginBottom: brandConfig.spacing.md }}>⚡</Box>
                <Typography sx={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 700, 
                  marginBottom: brandConfig.spacing.sm,
                  color: brandConfig.colors.championGold
                }}>
                  Saves Lives & Money
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Early detection of colic, lameness, and other issues has saved horse owners an average of $3,200 per incident in veterinary costs.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: '3rem', marginBottom: brandConfig.spacing.md }}>🛡️</Box>
                <Typography sx={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 700, 
                  marginBottom: brandConfig.spacing.sm,
                  color: brandConfig.colors.championGold
                }}>
                  Complete Peace of Mind
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Sleep soundly knowing your horses are being monitored 24/7 by AI that never gets tired, never misses a detail.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Testimonial */}
          <Box sx={{
            textAlign: 'center',
            padding: brandConfig.spacing.xl,
            backgroundColor: brandConfig.colors.barnWhite + '10',
            borderRadius: '16px',
            marginBottom: brandConfig.spacing.xl
          }}>
            <Typography variant="h5" sx={{ 
              fontStyle: 'italic',
              marginBottom: brandConfig.spacing.md,
              fontSize: '1.4rem',
              lineHeight: 1.6,
              color: brandConfig.colors.barnWhite
            }}>
              "One Barn AI caught my mare's colic symptoms at 2 AM - 3 hours before I would have found her. 
              The vet said that early detection literally saved her life. This system has paid for itself ten times over."
            </Typography>
            <Typography sx={{ 
              fontWeight: 600,
              color: brandConfig.colors.championGold,
              fontSize: '1.1rem'
            }}>
              — Sarah Mitchell, Professional Trainer, Colorado
            </Typography>
          </Box>

          {/* Guarantee */}
          <Box sx={{
            textAlign: 'center',
            padding: brandConfig.spacing.lg,
            border: `2px solid ${brandConfig.colors.championGold}`,
            borderRadius: '12px',
            backgroundColor: brandConfig.colors.championGold + '10'
          }}>
            <Typography sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: brandConfig.colors.championGold,
              marginBottom: brandConfig.spacing.sm
            }}>
              30-Day Money-Back Guarantee
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              If you're not completely satisfied with the insights and peace of mind our system provides, 
              we'll refund every penny. No questions asked.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Errors */}
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ 
          margin: brandConfig.spacing.xl,
          borderRadius: '12px'
        }}>
          {Object.values(errors).map((error, index) => (
            <Typography key={index} variant="body2">
              {error}
            </Typography>
          ))}
        </Alert>
      )}
    </Box>
  );
}; 

// Create a wrapper component for routing
const RegisterPlanSelectionPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  
  // Load data from localStorage
  const [registrationData, setRegistrationData] = useState<any>(null);
  
  useEffect(() => {
    const existingData = localStorage.getItem('registrationData');
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        setRegistrationData(parsed);
      } catch (error) {
        console.error('Error loading registration data:', error);
      }
    }
  }, []);

  const handleNext = (data: IPlanSelection) => {
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    localStorage.setItem('registrationData', JSON.stringify({
      ...existingData,
      selectedPlan: data,
      currentStep: 'payment'
    }));
    
    navigateTo('register-payment');
  };

  const handleBack = () => {
    navigateTo('register-facility');
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  return (
    <RegisterPlanSelection
      onNext={handleNext}
      onBack={handleBack}
      initialData={registrationData.selectedPlan}
      horseCount={registrationData.horses?.length || 1}
      facilityData={registrationData.facilityInfo || {}}
    />
  );
};

// Export the wrapper component as default
export default RegisterPlanSelectionPage; 