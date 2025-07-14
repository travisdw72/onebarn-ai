import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Stack,
  Paper,
  Tooltip,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Send, 
  Calendar,
  Users,
  Building,
  Zap,
  Shield,
  HeartHandshake,
  ExternalLink,
  ChevronDown,
  MessageSquare,
  Star,
  User,
  Hash,
  FileText,
  Sparkles,
  Target,
  Globe,
  Headphones,
  Award,
  ArrowRight,
  PhoneCall,
  MailOpen,
  MapPin as LocationIcon,
  Clock as TimeIcon,
  AlertCircle
} from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { contactConfig } from '../config/contactConfig';
import { Header } from '../components/layout/Header';
import { contactService } from '../services/contactService';

interface IFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  facilityName: string;
  numberOfHorses: string;
  inquiryType: string;
  subject: string;
  message: string;
}

interface IFormErrors {
  [key: string]: string;
}

interface IFormSubmissionResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export const Contact: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState<IFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    facilityName: '',
    numberOfHorses: '',
    inquiryType: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState<IFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<IFormSubmissionResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Form validation
  const validateField = (name: string, value: string): string => {
    const field = contactConfig.form_fields[name as keyof typeof contactConfig.form_fields];
    
    if (field?.required && !value.trim()) {
      return `${field.label} is required`;
    }
    
    if (name === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if (name === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\D/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }
    
    return '';
  };
  
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const validateForm = (): boolean => {
    const errors: IFormErrors = {};
    let isValid = true;
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Form submission to localhost
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Use our contact service which integrates with existing auth infrastructure
      const result = await contactService.submitContactForm(formData);
      
      if (result.success) {
        setSubmissionResult({
          success: true,
          message: result.message,
          timestamp: result.timestamp
        });
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          facilityName: '',
          numberOfHorses: '',
          inquiryType: '',
          subject: '',
          message: ''
        });
        setFormErrors({});
        
        // Show success message with ticket ID if available
        if (result.ticketId) {
          console.log('✅ Contact form submitted successfully!', {
            ticketId: result.ticketId,
            email: formData.email,
            timestamp: result.timestamp
          });
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: 'There was an error submitting your message. Please try again or contact us directly at support@onebarnai.com.',
        timestamp: new Date().toISOString()
      });
      setShowSuccess(true); // Still show the snackbar for error message
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if support is currently available
  const isSupportAvailable = (): boolean => {
    const now = currentTime;
    const day = now.getDay();
    const hour = now.getHours();
    
    // Weekend hours: 8 AM - 6 PM
    if (day === 0 || day === 6) {
      return hour >= 8 && hour < 18;
    }
    
    // Weekday hours: 7 AM - 9 PM
    return hour >= 7 && hour < 21;
  };
  
  // Filter FAQ items based on search
  const filteredFaqs = contactConfig.faq_items.filter(item =>
    item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    item.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );
  
  // Get icon for contact type
  const getContactIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'General Information': <MessageSquare size={20} />,
      'Pricing & Plans': <Star size={20} />,
      'Technical Support': <Headphones size={20} />,
      'Installation Consultation': <Building size={20} />,
      'Emergency System Issue': <AlertTriangle size={20} />,
      'Partnership Inquiry': <HeartHandshake size={20} />,
    };
    return iconMap[type] || <MessageSquare size={20} />;
  };
  
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandConfig.colors.background }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: brandConfig.colors.midnightBlack,
          color: brandConfig.colors.arenaSand,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(135deg, rgba(107, 58, 44, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%), url(${contactConfig.img_hero_background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    color: brandConfig.colors.championGold,
                  }}
                >
                  {contactConfig.txt_hero_headline}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1.3rem', md: '1.8rem' },
                    fontWeight: brandConfig.typography.weightMedium,
                    mb: 4,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    color: brandConfig.colors.arenaSand,
                  }}
                >
                  {contactConfig.txt_hero_subheading}
                </Typography>
                
                {/* Quick Action Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    href={`tel:${contactConfig.txt_phone}`}
                    startIcon={<PhoneCall />}
                    sx={{
                      backgroundColor: brandConfig.colors.championGold,
                      color: brandConfig.colors.midnightBlack,
                      fontWeight: brandConfig.typography.weightBold,
                      px: 3,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: brandConfig.colors.championGold,
                        opacity: 0.9,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Call Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href={`mailto:${contactConfig.txt_email}`}
                    startIcon={<MailOpen />}
                    sx={{
                      color: brandConfig.colors.arenaSand,
                      borderColor: brandConfig.colors.arenaSand,
                      px: 3,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: `${brandConfig.colors.arenaSand}20`,
                        borderColor: brandConfig.colors.arenaSand,
                      },
                    }}
                  >
                    Email Us
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${brandConfig.colors.championGold}20 0%, ${brandConfig.colors.stableMahogany}20 100%)`,
                    borderRadius: '20px',
                    border: `2px solid ${brandConfig.colors.championGold}40`,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: `${brandConfig.colors.championGold}30`,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Headphones size={40} color={brandConfig.colors.championGold} />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeXl,
                        fontWeight: brandConfig.typography.weightBold,
                        color: brandConfig.colors.arenaSand,
                        mb: 1,
                      }}
                    >
                      24/7 Emergency Support
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeBase,
                        color: brandConfig.colors.arenaSand,
                        mb: 2,
                      }}
                    >
                      Critical system issues: Under 15 min response
                    </Typography>
                    <Button
                      variant="contained"
                      href={`tel:${contactConfig.txt_emergency_phone}`}
                      sx={{
                        backgroundColor: brandConfig.colors.victoryRose,
                        color: brandConfig.colors.arenaSand,
                        '&:hover': {
                          backgroundColor: brandConfig.colors.victoryRose,
                          opacity: 0.9,
                        },
                      }}
                    >
                      {contactConfig.txt_emergency_phone}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Support Status Banner */}
      <Box
        sx={{
          backgroundColor: isSupportAvailable() ? brandConfig.colors.successGreen : brandConfig.colors.alertAmber,
          color: brandConfig.colors.arenaSand,
          py: 1,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontSize: brandConfig.typography.fontSizeBase,
              fontWeight: brandConfig.typography.weightMedium,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Clock size={18} />
            Support Status: {isSupportAvailable() ? 'Available Now' : 'Currently Closed'}
            {!isSupportAvailable() && ' - Emergency support still available 24/7'}
          </Typography>
        </Container>
      </Box>

      {/* SubHero Section */}
      <Box sx={{ py: 8, backgroundColor: brandConfig.colors.surface }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    color: brandConfig.colors.stableMahogany,
                    mb: 3,
                    textTransform: 'uppercase',
                  }}
                >
                  {contactConfig.txt_subhero_headline}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.3rem',
                    fontWeight: brandConfig.typography.weightMedium,
                    color: brandConfig.colors.hunterGreen,
                    mb: 3,
                  }}
                >
                  {contactConfig.txt_subhero_subheading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    color: brandConfig.colors.textSecondary,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    mb: 3,
                  }}
                >
                  {contactConfig.txt_subhero_description}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    color: brandConfig.colors.textSecondary,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                  }}
                >
                  {contactConfig.txt_subhero_description2}
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card
                  sx={{
                    background: brandConfig.gradients.statusCard,
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeXl,
                        fontWeight: brandConfig.typography.weightBold,
                        color: brandConfig.colors.stableMahogany,
                        mb: 3,
                        textAlign: 'center',
                      }}
                    >
                      Quick Contact
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Phone size={20} color={brandConfig.colors.championGold} />
                        <Link
                          href={`tel:${contactConfig.txt_phone}`}
                          sx={{
                            color: brandConfig.colors.stableMahogany,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {contactConfig.txt_phone}
                        </Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Mail size={20} color={brandConfig.colors.championGold} />
                        <Link
                          href={`mailto:${contactConfig.txt_email}`}
                          sx={{
                            color: brandConfig.colors.stableMahogany,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {contactConfig.txt_email}
                        </Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MapPin size={20} color={brandConfig.colors.championGold} />
                        <Typography sx={{ color: brandConfig.colors.textSecondary }}>
                          Lexington, KY
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Emergency Contact Types */}
      <Box sx={{ py: 8, backgroundColor: brandConfig.colors.background }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: brandConfig.typography.weightBold,
                fontFamily: 'Bebas Neue, display',
                textAlign: 'center',
                color: brandConfig.colors.stableMahogany,
                mb: 8,
                textTransform: 'uppercase',
              }}
            >
              {contactConfig.txt_emergency_heading}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {contactConfig.emergency_contact_types.map((contact, index) => (
              <Grid item xs={12} md={4} key={contact.type}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: brandConfig.gradients.statusCard,
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            backgroundColor: contact.priority === 'Critical' 
                              ? `${brandConfig.colors.victoryRose}20` 
                              : contact.priority === 'High' 
                              ? `${brandConfig.colors.alertAmber}20` 
                              : `${brandConfig.colors.successGreen}20`,
                            color: contact.priority === 'Critical' 
                              ? brandConfig.colors.victoryRose 
                              : contact.priority === 'High' 
                              ? brandConfig.colors.alertAmber 
                              : brandConfig.colors.successGreen,
                            mr: 2,
                          }}
                        >
                          {contact.priority === 'Critical' ? <AlertTriangle size={24} /> :
                           contact.priority === 'High' ? <AlertCircle size={24} /> :
                           <Headphones size={24} />}
                        </Box>
                        <Chip
                          label={contact.priority}
                          size="small"
                          sx={{
                            backgroundColor: contact.priority === 'Critical' 
                              ? brandConfig.colors.victoryRose 
                              : contact.priority === 'High' 
                              ? brandConfig.colors.alertAmber 
                              : brandConfig.colors.successGreen,
                            color: brandConfig.colors.arenaSand,
                            fontWeight: brandConfig.typography.weightBold,
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeXl,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          mb: 2,
                        }}
                      >
                        {contact.type}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.textSecondary,
                          lineHeight: brandConfig.typography.lineHeightRelaxed,
                          mb: 3,
                        }}
                      >
                        {contact.description}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        href={contact.contact.includes('@') ? `mailto:${contact.contact}` : `tel:${contact.contact}`}
                        startIcon={contact.contact.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
                        sx={{
                          backgroundColor: brandConfig.colors.stableMahogany,
                          color: brandConfig.colors.arenaSand,
                          '&:hover': {
                            backgroundColor: brandConfig.colors.stableMahogany,
                            opacity: 0.9,
                          },
                        }}
                      >
                        {contact.contact}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Form Section */}
      <Box sx={{ py: 10, backgroundColor: brandConfig.colors.surface }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    color: brandConfig.colors.stableMahogany,
                    mb: 3,
                    textTransform: 'uppercase',
                  }}
                >
                  {contactConfig.txt_form_heading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    color: brandConfig.colors.textSecondary,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    mb: 4,
                  }}
                >
                  {contactConfig.txt_form_description}
                </Typography>
                
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${brandConfig.colors.championGold}10 0%, ${brandConfig.colors.stableMahogany}10 100%)`,
                    borderRadius: '16px',
                    border: `2px solid ${brandConfig.colors.championGold}20`,
                    mb: 4,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeLg,
                        fontWeight: brandConfig.typography.weightMedium,
                        color: brandConfig.colors.stableMahogany,
                        fontStyle: 'italic',
                        textAlign: 'center',
                      }}
                    >
                      "{contactConfig.txt_form_quote}"
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card
                  sx={{
                    background: brandConfig.gradients.statusCard,
                    borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={contactConfig.form_fields.first_name.label}
                            required={contactConfig.form_fields.first_name.required}
                            placeholder={contactConfig.form_fields.first_name.placeholder}
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            error={!!formErrors.firstName}
                            helperText={formErrors.firstName}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <User size={18} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={contactConfig.form_fields.last_name.label}
                            required={contactConfig.form_fields.last_name.required}
                            placeholder={contactConfig.form_fields.last_name.placeholder}
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            error={!!formErrors.lastName}
                            helperText={formErrors.lastName}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <User size={18} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={contactConfig.form_fields.phone.label}
                            required={contactConfig.form_fields.phone.required}
                            placeholder={contactConfig.form_fields.phone.placeholder}
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            error={!!formErrors.phone}
                            helperText={formErrors.phone}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone size={18} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={contactConfig.form_fields.email.label}
                            required={contactConfig.form_fields.email.required}
                            placeholder={contactConfig.form_fields.email.placeholder}
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Mail size={18} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={contactConfig.form_fields.facility_name.label}
                            placeholder={contactConfig.form_fields.facility_name.placeholder}
                            value={formData.facilityName}
                            onChange={(e) => handleInputChange('facilityName', e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Building size={18} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={contactConfig.form_fields.number_of_horses.label}
                            placeholder={contactConfig.form_fields.number_of_horses.placeholder}
                            value={formData.numberOfHorses}
                            onChange={(e) => handleInputChange('numberOfHorses', e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Hash size={18} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl fullWidth required>
                            <InputLabel>{contactConfig.form_fields.inquiry_type.label}</InputLabel>
                            <Select
                              value={formData.inquiryType}
                              onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                              error={!!formErrors.inquiryType}
                              startAdornment={
                                <InputAdornment position="start">
                                  {getContactIcon(formData.inquiryType)}
                                </InputAdornment>
                              }
                            >
                              {contactConfig.form_fields.inquiry_type.options?.map((option) => (
                                <MenuItem key={option} value={option}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getContactIcon(option)}
                                    {option}
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {formErrors.inquiryType && (
                              <Typography color="error" variant="caption">
                                {formErrors.inquiryType}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label={contactConfig.form_fields.subject.label}
                            required={contactConfig.form_fields.subject.required}
                            placeholder={contactConfig.form_fields.subject.placeholder}
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            error={!!formErrors.subject}
                            helperText={formErrors.subject}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <FileText size={18} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label={contactConfig.form_fields.message.label}
                            required={contactConfig.form_fields.message.required}
                            placeholder={contactConfig.form_fields.message.placeholder}
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            error={!!formErrors.message}
                            helperText={formErrors.message}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              fullWidth
                              size="large"
                              disabled={isSubmitting}
                              startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                              sx={{
                                backgroundColor: brandConfig.colors.championGold,
                                color: brandConfig.colors.midnightBlack,
                                fontWeight: brandConfig.typography.weightBold,
                                py: 2,
                                fontSize: brandConfig.typography.fontSizeLg,
                                '&:hover': {
                                  backgroundColor: brandConfig.colors.championGold,
                                  opacity: 0.9,
                                },
                              }}
                            >
                              {isSubmitting ? 'Sending Message...' : contactConfig.txt_submit_button}
                            </Button>
                          </motion.div>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 10, backgroundColor: brandConfig.colors.background }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: brandConfig.typography.weightBold,
                fontFamily: 'Bebas Neue, display',
                textAlign: 'center',
                color: brandConfig.colors.stableMahogany,
                mb: 2,
                textTransform: 'uppercase',
              }}
            >
              {contactConfig.txt_faq_heading}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeLg,
                textAlign: 'center',
                color: brandConfig.colors.textSecondary,
                maxWidth: '600px',
                mx: 'auto',
                mb: 6,
              }}
            >
              {contactConfig.txt_faq_description}
            </Typography>
            
            {/* FAQ Search */}
            <Box sx={{ maxWidth: '500px', mx: 'auto', mb: 6 }}>
              <TextField
                fullWidth
                placeholder="Search frequently asked questions..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: brandConfig.colors.surface,
                  },
                }}
              />
            </Box>
          </motion.div>

          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Accordion
                    expanded={expandedFaq === `faq-${index}`}
                    onChange={(_, isExpanded) => setExpandedFaq(isExpanded ? `faq-${index}` : false)}
                    sx={{
                      mb: 2,
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ChevronDown />}
                      sx={{
                        backgroundColor: brandConfig.colors.surface,
                        borderRadius: '12px',
                        minHeight: '64px',
                        '&.Mui-expanded': {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeLg,
                          fontWeight: brandConfig.typography.weightMedium,
                          color: brandConfig.colors.stableMahogany,
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        backgroundColor: brandConfig.colors.background,
                        borderBottomLeftRadius: '12px',
                        borderBottomRightRadius: '12px',
                        pt: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.textSecondary,
                          lineHeight: brandConfig.typography.lineHeightRelaxed,
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredFaqs.length === 0 && faqSearch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: brandConfig.colors.surface,
                    borderRadius: '12px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeLg,
                      color: brandConfig.colors.textSecondary,
                      mb: 2,
                    }}
                  >
                    No questions found matching "{faqSearch}"
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeBase,
                      color: brandConfig.colors.textSecondary,
                      mb: 3,
                    }}
                  >
                    Try a different search term or contact us directly
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Mail />}
                    onClick={() => setFaqSearch('')}
                    sx={{
                      color: brandConfig.colors.stableMahogany,
                      borderColor: brandConfig.colors.stableMahogany,
                    }}
                  >
                    Clear Search
                  </Button>
                </Paper>
              </motion.div>
            )}
          </Box>
        </Container>
      </Box>

      {/* Service Areas */}
      <Box sx={{ py: 10, backgroundColor: brandConfig.colors.surface }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: brandConfig.typography.weightBold,
                fontFamily: 'Bebas Neue, display',
                textAlign: 'center',
                color: brandConfig.colors.stableMahogany,
                mb: 2,
                textTransform: 'uppercase',
              }}
            >
              {contactConfig.txt_service_heading}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeLg,
                textAlign: 'center',
                color: brandConfig.colors.textSecondary,
                maxWidth: '600px',
                mx: 'auto',
                mb: 8,
              }}
            >
              {contactConfig.txt_service_description}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {contactConfig.service_areas.map((area, index) => (
              <Grid item xs={12} md={4} key={area.region}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: index === 0 
                        ? `linear-gradient(135deg, ${brandConfig.colors.championGold}15 0%, ${brandConfig.colors.stableMahogany}15 100%)`
                        : brandConfig.gradients.statusCard,
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      border: index === 0 ? `2px solid ${brandConfig.colors.championGold}40` : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            backgroundColor: index === 0 
                              ? `${brandConfig.colors.championGold}30`
                              : index === 1 
                              ? `${brandConfig.colors.ribbonBlue}30`
                              : `${brandConfig.colors.successGreen}30`,
                            color: index === 0 
                              ? brandConfig.colors.championGold
                              : index === 1 
                              ? brandConfig.colors.ribbonBlue
                              : brandConfig.colors.successGreen,
                            mr: 2,
                          }}
                        >
                          <Globe size={24} />
                        </Box>
                        {index === 0 && (
                          <Chip
                            label="Primary"
                            size="small"
                            sx={{
                              backgroundColor: brandConfig.colors.championGold,
                              color: brandConfig.colors.midnightBlack,
                              fontWeight: brandConfig.typography.weightBold,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeXl,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          mb: 2,
                        }}
                      >
                        {area.region}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.textSecondary,
                          lineHeight: brandConfig.typography.lineHeightRelaxed,
                          mb: 3,
                        }}
                      >
                        {area.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {area.states.map((state) => (
                          <Chip
                            key={state}
                            label={state}
                            size="small"
                            sx={{
                              backgroundColor: `${brandConfig.colors.stableMahogany}10`,
                              color: brandConfig.colors.stableMahogany,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Support Hours */}
      <Box sx={{ py: 8, backgroundColor: brandConfig.colors.background }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    color: brandConfig.colors.stableMahogany,
                    mb: 3,
                    textTransform: 'uppercase',
                  }}
                >
                  {contactConfig.txt_hours_heading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    color: brandConfig.colors.textSecondary,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    mb: 4,
                  }}
                >
                  {contactConfig.txt_hours_description}
                </Typography>
                
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${brandConfig.colors.successGreen}15 0%, ${brandConfig.colors.championGold}15 100%)`,
                    borderRadius: '16px',
                    border: `2px solid ${brandConfig.colors.successGreen}40`,
                    mb: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AlertTriangle size={24} color={brandConfig.colors.victoryRose} />
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeLg,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          ml: 2,
                        }}
                      >
                        {contactConfig.txt_hours_note}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeBase,
                        color: brandConfig.colors.textSecondary,
                      }}
                    >
                      {contactConfig.txt_emergency_hours_note}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card
                  sx={{
                    background: brandConfig.gradients.statusCard,
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeXl,
                        fontWeight: brandConfig.typography.weightBold,
                        color: brandConfig.colors.stableMahogany,
                        mb: 3,
                        textAlign: 'center',
                      }}
                    >
                      Business Hours
                    </Typography>
                    <Stack spacing={2}>
                      {Object.entries(contactConfig.business_hours).map(([day, hours]) => (
                        <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            sx={{
                              fontSize: brandConfig.typography.fontSizeBase,
                              color: brandConfig.colors.textSecondary,
                              textTransform: 'capitalize',
                              fontWeight: brandConfig.typography.weightMedium,
                            }}
                          >
                            {day}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: brandConfig.typography.fontSizeBase,
                              color: brandConfig.colors.stableMahogany,
                            }}
                          >
                            {hours}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          position: 'relative',
          py: 12,
          backgroundColor: brandConfig.colors.midnightBlack,
          color: brandConfig.colors.arenaSand,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(135deg, rgba(107, 58, 44, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%), url(${contactConfig.img_cta_background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    mb: 2,
                    textTransform: 'uppercase',
                    color: brandConfig.colors.championGold,
                  }}
                >
                  {contactConfig.txt_cta_heading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: brandConfig.typography.weightMedium,
                    mb: 3,
                    color: brandConfig.colors.arenaSand,
                  }}
                >
                  {contactConfig.txt_cta_subheading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    mb: 3,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    color: brandConfig.colors.arenaSand,
                  }}
                >
                  {contactConfig.txt_cta_description}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    mb: 4,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    color: brandConfig.colors.arenaSand,
                    fontStyle: 'italic',
                  }}
                >
                  {contactConfig.txt_cta_description2}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Button
                    variant="contained"
                    size="large"
                    href={contactConfig.url_cta_button}
                    endIcon={<ArrowRight />}
                    sx={{
                      backgroundColor: brandConfig.colors.championGold,
                      color: brandConfig.colors.midnightBlack,
                      fontWeight: brandConfig.typography.weightBold,
                      px: 4,
                      py: 2,
                      fontSize: brandConfig.typography.fontSizeLg,
                      '&:hover': {
                        backgroundColor: brandConfig.colors.championGold,
                        opacity: 0.9,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {contactConfig.txt_cta_button}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href={contactConfig.url_cta_secondary}
                    startIcon={<Calendar />}
                    sx={{
                      color: brandConfig.colors.arenaSand,
                      borderColor: brandConfig.colors.arenaSand,
                      px: 4,
                      py: 2,
                      fontSize: brandConfig.typography.fontSizeLg,
                      '&:hover': {
                        backgroundColor: `${brandConfig.colors.arenaSand}20`,
                        borderColor: brandConfig.colors.arenaSand,
                      },
                    }}
                  >
                    {contactConfig.txt_cta_secondary_button}
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    backgroundColor: `${brandConfig.colors.championGold}20`,
                    border: `3px solid ${brandConfig.colors.championGold}`,
                    margin: '0 auto',
                  }}
                >
                  <Shield size={80} color={brandConfig.colors.championGold} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{
            width: '100%',
            backgroundColor: brandConfig.colors.successGreen,
            color: brandConfig.colors.arenaSand,
          }}
        >
          <Typography sx={{ fontWeight: brandConfig.typography.weightBold, mb: 1 }}>
            {contactConfig.txt_success_message_heading}
          </Typography>
          <Typography>
            {submissionResult?.message}
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
}; 