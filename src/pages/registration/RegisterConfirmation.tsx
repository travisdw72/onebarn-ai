import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import CameraIcon from '@mui/icons-material/Camera';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';

import { brandConfig } from '../../config/brandConfig';
import { paymentConfig } from '../../config/paymentConfig';
import { registrationWorkflowConfig } from '../../config/registrationWorkflowConfig';
import { RegistrationLayout } from '../../components/registration/RegistrationLayout';
import { useNavigation } from '../../contexts/NavigationContext';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const RegisterConfirmation: React.FC = () => {
  const { navigateTo } = useNavigation();
  
  // Scroll to top when component mounts
  useScrollToTop();
  
  const [isLoading, setIsLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = localStorage.getItem('registrationData');
        const parsedData = storedData ? JSON.parse(storedData) : {};
        setRegistrationData(parsedData);
        setOrderNumber(`OB-${Date.now().toString().slice(-6)}`);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading registration data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.surface,
      padding: brandConfig.spacing.xl
    },
    successIcon: {
      fontSize: '4rem',
      color: brandConfig.colors.pastureSage,
      marginBottom: brandConfig.spacing.lg
    },
    orderNumber: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.md
    },
    summaryCard: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: '16px',
      padding: brandConfig.spacing.xl,
      marginBottom: brandConfig.spacing.xl,
      border: `1px solid ${brandConfig.colors.neutralGray}20`
    },
    sectionTitle: {
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.lg
    },
    actionButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
      borderRadius: '12px',
      marginRight: brandConfig.spacing.md,
      '&:hover': {
        backgroundColor: brandConfig.colors.stableMahoganyDark || brandConfig.colors.stableMahogany,
        transform: 'translateY(-2px)'
      }
    },
    secondaryButton: {
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      color: brandConfig.colors.stableMahogany,
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
      borderRadius: '12px',
      marginRight: brandConfig.spacing.md,
      '&:hover': {
        backgroundColor: `${brandConfig.colors.stableMahogany}10`,
        transform: 'translateY(-2px)'
      }
    }
  };

  if (isLoading) {
    return (
      <RegistrationLayout
        currentStep={6}
        totalSteps={5}
        stepTitle="Processing Your Order"
        stepDescription="Please wait while we complete your registration..."
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <CircularProgress 
            size={60} 
            sx={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.xl }}
          />
          <Typography variant="h6" sx={{ color: brandConfig.colors.neutralGray }}>
            Processing your registration...
          </Typography>
        </Box>
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout
      currentStep={6}
      totalSteps={5}
      stepTitle="Registration Complete!"
      stepDescription="Your One Barn AI system has been successfully ordered"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', marginBottom: brandConfig.spacing.xxl }}>
          <CheckCircleIcon sx={styles.successIcon} />
          <Typography variant="h3" sx={styles.orderNumber}>
            Order #{orderNumber}
          </Typography>
          <Typography variant="h6" sx={{ color: brandConfig.colors.neutralGray }}>
            Thank you for choosing One Barn AI!
          </Typography>
        </Box>

        {/* Order Summary */}
        <Card sx={styles.summaryCard}>
          <Typography variant="h5" sx={styles.sectionTitle}>
            Order Summary
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>Plan:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight="bold">
                {registrationData?.selectedPlan?.selectedPlan || 'N/A'} Plan
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography>Horses Registered:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight="bold">
                {registrationData?.horses?.length || 0}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography>Installation Type:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography fontWeight="bold">
                {registrationData?.facilityInfo?.installationType === 'professional' ? 'Professional Installation' : 'Self Installation'}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="h6" fontWeight="bold">Total Amount:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" fontWeight="bold" color={brandConfig.colors.stableMahogany}>
                {formatCurrency(registrationData?.paymentInfo?.finalTotal || 0)}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* Next Steps */}
        <Card sx={styles.summaryCard}>
          <Typography variant="h5" sx={styles.sectionTitle}>
            What Happens Next
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon sx={{ color: brandConfig.colors.stableMahogany }} />
              </ListItemIcon>
              <ListItemText 
                primary="Confirmation Email" 
                secondary="Check your email for order confirmation and setup instructions"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <LocalShippingIcon sx={{ color: brandConfig.colors.stableMahogany }} />
              </ListItemIcon>
              <ListItemText 
                primary="Equipment Shipping" 
                secondary="Your equipment will arrive within 5-7 business days"
              />
            </ListItem>
            
            {registrationData?.facilityInfo?.installationType === 'professional' && (
              <ListItem>
                <ListItemIcon>
                  <HomeIcon sx={{ color: brandConfig.colors.stableMahogany }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Professional Installation" 
                  secondary="Our team will contact you to schedule installation"
                />
              </ListItem>
            )}
            
            <ListItem>
              <ListItemIcon>
                <SecurityIcon sx={{ color: brandConfig.colors.stableMahogany }} />
              </ListItemIcon>
              <ListItemText 
                primary="Account Setup" 
                secondary="Create your dashboard account and download mobile app"
              />
            </ListItem>
          </List>
        </Card>

        {/* Support Information */}
        <Card sx={styles.summaryCard}>
          <Typography variant="h5" sx={styles.sectionTitle}>
            Support Information
          </Typography>
          
          <Alert severity="info" sx={{ marginBottom: brandConfig.spacing.md }}>
            <strong>24/7 Support:</strong> 1-800-ONE-BARN
          </Alert>
          
          <Alert severity="success">
            <strong>Account Manager:</strong> Your dedicated account manager will contact you within 24 hours
          </Alert>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: brandConfig.spacing.md,
          justifyContent: 'center',
          marginTop: brandConfig.spacing.xxl 
        }}>
          <Button
            variant="contained"
            sx={styles.actionButton}
            onClick={() => navigateTo('client-dashboard')}
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="outlined"
            sx={styles.secondaryButton}
            onClick={() => window.print()}
          >
            <PrintIcon sx={{ marginRight: brandConfig.spacing.sm }} />
            Print Receipt
          </Button>
          
          <Button
            variant="outlined"
            sx={styles.secondaryButton}
            onClick={() => {
              const data = {
                orderNumber,
                date: new Date().toLocaleDateString(),
                total: registrationData?.paymentInfo?.finalTotal || 0
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `OneBarn_Receipt_${orderNumber}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <DownloadIcon sx={{ marginRight: brandConfig.spacing.sm }} />
            Download Receipt
          </Button>
        </Box>
      </motion.div>
    </RegistrationLayout>
  );
};

export default RegisterConfirmation; 