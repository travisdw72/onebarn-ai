import React, { useState } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { registrationConfig } from '../../config/registrationConfig';
import { Header } from '../../components/layout/Header';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  IRegistrationFormData, 
  IPricingPlan, 
  IAddonService,
  IPricingCalculation 
} from '../../interfaces/RegistrationTypes';
import {
  CheckCircle as CheckIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

export const Register: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<IRegistrationFormData>>({
    billingCycle: 'monthly',
    selectedAddons: [],
    primaryConcerns: [],
    alertFrequency: 'immediate',
    cameraSetup: 'guided',
    trialConsent: true,
    termsAccepted: false,
    marketingConsent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlanSelect = (planId: string) => {
    setFormData(prev => ({ ...prev, selectedPlan: planId }));
    setShowPricing(false);
  };

  const calculatePricing = (plan: IPricingPlan, horseCount: number, billingCycle: 'monthly' | 'yearly'): IPricingCalculation => {
    const basePrice = billingCycle === 'yearly' 
      ? (typeof plan.yearlyPricePerHorse === 'number' ? plan.yearlyPricePerHorse : 0)
      : (typeof plan.monthlyPricePerHorse === 'number' ? plan.monthlyPricePerHorse : 0);
    
    const monthlyTotal = basePrice * horseCount;
    const yearlyTotal = monthlyTotal * 12;
    const setupFee = typeof plan.setupFee === 'number' ? plan.setupFee : 0;
    
    return {
      basePrice,
      totalHorses: horseCount,
      monthlyTotal,
      yearlyTotal,
      yearlyDiscount: billingCycle === 'yearly' ? (monthlyTotal * 12 - yearlyTotal) : 0,
      setupFee,
      addonsTotal: 0, // Calculate based on selected addons
      finalTotal: billingCycle === 'yearly' ? yearlyTotal : monthlyTotal,
      savings: billingCycle === 'yearly' ? (monthlyTotal * 12 - yearlyTotal) : undefined,
    };
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (stepIndex === 0) { // Owner Info & Horse Count
      if (!formData.ownerName?.trim()) {
        newErrors.ownerName = registrationConfig.validation.required;
      }
      if (!formData.horseCount || formData.horseCount < 1 || formData.horseCount > 2) {
        newErrors.horseCount = 'Please enter 1 or 2 horses for individual plans';
      }
      if (!formData.location?.trim()) {
        newErrors.location = registrationConfig.validation.required;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Mock registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message or redirect
      console.log('Registration successful:', formData);
      // You would typically call your registration API here
      
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
    },
    container: {
      padding: '2rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '3rem',
    },
    title: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize4xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      margin: '0 0 1rem 0',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
    subtitle: {
      fontSize: brandConfig.typography.fontSizeXl,
      color: brandConfig.colors.neutralGray,
      margin: '0 0 0.5rem 0',
      fontWeight: brandConfig.typography.weightMedium,
    },
    description: {
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.midnightBlack,
      lineHeight: brandConfig.typography.lineHeightRelaxed,
      maxWidth: '800px',
      margin: '0 auto',
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: showPricing ? '1fr 400px' : '1fr',
      gap: '3rem',
      alignItems: 'flex-start',
    },
    formSection: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '2rem',
      boxShadow: brandConfig.layout.boxShadow,
    },
    pricingSection: {
      position: 'sticky' as const,
      top: '2rem',
    },
    businessInfoForm: {
      display: 'grid',
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
    },
    label: {
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.midnightBlack,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
    },
    input: {
      fontSize: brandConfig.typography.fontSizeBase,
      padding: '0.875rem 1rem',
      border: `2px solid ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.layout.borderRadius,
      backgroundColor: brandConfig.colors.barnWhite,
      color: brandConfig.colors.midnightBlack,
      transition: 'border-color 0.2s ease',
      minHeight: '48px',
    },
    select: {
      fontSize: brandConfig.typography.fontSizeBase,
      padding: '0.875rem 1rem',
      border: `2px solid ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.layout.borderRadius,
      backgroundColor: brandConfig.colors.barnWhite,
      color: brandConfig.colors.midnightBlack,
      minHeight: '48px',
    },
    errorText: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.alertAmber,
      marginTop: '0.25rem',
    },
    pricingGrid: {
      display: 'grid',
      gap: '1.5rem',
    },
    pricingCard: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '2rem',
      border: '2px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative' as const,
    },
    pricingCardPopular: {
      border: `2px solid ${brandConfig.colors.ribbonBlue}`,
      transform: 'scale(1.02)',
    },
    popularBadge: {
      position: 'absolute' as const,
      top: '-12px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.barnWhite,
      padding: '0.5rem 1rem',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightBold,
      textTransform: 'uppercase' as const,
    },
    planName: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.midnightBlack,
      margin: '0 0 0.5rem 0',
    },
    planDescription: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.neutralGray,
      margin: '0 0 1.5rem 0',
    },
    priceDisplay: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.5rem',
      margin: '0 0 1.5rem 0',
    },
    priceAmount: {
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
    },
    priceUnit: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.neutralGray,
    },
    featuresList: {
      listStyle: 'none',
      padding: '0',
      margin: '0',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 0',
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.midnightBlack,
    },
    checkIcon: {
      color: brandConfig.colors.successGreen,
      fontSize: '1.25rem',
    },
    button: {
      width: '100%',
      padding: '1rem 2rem',
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      border: 'none',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '48px',
      marginTop: '1.5rem',
    },
    trustIndicators: {
      marginTop: '3rem',
      padding: '2rem',
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      textAlign: 'center' as const,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statItem: {
      textAlign: 'center' as const,
    },
    statValue: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.ribbonBlue,
      margin: '0 0 0.25rem 0',
    },
    statLabel: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray,
      textTransform: 'uppercase' as const,
    },
  };

  return (
    <div style={styles.pageContainer}>
      <Header />
      
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            {registrationConfig.page.title}
          </h1>
          <p style={styles.subtitle}>
            {registrationConfig.page.subtitle}
          </p>
          <p style={styles.description}>
            {registrationConfig.page.description}
          </p>
        </div>

        <div style={styles.mainContent}>
          {/* Form Section */}
          <div style={styles.formSection}>
            <h2 style={{
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold,
              color: brandConfig.colors.midnightBlack,
              margin: '0 0 2rem 0',
            }}>
              {registrationConfig.form.businessInfo.title}
            </h2>

            <form style={styles.businessInfoForm}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  {registrationConfig.form.businessInfo.fields.ownerName.label}
                </label>
                <input
                  type="text"
                  style={{
                    ...styles.input,
                    borderColor: errors.ownerName ? brandConfig.colors.alertAmber : brandConfig.colors.sterlingSilver,
                  }}
                  placeholder={registrationConfig.form.businessInfo.fields.ownerName.placeholder}
                  value={formData.ownerName || ''}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                />
                {errors.ownerName && (
                  <div style={styles.errorText}>{errors.ownerName}</div>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  {registrationConfig.form.businessInfo.fields.ownerType.label}
                </label>
                <select
                  style={styles.select}
                  value={formData.ownerType || ''}
                  onChange={(e) => handleInputChange('ownerType', e.target.value)}
                >
                  <option value="">
                    {registrationConfig.form.businessInfo.fields.ownerType.placeholder}
                  </option>
                  {registrationConfig.form.businessInfo.fields.ownerType.options?.map((option: any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  {registrationConfig.form.businessInfo.fields.horseCount.label}
                </label>
                <input
                  type="number"
                  style={{
                    ...styles.input,
                    borderColor: errors.horseCount ? brandConfig.colors.alertAmber : brandConfig.colors.sterlingSilver,
                  }}
                  placeholder={registrationConfig.form.businessInfo.fields.horseCount.placeholder}
                  min={1}
                  max={500}
                  value={formData.horseCount || ''}
                  onChange={(e) => handleInputChange('horseCount', parseInt(e.target.value) || 0)}
                />
                {errors.horseCount && (
                  <div style={styles.errorText}>{errors.horseCount}</div>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  {registrationConfig.form.businessInfo.fields.location.label}
                </label>
                <input
                  type="text"
                  style={{
                    ...styles.input,
                    borderColor: errors.location ? brandConfig.colors.alertAmber : brandConfig.colors.sterlingSilver,
                  }}
                  placeholder={registrationConfig.form.businessInfo.fields.location.placeholder}
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
                {errors.location && (
                  <div style={styles.errorText}>{errors.location}</div>
                )}
              </div>

                            {formData.horseCount && formData.horseCount > 2 && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: brandConfig.colors.ribbonBlue + '10',
                  borderRadius: '6px',
                  marginTop: '1rem',
                  border: `1px solid ${brandConfig.colors.ribbonBlue}30`,
                }}>
                  <div style={{
                    fontSize: brandConfig.typography.fontSizeSm,
                    fontWeight: brandConfig.typography.weightBold,
                    color: brandConfig.colors.ribbonBlue,
                    marginBottom: '0.5rem',
                  }}>
                    💡 Volume Pricing Available
                  </div>
                  <div style={{
                    fontSize: brandConfig.typography.fontSizeSm,
                    color: brandConfig.colors.midnightBlack,
                    lineHeight: brandConfig.typography.lineHeightNormal,
                  }}>
                    For {formData.horseCount} horses, you'll get our best per-horse rate of $89/month ($79/month annually)
                  </div>
                </div>
              )}

              <button
                type="button"
                style={styles.button}
                onClick={() => {
                  if (validateStep(0)) {
                    setShowPricing(true);
                  }
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#5A3124';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = brandConfig.colors.stableMahogany;
                }}
              >
                View Pricing Plans
                <ArrowIcon style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>

            {/* Billing Transparency Disclaimer */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: `${brandConfig.colors.ribbonBlue}08`,
              borderRadius: brandConfig.layout.borderRadius,
              border: `1px solid ${brandConfig.colors.ribbonBlue}30`,
            }}>
              <h4 style={{
                fontSize: brandConfig.typography.fontSizeBase,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.ribbonBlue,
                margin: '0 0 0.75rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{ fontSize: '1.2rem' }}>💎</span>
                {registrationConfig.billing.disclaimer.title}
              </h4>
              
              <p style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.midnightBlack,
                lineHeight: brandConfig.typography.lineHeightRelaxed,
                margin: '0 0 1rem 0',
              }}>
                {registrationConfig.billing.disclaimer.content}
              </p>

              <div style={{
                padding: '1rem',
                backgroundColor: brandConfig.colors.successGreen + '15',
                borderRadius: '6px',
                borderLeft: `4px solid ${brandConfig.colors.successGreen}`,
                marginBottom: '1rem',
              }}>
                <p style={{
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontWeight: brandConfig.typography.weightMedium,
                  color: brandConfig.colors.successGreen,
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span>💰</span>
                  {registrationConfig.billing.disclaimer.valueProposition}
                </p>
              </div>

              <p style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                lineHeight: brandConfig.typography.lineHeightRelaxed,
                margin: '0 0 0.75rem 0',
              }}>
                {registrationConfig.billing.transparency.costBreakdown}
              </p>

              <p style={{
                fontSize: brandConfig.typography.fontSizeXs,
                color: brandConfig.colors.neutralGray,
                lineHeight: brandConfig.typography.lineHeightNormal,
                margin: '0',
                fontStyle: 'italic',
              }}>
                {registrationConfig.billing.disclaimer.legalText}
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          {showPricing && formData.horseCount && (
            <div style={styles.pricingSection}>
              <h3 style={{
                fontSize: brandConfig.typography.fontSizeXl,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.midnightBlack,
                margin: '0 0 1.5rem 0',
                textAlign: 'center',
              }}>
                {registrationConfig.form.planSelection.title}
              </h3>

              <div style={styles.pricingGrid}>
                {(() => {
                  const plan = registrationConfig.pricing.plan;
                  const horseCount = formData.horseCount!;
                  const isYearly = formData.billingCycle === 'yearly';
                  
                  let price, savings, perHorsePrice, setupFee = 0;
                  
                  if (horseCount === 1) {
                    price = isYearly ? plan.pricing.oneHorse.yearly : plan.pricing.oneHorse.monthly;
                    savings = isYearly ? plan.pricing.oneHorse.savings : 0;
                    perHorsePrice = isYearly ? plan.pricing.oneHorse.perHorseYearly : plan.pricing.oneHorse.perHorseMonthly;
                  } else if (horseCount === 2) {
                    price = isYearly ? plan.pricing.twoHorses.yearly : plan.pricing.twoHorses.monthly;
                    savings = isYearly ? plan.pricing.twoHorses.savings : 0;
                    perHorsePrice = isYearly ? plan.pricing.twoHorses.perHorseYearly : plan.pricing.twoHorses.perHorseMonthly;
                  } else { // 3-5 horses
                    const perHorse = isYearly ? plan.pricing.threeToFiveHorses.yearly : plan.pricing.threeToFiveHorses.monthly;
                    price = perHorse * horseCount;
                    savings = isYearly ? (plan.pricing.threeToFiveHorses.savings * horseCount) : 0;
                    perHorsePrice = perHorse;
                    setupFee = plan.pricing.threeToFiveHorses.setupFee;
                  }
                  
                  return (
                    <div
                      style={{
                        ...styles.pricingCard,
                        ...(plan.popular ? styles.pricingCardPopular : {}),
                      }}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {plan.popular && (
                        <div style={styles.popularBadge}>
                          Professional Grade
                        </div>
                      )}

                      <h4 style={styles.planName}>{plan.name}</h4>
                      <p style={styles.planDescription}>{plan.description}</p>

                      <div style={styles.priceDisplay}>
                        <span style={styles.priceAmount}>
                          ${price.toLocaleString()}
                        </span>
                        <span style={styles.priceUnit}>
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </div>

                      {horseCount > 1 && (
                        <div style={{
                          fontSize: brandConfig.typography.fontSizeSm,
                          color: brandConfig.colors.neutralGray,
                          marginBottom: '1rem',
                        }}>
                          ${perHorsePrice}/horse • {horseCount} horses
                          {horseCount >= 3 && (
                            <div style={{
                              fontSize: brandConfig.typography.fontSizeXs,
                              color: brandConfig.colors.ribbonBlue,
                              marginTop: '0.25rem',
                            }}>
                              Volume pricing applies for 3+ horses
                            </div>
                          )}
                        </div>
                      )}

                      {setupFee > 0 && (
                        <div style={{
                          backgroundColor: brandConfig.colors.alertAmber + '20',
                          color: brandConfig.colors.alertAmber,
                          padding: '0.5rem',
                          borderRadius: '4px',
                          fontSize: brandConfig.typography.fontSizeSm,
                          fontWeight: brandConfig.typography.weightMedium,
                          marginBottom: '1rem',
                          textAlign: 'center',
                        }}>
                          One-time setup fee: ${setupFee} (3+ horses)
                        </div>
                      )}

                      {savings > 0 && (
                        <div style={{
                          backgroundColor: brandConfig.colors.successGreen + '20',
                          color: brandConfig.colors.successGreen,
                          padding: '0.5rem',
                          borderRadius: '4px',
                          fontSize: brandConfig.typography.fontSizeSm,
                          fontWeight: brandConfig.typography.weightBold,
                          marginBottom: '1rem',
                          textAlign: 'center',
                        }}>
                          Save ${savings}/year with annual billing!
                        </div>
                      )}

                      <ul style={styles.featuresList}>
                        {plan.features.map((feature: string, index: number) => (
                          <li key={index} style={styles.featureItem}>
                            <CheckIcon style={styles.checkIcon} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div style={{
                        margin: '1.5rem 0',
                        padding: '1rem',
                        backgroundColor: brandConfig.colors.ribbonBlue + '10',
                        borderRadius: '6px',
                        borderLeft: `4px solid ${brandConfig.colors.ribbonBlue}`,
                      }}>
                        <h5 style={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.ribbonBlue,
                          margin: '0 0 0.5rem 0',
                        }}>
                          Peace of Mind Benefits:
                        </h5>
                        {plan.benefits.map((benefit: string, index: number) => (
                          <div key={index} style={{
                            fontSize: brandConfig.typography.fontSizeSm,
                            color: brandConfig.colors.midnightBlack,
                            margin: '0.25rem 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}>
                            <span style={{ color: brandConfig.colors.successGreen }}>✓</span>
                            {benefit}
                          </div>
                        ))}
                      </div>

                      <button
                        style={{
                          ...styles.button,
                          backgroundColor: brandConfig.colors.ribbonBlue,
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#1565C0';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = brandConfig.colors.ribbonBlue;
                        }}
                      >
                        Start {plan.trialDays}-Day Free Trial
                      </button>

                      <div style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        fontSize: brandConfig.typography.fontSizeXs,
                        color: brandConfig.colors.neutralGray,
                      }}>
                        {plan.moneyBackGuarantee}-day money-back guarantee • No setup fee
                      </div>
                    </div>
                  );
                })()}
              </div>


            </div>
          )}
        </div>

        {/* Barn Partnership Section */}
        <div style={{
          marginTop: '4rem',
          padding: '3rem 2rem',
          backgroundColor: brandConfig.colors.hunterGreen,
          borderRadius: brandConfig.layout.borderRadius,
          color: brandConfig.colors.barnWhite,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
          <h2 style={{
            fontSize: brandConfig.typography.fontSize3xl,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.barnWhite,
            margin: '0 0 1rem 0',
          }}>
            {registrationConfig.barnPartnership.title}
          </h2>
          <p style={{
            fontSize: brandConfig.typography.fontSizeXl,
            color: brandConfig.colors.arenaSand,
            margin: '0 0 1rem 0',
            fontWeight: brandConfig.typography.weightMedium,
          }}>
            {registrationConfig.barnPartnership.subtitle}
          </p>
          <p style={{
            fontSize: brandConfig.typography.fontSizeLg,
            lineHeight: brandConfig.typography.lineHeightRelaxed,
            margin: '0 0 2rem 0',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: 0.95,
          }}>
            {registrationConfig.barnPartnership.description}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              textAlign: 'left',
            }}>
              <h4 style={{
                fontSize: brandConfig.typography.fontSizeXl,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.barnWhite,
                margin: '0 0 1rem 0',
              }}>
                Partnership Benefits
              </h4>
              {registrationConfig.barnPartnership.benefits.map((benefit, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  margin: '0.75rem 0',
                  fontSize: brandConfig.typography.fontSizeBase,
                }}>
                  <span style={{ color: brandConfig.colors.championGold, fontSize: '1.2rem' }}>★</span>
                  {benefit}
                </div>
              ))}
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              textAlign: 'left',
            }}>
              <h4 style={{
                fontSize: brandConfig.typography.fontSizeXl,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.barnWhite,
                margin: '0 0 1rem 0',
              }}>
                Qualification Requirements
              </h4>
              {registrationConfig.barnPartnership.qualifications.map((qualification, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  margin: '0.75rem 0',
                  fontSize: brandConfig.typography.fontSizeBase,
                }}>
                  <span style={{ color: brandConfig.colors.successGreen, fontSize: '1.2rem' }}>✓</span>
                  {qualification}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: brandConfig.colors.championGold,
            color: brandConfig.colors.midnightBlack,
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}>
            <h3 style={{
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold,
              margin: '0 0 0.5rem 0',
            }}>
              {registrationConfig.barnPartnership.cta.title}
            </h3>
            <p style={{
              fontSize: brandConfig.typography.fontSizeLg,
              margin: '0 0 1.5rem 0',
            }}>
              {registrationConfig.barnPartnership.cta.subtitle}
            </p>
            <button
              style={{
                backgroundColor: brandConfig.colors.midnightBlack,
                color: brandConfig.colors.championGold,
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeLg,
                fontWeight: brandConfig.typography.weightBold,
                cursor: 'pointer',
                marginRight: '1rem',
                marginBottom: '1rem',
                minHeight: '48px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = brandConfig.colors.stableMahogany;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = brandConfig.colors.midnightBlack;
              }}
            >
              {registrationConfig.barnPartnership.cta.buttonText}
            </button>
            <div style={{
              fontSize: brandConfig.typography.fontSizeBase,
              marginTop: '1rem',
            }}>
              <strong>Email:</strong> {registrationConfig.barnPartnership.cta.contact}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div style={styles.trustIndicators}>
          <h3 style={{
            fontSize: brandConfig.typography.fontSizeXl,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.midnightBlack,
            margin: '0 0 1.5rem 0',
          }}>
            {registrationConfig.trustIndicators.title}
          </h3>
          
          <div style={styles.statsGrid}>
            {registrationConfig.trustIndicators.statistics.map((stat, index) => (
              <div key={index} style={styles.statItem}>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
        }}>
          <p style={{
            fontSize: brandConfig.typography.fontSizeBase,
            color: brandConfig.colors.neutralGray,
          }}>
            Already have an account?{' '}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: brandConfig.colors.ribbonBlue,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: brandConfig.typography.fontSizeBase,
              }}
              onClick={() => navigateTo('login')}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};