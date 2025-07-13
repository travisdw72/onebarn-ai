import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  Alert,
  Paper,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';

import { brandConfig } from '../../config/brandConfig';
import { paymentConfig } from '../../config/paymentConfig';
import { shippingCalculator } from '../../config/shippingCalculator';
import { pricingCalculator } from '../../config/pricingCalculator';
import { getPackageContents, getHighlightedItems } from '../../config/packageContentsConfig';
import { registrationWorkflowConfig } from '../../config/registrationWorkflowConfig';
import { useNavigation } from '../../contexts/NavigationContext';
import { Header } from '../../components/layout/Header';
import {
  IRegisterPaymentProps,
  IPaymentFormData,
  IAddress,
  ICardInfo,
  IACHInfo,
  IOrderSummaryData
} from '../../interfaces/RegistrationTypes';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export const RegisterPayment: React.FC<IRegisterPaymentProps> = ({
  onNext,
  onBack,
  planSelectionData,
  horseCount,
  facilityData,
  initialData
}) => {
  const { navigateTo } = useNavigation();
  
  // Scroll to top when component mounts
  useScrollToTop();

  // Form state
  const [formData, setFormData] = useState<IPaymentFormData>({
    billingAddress: initialData?.billingAddress || {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    shippingAddress: initialData?.shippingAddress || {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    sameAsShipping: initialData?.sameAsShipping || false,
    paymentMethod: initialData?.paymentMethod || 'card',
    cardInfo: initialData?.cardInfo || {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    },
    achInfo: initialData?.achInfo || {
      routingNumber: '',
      accountNumber: '',
      nameOnAccount: ''
    },
    shippingMethod: initialData?.shippingMethod || 'standard',
    shippingCost: initialData?.shippingCost || 0,
    taxes: initialData?.taxes || 0,
    finalTotal: initialData?.finalTotal || 0,
    orderSummary: initialData?.orderSummary || {
      planName: '',
      planCost: 0,
      cameraCount: 0,
      cameraCost: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0
    }
  });

  // UI state
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shippingOptions, setShippingOptions] = useState<any>(null);

  // Get package contents for the selected plan first (this has our pricing truth)
  const packageContents = getPackageContents(planSelectionData.selectedPlan);
  const highlightedItems = getHighlightedItems(planSelectionData.selectedPlan);

  // Fallback pricing from package contents (ensures consistency)
  const getUnifiedPricing = () => {
    if (!packageContents) {
      return {
        planCost: 0,
        totalRetailValue: 0,
        yourPrice: 0,
        savings: 0
      };
    }

    // Extract numeric values from package contents
    const totalRetailValue = parseInt(packageContents.totalRetailValue.replace(/[^0-9]/g, ''));
    const yourPrice = parseInt(packageContents.yourPrice.replace(/[^0-9]/g, ''));
    const savings = parseInt(packageContents.savings.replace(/[^0-9]/g, ''));

    return {
      planCost: yourPrice,
      totalRetailValue,
      yourPrice,
      savings
    };
  };

  const unifiedPricing = getUnifiedPricing();

  // Try to get pricing breakdown from previous step, fallback to package contents
  let pricingBreakdown;
  try {
    pricingBreakdown = pricingCalculator.calculateTotal(
      planSelectionData.selectedPlan,
      horseCount,
      planSelectionData.cameras?.length || 0,
      planSelectionData.billingCycle,
      planSelectionData.selectedBundle || 'hardware',
      planSelectionData.referralCode,
      'purchase' // Default to purchase
    );
  } catch (error) {
    console.warn('Pricing calculator failed, using package contents pricing:', error);
    pricingBreakdown = {
      software: { currentPrice: unifiedPricing.planCost, savings: unifiedPricing.savings },
      hardware: { cameras: 0, installationCost: 0 },
      totals: { oneTimePayment: unifiedPricing.yourPrice },
      discounts: { referral: 0 }
    };
  }

  // Installation pricing tiers configuration
  const INSTALLATION_TIERS = {
    tier1: { maxCameras: 4, price: 199, label: '1-4 cameras: $199' },
    tier2: { maxCameras: 8, price: 299, label: '5-8 cameras: $299' },
    tier3: { maxCameras: Infinity, price: 399, label: '9+ cameras: $399' }
  };

  // Get total camera count from plan selection or plan defaults
  const totalCameraCount = planSelectionData.cameras?.length || 
                          registrationWorkflowConfig.plans[planSelectionData.selectedPlan]?.cameras?.included || 
                          0;

  // Calculate installation cost if professional installation is selected
  const getInstallationCost = () => {
    if (facilityData?.installationType === 'professional') {
      // Debug logging for troubleshooting
      console.log('Installation Pricing Debug:', {
        selectedPlan: planSelectionData.selectedPlan,
        totalCameraCount,
        explicitCameras: planSelectionData.cameras?.length,
        planDefaultCameras: registrationWorkflowConfig.plans[planSelectionData.selectedPlan]?.cameras?.included,
        installationType: facilityData?.installationType
      });

      // Tiered installation pricing based on camera count
      if (totalCameraCount <= INSTALLATION_TIERS.tier1.maxCameras) {
        console.log(`Using Tier 1: ${totalCameraCount} cameras <= ${INSTALLATION_TIERS.tier1.maxCameras} = $${INSTALLATION_TIERS.tier1.price}`);
        return INSTALLATION_TIERS.tier1.price;
      } else if (totalCameraCount <= INSTALLATION_TIERS.tier2.maxCameras) {
        console.log(`Using Tier 2: ${totalCameraCount} cameras <= ${INSTALLATION_TIERS.tier2.maxCameras} = $${INSTALLATION_TIERS.tier2.price}`);
        return INSTALLATION_TIERS.tier2.price;
      } else {
        console.log(`Using Tier 3: ${totalCameraCount} cameras > ${INSTALLATION_TIERS.tier2.maxCameras} = $${INSTALLATION_TIERS.tier3.price}`);
        return INSTALLATION_TIERS.tier3.price;
      }
    }
    return 0;
  };

  // Get current installation tier for display
  const getCurrentInstallationTier = () => {
    if (totalCameraCount <= INSTALLATION_TIERS.tier1.maxCameras) {
      return INSTALLATION_TIERS.tier1;
    } else if (totalCameraCount <= INSTALLATION_TIERS.tier2.maxCameras) {
      return INSTALLATION_TIERS.tier2;
    } else {
      return INSTALLATION_TIERS.tier3;
    }
  };

  const installationCost = getInstallationCost();

  // Calculate order summary with unified pricing
  const orderSummary: IOrderSummaryData = {
    planName: planSelectionData.selectedPlan,
    planCost: unifiedPricing.yourPrice, // Use package contents pricing
    billingCycle: planSelectionData.billingCycle || 'annual',
    cameraCount: totalCameraCount,
    cameraCost: 0, // Included in plan price
    installationCost: installationCost, // Professional installation cost
    subtotal: unifiedPricing.yourPrice + installationCost,
    shipping: formData.shippingCost,
    tax: formData.taxes,
    total: unifiedPricing.yourPrice + installationCost + formData.shippingCost + formData.taxes,
    savings: Math.min(50, unifiedPricing.yourPrice * 0.1), // Max 10% or $50
    referralDiscount: planSelectionData.referralCode ? 25 : 0 // $25 referral discount
  };

  // Utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format expiration date as user types (0226 -> 02/26)
  const formatExpirationDate = (value: string): string => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 4 digits maximum
    const limitedDigits = digitsOnly.substring(0, 4);
    
    // Add slash after 2nd digit
    if (limitedDigits.length >= 2) {
      return `${limitedDigits.substring(0, 2)}/${limitedDigits.substring(2)}`;
    }
    
    return limitedDigits;
  };

  const handleLogoClick = () => {
    navigateTo('home');
  };

  const handleHelpClick = () => {
    window.open('mailto:support@onebarn.ai?subject=Payment Help', '_blank');
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Shipping address validation
    if (!formData.shippingAddress.firstName.trim()) {
      newErrors.shippingFirstName = paymentConfig.content.validation.required;
    }
    if (!formData.shippingAddress.lastName.trim()) {
      newErrors.shippingLastName = paymentConfig.content.validation.required;
    }
    if (!formData.shippingAddress.address.trim()) {
      newErrors.shippingAddress = paymentConfig.content.validation.required;
    }
    if (!formData.shippingAddress.city.trim()) {
      newErrors.shippingCity = paymentConfig.content.validation.required;
    }
    if (!formData.shippingAddress.state) {
      newErrors.shippingState = paymentConfig.content.validation.required;
    }
    if (!formData.shippingAddress.zipCode.trim()) {
      newErrors.shippingZipCode = paymentConfig.content.validation.required;
    } else if (!shippingCalculator.validateZipCode(formData.shippingAddress.zipCode)) {
      newErrors.shippingZipCode = paymentConfig.content.validation.invalidZipCode;
    }

    // Billing address validation (if different from shipping)
    if (!formData.sameAsShipping) {
      if (!formData.billingAddress.firstName.trim()) {
        newErrors.billingFirstName = paymentConfig.content.validation.required;
      }
      if (!formData.billingAddress.lastName.trim()) {
        newErrors.billingLastName = paymentConfig.content.validation.required;
      }
      if (!formData.billingAddress.address.trim()) {
        newErrors.billingAddress = paymentConfig.content.validation.required;
      }
      if (!formData.billingAddress.city.trim()) {
        newErrors.billingCity = paymentConfig.content.validation.required;
      }
      if (!formData.billingAddress.state) {
        newErrors.billingState = paymentConfig.content.validation.required;
      }
      if (!formData.billingAddress.zipCode.trim()) {
        newErrors.billingZipCode = paymentConfig.content.validation.required;
      } else if (!shippingCalculator.validateZipCode(formData.billingAddress.zipCode)) {
        newErrors.billingZipCode = paymentConfig.content.validation.invalidZipCode;
      }
    }

    // Payment method validation
    if (formData.paymentMethod === 'card') {
      if (!formData.cardInfo?.cardNumber.trim()) {
        newErrors.cardNumber = paymentConfig.content.validation.required;
      } else if (!/^[0-9\s]{13,19}$/.test(formData.cardInfo.cardNumber)) {
        newErrors.cardNumber = paymentConfig.content.validation.invalidCardNumber;
      }
      
      if (!formData.cardInfo?.expiryDate.trim()) {
        newErrors.expiryDate = paymentConfig.content.validation.required;
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardInfo.expiryDate)) {
        newErrors.expiryDate = paymentConfig.content.validation.invalidExpiryDate;
      }
      
      if (!formData.cardInfo?.cvv.trim()) {
        newErrors.cvv = paymentConfig.content.validation.required;
      } else if (!/^\d{3,4}$/.test(formData.cardInfo.cvv)) {
        newErrors.cvv = paymentConfig.content.validation.invalidCvv;
      }
      
      if (!formData.cardInfo?.nameOnCard.trim()) {
        newErrors.nameOnCard = paymentConfig.content.validation.required;
      }
    } else if (formData.paymentMethod === 'ach') {
      if (!formData.achInfo?.routingNumber.trim()) {
        newErrors.routingNumber = paymentConfig.content.validation.required;
      } else if (!/^\d{9}$/.test(formData.achInfo.routingNumber)) {
        newErrors.routingNumber = paymentConfig.content.validation.invalidRoutingNumber;
      }
      
      if (!formData.achInfo?.accountNumber.trim()) {
        newErrors.accountNumber = paymentConfig.content.validation.required;
      } else if (!/^\d{4,20}$/.test(formData.achInfo.accountNumber)) {
        newErrors.accountNumber = paymentConfig.content.validation.invalidAccountNumber;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order completion
  const handleCompleteOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update billing address if same as shipping
      const finalFormData = {
        ...formData,
        billingAddress: formData.sameAsShipping ? formData.shippingAddress : formData.billingAddress,
        orderSummary: {
          planName: orderSummary.planName,
          planCost: orderSummary.planCost,
          cameraCount: orderSummary.cameraCount,
          cameraCost: orderSummary.cameraCost,
          subtotal: orderSummary.subtotal,
          shipping: formData.shippingCost,
          tax: formData.taxes,
          total: orderSummary.total
        }
      };

      // Save to localStorage
      localStorage.setItem('paymentData', JSON.stringify(finalFormData));

      // Call onNext to proceed to confirmation page
      onNext(finalFormData);

    } catch (error) {
      console.error('Payment processing error:', error);
      // Handle payment error here
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Calculate shipping when zip code changes
  useEffect(() => {
    if (formData.shippingAddress.zipCode && shippingCalculator.validateZipCode(formData.shippingAddress.zipCode)) {
      setIsCalculatingShipping(true);
      
      setTimeout(() => {
        const options = shippingCalculator.getAllShippingOptions(
          orderSummary.cameraCount,
          formData.shippingAddress.zipCode
        );
        setShippingOptions(options);
        
        // Set default shipping cost
        const defaultCost = options.standardCost;
        setFormData(prev => ({
          ...prev,
          shippingCost: defaultCost
        }));
        
        setIsCalculatingShipping(false);
      }, 1000);
    }
  }, [formData.shippingAddress.zipCode, orderSummary.cameraCount]);

  // Calculate taxes when shipping address changes
  useEffect(() => {
    if (formData.shippingAddress.zipCode && orderSummary.subtotal > 0) {
      const taxAmount = shippingCalculator.calculateTax(
        orderSummary.subtotal + formData.shippingCost,
        formData.shippingAddress.zipCode
      );
      setFormData(prev => ({
        ...prev,
        taxes: taxAmount
      }));
    }
  }, [formData.shippingAddress.zipCode, orderSummary.subtotal, formData.shippingCost]);

  // Update final total when costs change
  useEffect(() => {
    const finalTotal = orderSummary.subtotal + formData.shippingCost + formData.taxes;
    setFormData(prev => ({
      ...prev,
      finalTotal
    }));
  }, [orderSummary.subtotal, formData.shippingCost, formData.taxes]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('registerPaymentFormData', JSON.stringify(formData));
    }, 500); // Debounce to avoid excessive saves

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('registerPaymentFormData');
    if (savedData && !initialData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          // Reset sensitive payment info for security
          cardInfo: {
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            nameOnCard: parsed.cardInfo?.nameOnCard || ''
          },
          achInfo: {
            routingNumber: '',
            accountNumber: '',
            nameOnAccount: parsed.achInfo?.nameOnAccount || ''
          }
        }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [initialData]);

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
      <Box sx={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: `${brandConfig.spacing.xl} 0`,
        color: brandConfig.colors.arenaSand
      }}>
        <Container maxWidth="lg">
          <Typography sx={{
            fontFamily: brandConfig.typography.fontDisplay,
            fontSize: brandConfig.typography.fontSize3xl,
            fontWeight: brandConfig.typography.weightBold,
            marginBottom: brandConfig.spacing.md,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            {paymentConfig.content.pageTitle}
          </Typography>
          <Typography sx={{
            fontSize: brandConfig.typography.fontSizeLg,
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            {paymentConfig.content.pageSubtitle}
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{
        position: 'relative',
        zIndex: 10,
        paddingBottom: brandConfig.spacing.xxl
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Left Column - Payment Form */}
            <Grid item xs={12} lg={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.xl }}>
                
                {/* Order Summary (Collapsible) */}
                <Card sx={{
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.barnWhite,
                  boxShadow: brandConfig.layout.boxShadow,
                  display: { xs: 'block', lg: 'none' }
                }}>
                  <CardContent>
                    <Box 
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: brandConfig.spacing.md,
                        margin: `-${brandConfig.spacing.md}`,
                        borderRadius: brandConfig.layout.borderRadius,
                        '&:hover': {
                          backgroundColor: brandConfig.colors.surface
                        }
                      }}
                      onClick={() => setShowOrderSummary(!showOrderSummary)}
                    >
                      <Typography variant="h6" sx={{
                        fontWeight: brandConfig.typography.weightBold,
                        color: brandConfig.colors.stableMahogany
                      }}>
                        {paymentConfig.content.sections.orderSummary.title}
                      </Typography>
                      {showOrderSummary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Box>
                    
                    <Collapse in={showOrderSummary}>
                      <Box sx={{ paddingTop: brandConfig.spacing.md }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                          <Typography>{orderSummary.planName} Plan</Typography>
                          <Typography>{formatCurrency(orderSummary.planCost)}</Typography>
                        </Box>
                        {orderSummary.cameraCost > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                            <Typography>{orderSummary.cameraCount} Additional Cameras</Typography>
                            <Typography>{formatCurrency(orderSummary.cameraCost)}</Typography>
                          </Box>
                        )}
                        <Divider sx={{ margin: `${brandConfig.spacing.md} 0` }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                          <Typography>Total</Typography>
                          <Typography>{formatCurrency(orderSummary.total)}</Typography>
                        </Box>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card sx={{
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.barnWhite,
                  boxShadow: brandConfig.layout.boxShadow
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      marginBottom: brandConfig.spacing.sm
                    }}>
                      {paymentConfig.content.sections.shippingAddress.title}
                    </Typography>
                    <Typography sx={{
                      color: brandConfig.colors.textSecondary,
                      marginBottom: brandConfig.spacing.lg
                    }}>
                      {paymentConfig.content.sections.shippingAddress.subtitle}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label={paymentConfig.content.placeholders.firstName}
                          value={formData.shippingAddress.firstName}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, firstName: e.target.value }
                          }))}
                          error={!!errors.shippingFirstName}
                          helperText={errors.shippingFirstName}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label={paymentConfig.content.placeholders.lastName}
                          value={formData.shippingAddress.lastName}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, lastName: e.target.value }
                          }))}
                          error={!!errors.shippingLastName}
                          helperText={errors.shippingLastName}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={paymentConfig.content.placeholders.address}
                          value={formData.shippingAddress.address}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, address: e.target.value }
                          }))}
                          error={!!errors.shippingAddress}
                          helperText={errors.shippingAddress}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label={paymentConfig.content.placeholders.city}
                          value={formData.shippingAddress.city}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                          }))}
                          error={!!errors.shippingCity}
                          helperText={errors.shippingCity}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>{paymentConfig.content.placeholders.state}</InputLabel>
                          <Select
                            value={formData.shippingAddress.state}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              shippingAddress: { ...prev.shippingAddress, state: e.target.value }
                            }))}
                            error={!!errors.shippingState}
                          >
                            {paymentConfig.forms.addressFields.find(f => f.name === 'state')?.options?.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label={paymentConfig.content.placeholders.zipCode}
                          value={formData.shippingAddress.zipCode}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, zipCode: e.target.value }
                          }))}
                          error={!!errors.shippingZipCode}
                          helperText={errors.shippingZipCode}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                {(shippingOptions || isCalculatingShipping || formData.shippingAddress.zipCode.length >= 5) && (
                  <Card sx={{
                    borderRadius: brandConfig.layout.borderRadius,
                    backgroundColor: brandConfig.colors.barnWhite,
                    boxShadow: brandConfig.layout.boxShadow
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{
                        fontWeight: brandConfig.typography.weightBold,
                        color: brandConfig.colors.stableMahogany,
                        marginBottom: brandConfig.spacing.sm
                      }}>
                        {paymentConfig.content.sections.shippingMethod.title}
                      </Typography>
                      <Typography sx={{
                        color: brandConfig.colors.textSecondary,
                        marginBottom: brandConfig.spacing.lg
                      }}>
                        {paymentConfig.content.sections.shippingMethod.subtitle}
                      </Typography>

                      {isCalculatingShipping ? (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          padding: brandConfig.spacing.xl,
                          gap: brandConfig.spacing.md
                        }}>
                          <CircularProgress size={24} />
                          <Typography color="textSecondary">
                            {paymentConfig.content.sections.shippingMethod.calculatingText}
                          </Typography>
                        </Box>
                      ) : !shippingOptions ? (
                        <Box sx={{ 
                          padding: brandConfig.spacing.lg,
                          textAlign: 'center',
                          backgroundColor: brandConfig.colors.surface,
                          borderRadius: brandConfig.layout.borderRadius
                        }}>
                          <Typography color="textSecondary">
                            {paymentConfig.content.sections.shippingMethod.enterZipPrompt}
                          </Typography>
                        </Box>
                      ) : (
                        <RadioGroup
                          value={formData.shippingMethod}
                          onChange={(e) => {
                            const method = e.target.value as 'standard' | 'expedited' | 'overnight';
                            const cost = shippingOptions[`${method}Cost`];
                            setFormData(prev => ({
                              ...prev,
                              shippingMethod: method,
                              shippingCost: cost
                            }));
                          }}
                        >
                          {shippingCalculator.getShippingMethods().map(method => (
                            <Paper key={method.id} sx={{
                              padding: brandConfig.spacing.md,
                              marginBottom: brandConfig.spacing.md,
                              border: formData.shippingMethod === method.id 
                                ? `2px solid ${brandConfig.colors.championGold}`
                                : '1px solid rgba(0, 0, 0, 0.12)',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: brandConfig.colors.surface
                              }
                            }}>
                              <FormControlLabel
                                value={method.id}
                                control={<Radio />}
                                label={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <Box>
                                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        {method.icon} {method.name}
                                      </Typography>
                                      <Typography variant="body2" color="textSecondary">
                                        {method.description} • {method.estimatedDays}
                                      </Typography>
                                      {method.popularChoice && (
                                        <Chip 
                                          label="Most Popular" 
                                          size="small" 
                                          sx={{ 
                                            marginTop: brandConfig.spacing.xs,
                                            backgroundColor: brandConfig.colors.championGold,
                                            color: brandConfig.colors.midnightBlack,
                                            fontSize: '0.7em'
                                          }} 
                                        />
                                      )}
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                      {shippingCalculator.formatCurrency(shippingOptions[`${method.id}Cost`])}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ margin: 0, width: '100%' }}
                              />
                            </Paper>
                          ))}
                        </RadioGroup>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Billing Address */}
                <Card sx={{
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.barnWhite,
                  boxShadow: brandConfig.layout.boxShadow
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      marginBottom: brandConfig.spacing.sm
                    }}>
                      {paymentConfig.content.sections.billingAddress.title}
                    </Typography>
                    <Typography sx={{
                      color: brandConfig.colors.textSecondary,
                      marginBottom: brandConfig.spacing.lg
                    }}>
                      {paymentConfig.content.sections.billingAddress.subtitle}
                    </Typography>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.sameAsShipping}
                          onChange={(e) => {
                            const sameAsShipping = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              sameAsShipping,
                              billingAddress: sameAsShipping ? { ...prev.shippingAddress } : prev.billingAddress
                            }));
                          }}
                        />
                      }
                      label={paymentConfig.content.sections.billingAddress.sameAsShippingLabel}
                      sx={{ marginBottom: brandConfig.spacing.md }}
                    />

                    <Collapse in={!formData.sameAsShipping}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.firstName}
                            value={formData.billingAddress.firstName}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              billingAddress: { ...prev.billingAddress, firstName: e.target.value }
                            }))}
                            error={!!errors.billingFirstName}
                            helperText={errors.billingFirstName}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.lastName}
                            value={formData.billingAddress.lastName}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              billingAddress: { ...prev.billingAddress, lastName: e.target.value }
                            }))}
                            error={!!errors.billingLastName}
                            helperText={errors.billingLastName}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.address}
                            value={formData.billingAddress.address}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              billingAddress: { ...prev.billingAddress, address: e.target.value }
                            }))}
                            error={!!errors.billingAddress}
                            helperText={errors.billingAddress}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.city}
                            value={formData.billingAddress.city}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              billingAddress: { ...prev.billingAddress, city: e.target.value }
                            }))}
                            error={!!errors.billingCity}
                            helperText={errors.billingCity}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl fullWidth>
                            <InputLabel>{paymentConfig.content.placeholders.state}</InputLabel>
                            <Select
                              value={formData.billingAddress.state}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                billingAddress: { ...prev.billingAddress, state: e.target.value }
                              }))}
                              error={!!errors.billingState}
                            >
                              {paymentConfig.forms.addressFields.find(f => f.name === 'state')?.options?.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.zipCode}
                            value={formData.billingAddress.zipCode}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                            }))}
                            error={!!errors.billingZipCode}
                            helperText={errors.billingZipCode}
                          />
                        </Grid>
                      </Grid>
                    </Collapse>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card sx={{
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.barnWhite,
                  boxShadow: brandConfig.layout.boxShadow
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      marginBottom: brandConfig.spacing.sm
                    }}>
                      {paymentConfig.content.sections.paymentMethod.title}
                    </Typography>
                    <Typography sx={{
                      color: brandConfig.colors.textSecondary,
                      marginBottom: brandConfig.spacing.lg
                    }}>
                      {paymentConfig.content.sections.paymentMethod.subtitle}
                    </Typography>

                    <RadioGroup
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        paymentMethod: e.target.value as 'card' | 'ach'
                      }))}
                      sx={{ marginBottom: brandConfig.spacing.lg }}
                    >
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
                            <CreditCardIcon />
                            <Typography>{paymentConfig.content.sections.paymentMethod.creditCardLabel}</Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="ach"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
                            <AccountBalanceIcon />
                            <Typography>{paymentConfig.content.sections.paymentMethod.achLabel}</Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>

                    {/* Credit Card Fields */}
                    <Collapse in={formData.paymentMethod === 'card'}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.cardNumber}
                            value={formData.cardInfo?.cardNumber || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              cardInfo: { ...prev.cardInfo!, cardNumber: e.target.value }
                            }))}
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.expiryDate}
                            placeholder="MM/YY"
                            value={formData.cardInfo?.expiryDate || ''}
                            onChange={(e) => {
                              const formattedValue = formatExpirationDate(e.target.value);
                              setFormData(prev => ({
                                ...prev,
                                cardInfo: { ...prev.cardInfo!, expiryDate: formattedValue }
                              }));
                            }}
                            error={!!errors.expiryDate}
                            helperText={errors.expiryDate}
                            inputProps={{
                              maxLength: 5, // MM/YY format
                              inputMode: 'numeric'
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.cvv}
                            value={formData.cardInfo?.cvv || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              cardInfo: { ...prev.cardInfo!, cvv: e.target.value }
                            }))}
                            error={!!errors.cvv}
                            helperText={errors.cvv}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.nameOnCard}
                            value={formData.cardInfo?.nameOnCard || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              cardInfo: { ...prev.cardInfo!, nameOnCard: e.target.value }
                            }))}
                            error={!!errors.nameOnCard}
                            helperText={errors.nameOnCard}
                          />
                        </Grid>
                      </Grid>
                    </Collapse>

                    {/* ACH Fields */}
                    <Collapse in={formData.paymentMethod === 'ach'}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.routingNumber}
                            value={formData.achInfo?.routingNumber || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              achInfo: { ...prev.achInfo!, routingNumber: e.target.value }
                            }))}
                            error={!!errors.routingNumber}
                            helperText={errors.routingNumber}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label={paymentConfig.content.placeholders.accountNumber}
                            value={formData.achInfo?.accountNumber || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              achInfo: { ...prev.achInfo!, accountNumber: e.target.value }
                            }))}
                            error={!!errors.accountNumber}
                            helperText={errors.accountNumber}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Name on Account"
                            value={formData.achInfo?.nameOnAccount || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              achInfo: { ...prev.achInfo!, nameOnAccount: e.target.value }
                            }))}
                          />
                        </Grid>
                      </Grid>
                    </Collapse>

                    <Alert severity="info" sx={{ marginTop: brandConfig.spacing.md }}>
                      <SecurityIcon sx={{ marginRight: brandConfig.spacing.sm }} />
                      {paymentConfig.content.sections.paymentMethod.securityNotice}
                    </Alert>
                  </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: brandConfig.spacing.xl
                }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={onBack}
                    sx={{
                      borderColor: brandConfig.colors.stableMahogany,
                      color: brandConfig.colors.stableMahogany,
                      padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
                      '&:hover': {
                        borderColor: brandConfig.colors.stableMahoganyDark,
                        backgroundColor: brandConfig.colors.stableMahogany + '10'
                      }
                    }}
                  >
                    {paymentConfig.content.buttons.backToPlan}
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCompleteOrder}
                    disabled={isProcessingOrder}
                    sx={{
                      backgroundColor: brandConfig.colors.championGold,
                      color: brandConfig.colors.midnightBlack,
                      padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
                      fontWeight: brandConfig.typography.weightBold,
                      '&:hover': {
                        backgroundColor: brandConfig.colors.championGold + 'DD'
                      }
                    }}
                  >
                    {isProcessingOrder ? (
                      <>
                        <CircularProgress size={20} sx={{ marginRight: brandConfig.spacing.sm }} />
                        {paymentConfig.content.buttons.processingOrder}
                      </>
                    ) : (
                      paymentConfig.content.buttons.completeOrder
                    )}
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: brandConfig.spacing.xl }}>
                {/* Order Summary Card */}
                <Card sx={{
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.barnWhite,
                  boxShadow: brandConfig.layout.boxShadow,
                  marginBottom: brandConfig.spacing.lg
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      marginBottom: brandConfig.spacing.lg
                    }}>
                      {paymentConfig.content.sections.orderTotal.title}
                    </Typography>

                    {/* Plan Details */}
                    <Box sx={{ marginBottom: brandConfig.spacing.lg }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {orderSummary.planName.charAt(0).toUpperCase() + orderSummary.planName.slice(1)} Plan
                          <Typography component="span" sx={{ 
                            fontSize: '0.8em', 
                            color: brandConfig.colors.textSecondary,
                            marginLeft: brandConfig.spacing.sm
                          }}>
                            {' '}(Monthly subscription)
                          </Typography>
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(orderSummary.planCost)}
                        </Typography>
                      </Box>

                      {orderSummary.installationCost > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.textSecondary }}>
                            Professional Installation ({orderSummary.cameraCount} camera{orderSummary.cameraCount > 1 ? 's' : ''})
                            <Typography component="span" sx={{ 
                              fontSize: '0.75em', 
                              color: brandConfig.colors.textSecondary,
                              marginLeft: '4px'
                            }}>
                              ({getCurrentInstallationTier().label})
                            </Typography>
                          </Typography>
                          <Typography variant="body2">
                            {formatCurrency(orderSummary.installationCost)}
                          </Typography>
                        </Box>
                      )}

                      {orderSummary.savings && orderSummary.savings > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.successGreen }}>
                            Bundle Savings
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.successGreen }}>
                            -{formatCurrency(orderSummary.savings)}
                          </Typography>
                        </Box>
                      )}

                      {orderSummary.referralDiscount && orderSummary.referralDiscount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.successGreen }}>
                            Referral Discount
                          </Typography>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.successGreen }}>
                            -{formatCurrency(orderSummary.referralDiscount)}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ marginBottom: brandConfig.spacing.lg }} />

                    {/* Order Totals */}
                    <Box sx={{ marginBottom: brandConfig.spacing.lg }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                        <Typography variant="body2">
                          {paymentConfig.content.sections.orderTotal.subtotalLabel}
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(orderSummary.subtotal)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                        <Typography variant="body2">
                          {paymentConfig.content.sections.orderTotal.shippingLabel}
                        </Typography>
                        <Typography variant="body2">
                          {isCalculatingShipping ? (
                            <CircularProgress size={12} />
                          ) : (
                            formData.shippingCost > 0 ? formatCurrency(formData.shippingCost) : 'Calculated at checkout'
                          )}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
                        <Typography variant="body2">
                          {paymentConfig.content.sections.orderTotal.taxLabel}
                        </Typography>
                        <Typography variant="body2">
                          {formData.taxes > 0 ? formatCurrency(formData.taxes) : 'Calculated at checkout'}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ marginBottom: brandConfig.spacing.lg }} />

                    {/* Final Total */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: brandConfig.spacing.lg }}>
                      <Typography variant="h6" sx={{ fontWeight: brandConfig.typography.weightBold }}>
                        {paymentConfig.content.sections.orderTotal.totalLabel}
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        fontWeight: brandConfig.typography.weightBold,
                        color: brandConfig.colors.stableMahogany
                      }}>
                        {formatCurrency(orderSummary.total)}
                      </Typography>
                    </Box>

                    {/* Disclaimer */}
                    <Typography variant="caption" sx={{ 
                      color: brandConfig.colors.textSecondary,
                      fontStyle: 'italic',
                      display: 'block',
                      marginTop: brandConfig.spacing.md
                    }}>
                      {installationCost > 0 
                        ? `Professional installation scheduling will be coordinated after payment. Installation pricing: 1-4 cameras ($199), 5-8 cameras ($299), 9+ cameras ($399).`
                        : paymentConfig.content.sections.orderTotal.disclaimerText}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Package Contents */}
                {packageContents && (
                  <Card sx={{
                    borderRadius: brandConfig.layout.borderRadius,
                    backgroundColor: brandConfig.colors.barnWhite,
                    boxShadow: brandConfig.layout.boxShadow,
                    marginBottom: brandConfig.spacing.lg
                  }}>
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: brandConfig.spacing.md,
                        cursor: 'pointer'
                      }}
                      onClick={() => setShowPackageDetails(!showPackageDetails)}
                      >
                        <Box>
                          <Typography variant="h6" sx={{
                            fontWeight: brandConfig.typography.weightBold,
                            color: brandConfig.colors.stableMahogany,
                            marginBottom: '4px'
                          }}>
                            {paymentConfig.content.sections.packageContents.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: brandConfig.colors.textSecondary,
                            fontSize: '0.9em'
                          }}>
                            {paymentConfig.content.sections.packageContents.subtitle}
                          </Typography>
                        </Box>
                        {showPackageDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Box>

                      {/* Package Value Summary */}
                      <Box sx={{ 
                        backgroundColor: brandConfig.colors.surface,
                        padding: brandConfig.spacing.md,
                        borderRadius: brandConfig.layout.borderRadius,
                        marginBottom: brandConfig.spacing.md
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.textSecondary }}>
                            Total Retail Value:
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            textDecoration: 'line-through',
                            color: brandConfig.colors.textSecondary 
                          }}>
                            {packageContents.totalRetailValue}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: brandConfig.typography.weightBold }}>
                            Your Price:
                          </Typography>
                          <Typography variant="h6" sx={{ 
                            fontWeight: brandConfig.typography.weightBold,
                            color: brandConfig.colors.stableMahogany
                          }}>
                            {packageContents.yourPrice}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: brandConfig.colors.successGreen }}>
                            You Save:
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: brandConfig.colors.successGreen,
                            fontWeight: 'medium'
                          }}>
                            {packageContents.savings}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Highlighted Items Preview */}
                      <Box sx={{ marginBottom: brandConfig.spacing.md }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'medium',
                          marginBottom: brandConfig.spacing.sm,
                          color: brandConfig.colors.stableMahogany
                        }}>
                          Key Features:
                        </Typography>
                        {highlightedItems.slice(0, 3).map(item => (
                          <Box key={item.id} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: brandConfig.spacing.sm,
                            marginBottom: brandConfig.spacing.xs
                          }}>
                            <Typography sx={{ fontSize: '1em' }}>{item.icon}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.9em' }}>
                              {item.quantity && item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                            </Typography>
                          </Box>
                        ))}
                        {highlightedItems.length > 3 && (
                          <Typography variant="caption" sx={{ 
                            color: brandConfig.colors.textSecondary,
                            fontStyle: 'italic' 
                          }}>
                            + {highlightedItems.length - 3} more premium features
                          </Typography>
                        )}
                      </Box>

                      {/* Detailed Package Contents */}
                      <Collapse in={showPackageDetails}>
                        <Box sx={{ paddingTop: brandConfig.spacing.md }}>
                          {packageContents.sections.map(section => (
                            <Box key={section.id} sx={{ marginBottom: brandConfig.spacing.lg }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: brandConfig.spacing.sm,
                                marginBottom: brandConfig.spacing.md
                              }}>
                                <Typography sx={{ fontSize: '1.5em' }}>{section.icon}</Typography>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: brandConfig.typography.weightBold,
                                  color: brandConfig.colors.stableMahogany
                                }}>
                                  {section.title}
                                </Typography>
                                {section.totalValue && (
                                  <Chip
                                    label={section.totalValue}
                                    size="small"
                                    sx={{
                                      backgroundColor: brandConfig.colors.championGold,
                                      color: brandConfig.colors.midnightBlack,
                                      fontWeight: 'medium',
                                      marginLeft: 'auto'
                                    }}
                                  />
                                )}
                              </Box>
                              
                              <Box sx={{ paddingLeft: brandConfig.spacing.lg }}>
                                {section.items.map(item => (
                                  <Box key={item.id} sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: brandConfig.spacing.sm,
                                    padding: brandConfig.spacing.sm,
                                    backgroundColor: item.isHighlight ? brandConfig.colors.surface : 'transparent',
                                    borderRadius: brandConfig.layout.borderRadius,
                                    border: item.isHighlight ? `1px solid ${brandConfig.colors.championGold}` : 'none'
                                  }}>
                                    <Box sx={{ flex: 1 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
                                        <Typography sx={{ fontSize: '1em' }}>{item.icon}</Typography>
                                        <Typography variant="body2" sx={{ 
                                          fontWeight: item.isHighlight ? 'medium' : 'normal'
                                        }}>
                                          {item.quantity && item.quantity > 1 ? `${item.quantity}x ` : ''}{item.name}
                                        </Typography>
                                        {item.isHighlight && (
                                          <Chip
                                            label="Premium"
                                            size="small"
                                            sx={{
                                              backgroundColor: brandConfig.colors.championGold,
                                              color: brandConfig.colors.midnightBlack,
                                              fontSize: '0.7em',
                                              height: '20px'
                                            }}
                                          />
                                        )}
                                      </Box>
                                      <Typography variant="caption" sx={{ 
                                        color: brandConfig.colors.textSecondary,
                                        display: 'block',
                                        marginTop: '2px',
                                        marginLeft: '28px'
                                      }}>
                                        {item.description}
                                      </Typography>
                                    </Box>
                                    {item.value && (
                                      <Typography variant="body2" sx={{ 
                                        fontWeight: 'medium',
                                        color: brandConfig.colors.stableMahogany,
                                        marginLeft: brandConfig.spacing.md
                                      }}>
                                        {item.value}
                                      </Typography>
                                    )}
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>

                      {/* View Details Button */}
                      <Button
                        onClick={() => setShowPackageDetails(!showPackageDetails)}
                        sx={{
                          width: '100%',
                          marginTop: brandConfig.spacing.md,
                          color: brandConfig.colors.stableMahogany,
                          border: `1px solid ${brandConfig.colors.stableMahogany}`,
                          '&:hover': {
                            backgroundColor: brandConfig.colors.surface
                          }
                        }}
                      >
                        {showPackageDetails 
                          ? paymentConfig.content.sections.packageContents.hideDetailsText
                          : paymentConfig.content.sections.packageContents.viewDetailsText
                        }
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Security Badges */}
                <Card sx={{
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.barnWhite,
                  boxShadow: brandConfig.layout.boxShadow,
                  marginBottom: brandConfig.spacing.lg
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      marginBottom: brandConfig.spacing.md,
                      textAlign: 'center'
                    }}>
                      Secure Checkout
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.sm }}>
                      {paymentConfig.security.badges.map(badge => (
                        <Box key={badge.id} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: brandConfig.spacing.sm,
                          padding: brandConfig.spacing.sm,
                          backgroundColor: brandConfig.colors.surface,
                          borderRadius: brandConfig.layout.borderRadius
                        }}>
                          <Typography sx={{ fontSize: '1.2em' }}>{badge.icon}</Typography>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {badge.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: brandConfig.colors.textSecondary }}>
                              {badge.description}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Customer Guarantees */}
                <Card sx={{
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.barnWhite,
                  boxShadow: brandConfig.layout.boxShadow,
                  marginBottom: brandConfig.spacing.lg
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      marginBottom: brandConfig.spacing.md,
                      textAlign: 'center'
                    }}>
                      Our Guarantee
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
                      {paymentConfig.security.guarantees.map(guarantee => (
                        <Box key={guarantee.id} sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: brandConfig.spacing.sm 
                        }}>
                          <Typography sx={{ fontSize: '1.2em', marginTop: '2px' }}>
                            {guarantee.icon}
                          </Typography>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium', marginBottom: '2px' }}>
                              {guarantee.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: brandConfig.colors.textSecondary }}>
                              {guarantee.description}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Customer Testimonial */}
                <Card sx={{
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.stableMahogany,
                  color: brandConfig.colors.arenaSand,
                  marginBottom: brandConfig.spacing.lg
                }}>
                  <CardContent>
                    <Typography variant="body2" sx={{
                      fontStyle: 'italic',
                      marginBottom: brandConfig.spacing.md,
                      lineHeight: 1.6
                    }}>
                      "{paymentConfig.testimonial.quote}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: brandConfig.colors.championGold,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: brandConfig.colors.midnightBlack,
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>
                        {paymentConfig.testimonial.author.charAt(0)}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {paymentConfig.testimonial.author}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {paymentConfig.testimonial.title} • {paymentConfig.testimonial.location}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}; 

// Create a wrapper component for routing
const RegisterPaymentPage: React.FC = () => {
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

  const handleNext = (data: IPaymentFormData) => {
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    localStorage.setItem('registrationData', JSON.stringify({
      ...existingData,
      paymentInfo: data,
      currentStep: 'confirmation'
    }));
    
    navigateTo('register-confirmation');
  };

  const handleBack = () => {
    navigateTo('register-plans');
  };

  if (!registrationData) {
    return <div>Loading...</div>;
  }

  return (
    <RegisterPayment
      onNext={handleNext}
      onBack={handleBack}
      planSelectionData={registrationData.selectedPlan || {}}
      horseCount={registrationData.horses?.length || 1}
      facilityData={registrationData.facilityInfo || {}}
      initialData={registrationData.paymentInfo}
    />
  );
};

// Export the wrapper component as default
export default RegisterPaymentPage; 