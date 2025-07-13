import React, { useState } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { barnPartnerDemoConfig } from '../../config/barnPartnerDemoConfig';
import { IBarnPartnerDemoPageProps, ITestimonial, ICompetitiveAdvantage, INextStep } from '../../interfaces/BarnPartnerTypes';
import { Header } from '../../components/layout/Header';
import { 
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MoneyIcon,
  Assessment as MetricsIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Business as BusinessIcon,
  ContactPhone as ContactIcon,
  Calculate as CalculatorIcon,
  Security as InsuranceIcon,
  Speed as EfficiencyIcon,
  People as PeopleIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

export const BarnPartnerDemo: React.FC<IBarnPartnerDemoPageProps> = ({ 
  config = barnPartnerDemoConfig 
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'financials' | 'metrics' | 'implementation'>('overview');

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontPrimary,
    },
    
    hero: {
      background: `linear-gradient(135deg, ${brandConfig.colors.hunterGreen} 0%, ${brandConfig.colors.stableMahogany} 100%)`,
      padding: '4rem 0',
      color: brandConfig.colors.arenaSand,
    },
    
    heroContent: {
      maxWidth: brandConfig.layout.maxWidth,
      margin: '0 auto',
      padding: '0 1.5rem',
      textAlign: 'center' as const,
    },
    
    heroTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize4xl,
      fontWeight: brandConfig.typography.weightBold,
      marginBottom: '1rem',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
    
    heroSubtitle: {
      fontSize: brandConfig.typography.fontSize2xl,
      marginBottom: '2rem',
      opacity: 0.9,
    },
    
    barnCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: brandConfig.layout.borderRadius,
      padding: '2rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '3rem',
    },
    
    tabNavigation: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '3rem',
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },
    
    tab: {
      padding: '1rem 2rem',
      borderRadius: brandConfig.layout.borderRadius,
      border: 'none',
      cursor: 'pointer',
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      transition: 'all 0.3s ease',
      minWidth: '150px',
    },
    
    activeTab: {
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.arenaSand,
    },
    
    inactiveTab: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: brandConfig.colors.arenaSand,
    },
    
    section: {
      backgroundColor: brandConfig.colors.barnWhite,
      padding: '4rem 0',
    },
    
    sectionContent: {
      maxWidth: brandConfig.layout.maxWidth,
      margin: '0 auto',
      padding: '0 1.5rem',
    },
    
    sectionTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.midnightBlack,
      textAlign: 'center' as const,
      marginBottom: '3rem',
      textTransform: 'uppercase' as const,
    },
    
    financialGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    
    financialCard: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      textAlign: 'center' as const,
    },
    
    financialAmount: {
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      marginBottom: '0.5rem',
    },
    
    financialLabel: {
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.neutralGray,
      fontWeight: brandConfig.typography.weightMedium,
    },
    
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
    },
    
    metricCard: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      textAlign: 'center' as const,
    },
    
    metricValue: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      marginBottom: '0.5rem',
    },
    
    testimonialCard: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      marginBottom: '2rem',
      borderLeft: `4px solid ${brandConfig.colors.ribbonBlue}`,
    },
    
    quote: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontStyle: 'italic',
      marginBottom: '1rem',
      lineHeight: brandConfig.typography.lineHeightRelaxed,
    },
    
    testimonialAuthor: {
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
    },
    
    ctaSection: {
      backgroundColor: brandConfig.colors.hunterGreen,
      padding: '4rem 0',
      textAlign: 'center' as const,
      color: brandConfig.colors.arenaSand,
    },
    
    ctaButton: {
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.arenaSand,
      padding: '1.25rem 2.5rem',
      border: 'none',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      marginTop: '2rem',
    },
    
    advantageCard: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      marginBottom: '1.5rem',
    },
    
    stepCard: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: brandConfig.colors.arenaSand,
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      marginBottom: '1.5rem',
    },
    
    stepNumber: {
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.arenaSand,
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      marginRight: '2rem',
      flexShrink: 0,
    },
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTabStyle = (tabKey: string) => ({
    ...styles.tab,
    backgroundColor: selectedTab === tabKey ? brandConfig.colors.ribbonBlue : 'rgba(255, 255, 255, 0.1)',
    color: brandConfig.colors.arenaSand,
  });

  const renderOverview = () => (
    <div style={styles.section}>
      <div style={styles.sectionContent}>
        {/* Financial Transparency */}
        <h2 style={styles.sectionTitle}>Financial Transparency</h2>
        <div style={styles.financialGrid}>
          <div style={{
            ...styles.financialCard,
            borderTop: `4px solid ${brandConfig.colors.successGreen}`,
          }}>
            <MoneyIcon sx={{ fontSize: '3rem', color: brandConfig.colors.successGreen, marginBottom: '1rem' }} />
            <div style={{
              ...styles.financialAmount,
              color: brandConfig.colors.successGreen,
            }}>
              {formatCurrency(config.financials.monthly.barnPartnerShare)}
            </div>
            <div style={styles.financialLabel}>Monthly Barn Revenue</div>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeSm, 
              color: brandConfig.colors.neutralGray,
              marginTop: '0.5rem'
            }}>
              Pure profit - no costs
            </div>
          </div>

          <div style={{
            ...styles.financialCard,
            borderTop: `4px solid ${brandConfig.colors.ribbonBlue}`,
          }}>
            <BusinessIcon sx={{ fontSize: '3rem', color: brandConfig.colors.ribbonBlue, marginBottom: '1rem' }} />
            <div style={{
              ...styles.financialAmount,
              color: brandConfig.colors.ribbonBlue,
            }}>
              {formatCurrency(config.financials.monthly.oneBarnAINetProfit)}
            </div>
            <div style={styles.financialLabel}>One Barn AI Net Profit</div>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeSm, 
              color: brandConfig.colors.neutralGray,
              marginTop: '0.5rem'
            }}>
              After API & operational costs
            </div>
          </div>

          <div style={{
            ...styles.financialCard,
            borderTop: `4px solid ${brandConfig.colors.championGold}`,
          }}>
            <PeopleIcon sx={{ fontSize: '3rem', color: brandConfig.colors.championGold, marginBottom: '1rem' }} />
            <div style={{
              ...styles.financialAmount,
              color: brandConfig.colors.championGold,
            }}>
              {formatCurrency(config.financials.monthly.clientSavingsVsIndividual)}
            </div>
            <div style={styles.financialLabel}>Client Savings</div>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeSm, 
              color: brandConfig.colors.neutralGray,
              marginTop: '0.5rem'
            }}>
              vs. individual pricing
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div style={{
          backgroundColor: brandConfig.colors.hunterGreen,
          color: brandConfig.colors.arenaSand,
          padding: '3rem',
          borderRadius: brandConfig.layout.borderRadius,
          marginBottom: '4rem',
        }}>
          <h3 style={{
            fontSize: brandConfig.typography.fontSize2xl,
            fontWeight: brandConfig.typography.weightBold,
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            Monthly Revenue Breakdown ({config.facility.totalHorses} horses @ ${config.facility.premiumServiceUpcharge}/horse)
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}>
            <div>
              <div style={{
                fontSize: brandConfig.typography.fontSize3xl,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.arenaSand,
              }}>
                {formatCurrency(config.financials.monthly.totalRevenueGenerated)}
              </div>
              <div>Total Revenue</div>
            </div>
            
            <div style={{ fontSize: '2rem' }}>→</div>
            
            <div>
              <div style={{
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.ribbonBlue,
              }}>
                {formatCurrency(config.financials.monthly.oneBarnAIShare)}
              </div>
              <div>One Barn AI (60%)</div>
            </div>
            
            <div>
              <div style={{
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.successGreen,
              }}>
                {formatCurrency(config.financials.monthly.barnPartnerShare)}
              </div>
              <div>Barn Partner (40%)</div>
            </div>
          </div>
          
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: brandConfig.layout.borderRadius,
          }}>
            <div style={{ marginBottom: '1rem', fontSize: brandConfig.typography.fontSizeLg, fontWeight: brandConfig.typography.weightSemiBold }}>
              One Barn AI Cost Breakdown:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>API Processing: {formatCurrency(config.financials.monthly.oneBarnAICosts.apiProcessing)}</div>
              <div>Platform Ops: {formatCurrency(config.financials.monthly.oneBarnAICosts.platformOperations)}</div>
              <div>Sales & Marketing: {formatCurrency(config.financials.monthly.oneBarnAICosts.salesAndMarketing)}</div>
              <div style={{ fontWeight: brandConfig.typography.weightBold }}>
                Net Profit: {formatCurrency(config.financials.monthly.oneBarnAINetProfit)}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Impact */}
        <h2 style={styles.sectionTitle}>Performance Impact</h2>
        <div style={styles.metricsGrid}>
          <div style={{
            ...styles.metricCard,
            borderTop: `4px solid ${brandConfig.colors.alertAmber}`,
          }}>
            <div style={{
              ...styles.metricValue,
              color: brandConfig.colors.alertAmber,
            }}>
              {config.metrics.healthIncidents.reductionPercentage}%
            </div>
            <div style={styles.financialLabel}>Health Incident Reduction</div>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeSm, 
              color: brandConfig.colors.neutralGray,
              marginTop: '0.5rem'
            }}>
              From {config.metrics.healthIncidents.before} to {config.metrics.healthIncidents.after} per month
            </div>
          </div>

          <div style={{
            ...styles.metricCard,
            borderTop: `4px solid ${brandConfig.colors.successGreen}`,
          }}>
            <div style={{
              ...styles.metricValue,
              color: brandConfig.colors.successGreen,
            }}>
              {formatCurrency(config.metrics.healthIncidents.monthlyCostSavings)}
            </div>
            <div style={styles.financialLabel}>Monthly Vet Cost Savings</div>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeSm, 
              color: brandConfig.colors.neutralGray,
              marginTop: '0.5rem'
            }}>
              Prevented emergencies
            </div>
          </div>

          <div style={{
            ...styles.metricCard,
            borderTop: `4px solid ${brandConfig.colors.ribbonBlue}`,
          }}>
            <div style={{
              ...styles.metricValue,
              color: brandConfig.colors.ribbonBlue,
            }}>
              {config.metrics.customerSatisfaction.npsScore}
            </div>
            <div style={styles.financialLabel}>Net Promoter Score</div>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeSm, 
              color: brandConfig.colors.neutralGray,
              marginTop: '0.5rem'
            }}>
              Exceptional client satisfaction
            </div>
          </div>

          <div style={{
            ...styles.metricCard,
            borderTop: `4px solid ${brandConfig.colors.victoryRose}`,
          }}>
            <div style={{
              ...styles.metricValue,
              color: brandConfig.colors.victoryRose,
            }}>
              {config.metrics.customerSatisfaction.retentionRate}%
            </div>
            <div style={styles.financialLabel}>Client Retention Rate</div>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeSm, 
              color: brandConfig.colors.neutralGray,
              marginTop: '0.5rem'
            }}>
              vs. industry avg 78%
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancials = () => (
    <div style={styles.section}>
      <div style={styles.sectionContent}>
        <h2 style={styles.sectionTitle}>5-Year Financial Projection</h2>
        
        {/* ROI Calculator */}
        <div style={{
          backgroundColor: brandConfig.colors.stableMahogany,
          color: brandConfig.colors.arenaSand,
          padding: '3rem',
          borderRadius: brandConfig.layout.borderRadius,
          marginBottom: '3rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <CalculatorIcon sx={{ fontSize: '3rem', marginRight: '1rem' }} />
            <h3 style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold, margin: 0 }}>
              {config.roiCalculator.title}
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
                {formatCurrency(config.roiCalculator.outputs.monthlyAIRevenue)}
              </div>
              <div>Monthly AI Revenue</div>
            </div>
            <div>
              <div style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
                {formatCurrency(config.roiCalculator.outputs.annualAIRevenue)}
              </div>
              <div>Annual AI Revenue</div>
            </div>
            <div>
              <div style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
                {formatCurrency(config.roiCalculator.outputs.fiveYearAIRevenue)}
              </div>
              <div>5-Year AI Revenue</div>
            </div>
            <div>
              <div style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
                {formatCurrency(config.roiCalculator.outputs.totalFiveYearValue)}
              </div>
              <div>Total 5-Year Value</div>
            </div>
          </div>
        </div>

        {/* Revenue Growth Story */}
        <h3 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          textAlign: 'center',
          marginBottom: '2rem',
        }}>
          Revenue Growth Story
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={styles.financialCard}>
            <h4 style={{ fontSize: brandConfig.typography.fontSizeXl, marginBottom: '1rem' }}>Before Partnership</h4>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: brandConfig.typography.fontSizeLg, fontWeight: brandConfig.typography.weightSemiBold }}>
                {formatCurrency(config.revenueGrowth.prePartnership.monthlyRevenue)}/month
              </div>
              <div style={{ color: brandConfig.colors.neutralGray }}>Base boarding revenue</div>
            </div>
            <div>
              <div style={{ fontSize: brandConfig.typography.fontSizeLg, fontWeight: brandConfig.typography.weightSemiBold }}>
                {formatCurrency(config.revenueGrowth.prePartnership.netProfit)}/month
              </div>
              <div style={{ color: brandConfig.colors.neutralGray }}>Net profit ({config.revenueGrowth.prePartnership.profitMargin}% margin)</div>
            </div>
          </div>

          <div style={{
            ...styles.financialCard,
            borderTop: `4px solid ${brandConfig.colors.successGreen}`,
          }}>
            <h4 style={{ fontSize: brandConfig.typography.fontSizeXl, marginBottom: '1rem' }}>After Partnership</h4>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: brandConfig.typography.fontSizeLg, fontWeight: brandConfig.typography.weightSemiBold }}>
                {formatCurrency(config.revenueGrowth.postPartnership.monthlyRevenue)}/month
              </div>
              <div style={{ color: brandConfig.colors.neutralGray }}>Base + AI revenue</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: brandConfig.typography.fontSizeLg, fontWeight: brandConfig.typography.weightSemiBold }}>
                {formatCurrency(config.revenueGrowth.postPartnership.netProfit)}/month
              </div>
              <div style={{ color: brandConfig.colors.neutralGray }}>Net profit ({config.revenueGrowth.postPartnership.profitMargin}% margin)</div>
            </div>
            <div style={{
              backgroundColor: brandConfig.colors.successGreen,
              color: brandConfig.colors.arenaSand,
              padding: '0.5rem',
              borderRadius: '4px',
              fontSize: brandConfig.typography.fontSizeSm,
              fontWeight: brandConfig.typography.weightSemiBold,
            }}>
              +{formatCurrency(config.revenueGrowth.postPartnership.additionalProfit!)} additional monthly profit
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div style={styles.section}>
      <div style={styles.sectionContent}>
        <h2 style={styles.sectionTitle}>Client Success Stories</h2>
        
        {config.testimonials.map((testimonial: ITestimonial, index: number) => (
          <div key={index} style={styles.testimonialCard}>
            <div style={styles.quote}>"{testimonial.quote}"</div>
            <div style={styles.testimonialAuthor}>
              <strong>{testimonial.clientName}</strong> - {testimonial.horseName} ({testimonial.discipline})
            </div>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeSm, 
              color: brandConfig.colors.neutralGray,
              marginTop: '0.5rem'
            }}>
              {testimonial.incidentDate}
              {testimonial.vetCostSaved && (
                <span style={{ 
                  marginLeft: '1rem',
                  color: brandConfig.colors.successGreen,
                  fontWeight: brandConfig.typography.weightSemiBold 
                }}>
                  Saved: {formatCurrency(testimonial.vetCostSaved)}
                </span>
              )}
              {testimonial.credibility && (
                <span style={{ 
                  marginLeft: '1rem',
                  color: brandConfig.colors.ribbonBlue,
                  fontWeight: brandConfig.typography.weightSemiBold 
                }}>
                  {testimonial.credibility}
                </span>
              )}
            </div>
          </div>
        ))}

        <h2 style={styles.sectionTitle}>Competitive Advantages</h2>
        {config.competitiveAdvantages.map((advantage: ICompetitiveAdvantage, index: number) => (
          <div key={index} style={styles.advantageCard}>
            <h4 style={{
              fontSize: brandConfig.typography.fontSizeXl,
              fontWeight: brandConfig.typography.weightBold,
              color: brandConfig.colors.stableMahogany,
              marginBottom: '1rem',
            }}>
              {advantage.title}
            </h4>
            <p style={{
              fontSize: brandConfig.typography.fontSizeBase,
              lineHeight: brandConfig.typography.lineHeightRelaxed,
              marginBottom: '1rem',
            }}>
              {advantage.description}
            </p>
            <div style={{
              backgroundColor: brandConfig.colors.hunterGreen,
              color: brandConfig.colors.arenaSand,
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              fontSize: brandConfig.typography.fontSizeSm,
              fontWeight: brandConfig.typography.weightSemiBold,
              display: 'inline-block',
            }}>
              Impact: {advantage.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderImplementation = () => (
    <div style={styles.section}>
      <div style={styles.sectionContent}>
        <h2 style={styles.sectionTitle}>Implementation Timeline</h2>
        
        <div style={{ marginBottom: '4rem' }}>
          <div style={styles.advantageCard}>
            <TimelineIcon sx={{ fontSize: '3rem', color: brandConfig.colors.ribbonBlue, marginBottom: '1rem' }} />
            <h3 style={{ fontSize: brandConfig.typography.fontSize2xl, marginBottom: '1rem' }}>{config.implementation.phase1.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: '0.5rem' }}>Activities:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {config.implementation.phase1.activities.map((activity, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: brandConfig.colors.successGreen, marginBottom: '0.5rem' }}>Results:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {config.implementation.phase1.results.map((result, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{result}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={styles.advantageCard}>
            <TimelineIcon sx={{ fontSize: '3rem', color: brandConfig.colors.championGold, marginBottom: '1rem' }} />
            <h3 style={{ fontSize: brandConfig.typography.fontSize2xl, marginBottom: '1rem' }}>{config.implementation.phase2.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: '0.5rem' }}>Activities:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {config.implementation.phase2.activities.map((activity, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: brandConfig.colors.successGreen, marginBottom: '0.5rem' }}>Results:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {config.implementation.phase2.results.map((result, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{result}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={styles.advantageCard}>
            <TimelineIcon sx={{ fontSize: '3rem', color: brandConfig.colors.successGreen, marginBottom: '1rem' }} />
            <h3 style={{ fontSize: brandConfig.typography.fontSize2xl, marginBottom: '1rem' }}>{config.implementation.phase3.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: '0.5rem' }}>Activities:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {config.implementation.phase3.activities.map((activity, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ color: brandConfig.colors.successGreen, marginBottom: '0.5rem' }}>Results:</h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                  {config.implementation.phase3.results.map((result, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>{result}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Getting Started</h2>
        {config.nextSteps.steps.map((step: INextStep, index: number) => (
          <div key={index} style={styles.stepCard}>
            <div style={styles.stepNumber}>{step.step}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: brandConfig.typography.fontSizeXl,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.stableMahogany,
                margin: '0 0 0.5rem 0',
              }}>
                {step.title}
              </h4>
              <p style={{
                fontSize: brandConfig.typography.fontSizeBase,
                margin: '0 0 0.5rem 0',
                lineHeight: brandConfig.typography.lineHeightRelaxed,
              }}>
                {step.description}
              </p>
              <div style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                fontWeight: brandConfig.typography.weightMedium,
              }}>
                Duration: {step.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <Header />
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Barn Partnership Success Story</h1>
          <p style={styles.heroSubtitle}>
            Real results from a real partnership - Full financial transparency
          </p>
          
          {/* Demo Barn Card */}
          <div style={styles.barnCard}>
            <h3 style={{
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold,
              marginBottom: '1rem',
            }}>
              {config.demoBarn.name}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              textAlign: 'left',
            }}>
              <div>
                <strong>Location:</strong> {config.demoBarn.location}
              </div>
              <div>
                <strong>Type:</strong> {config.demoBarn.type}
              </div>
              <div>
                <strong>Horses:</strong> {config.facility.totalHorses}
              </div>
              <div>
                <strong>Partnership:</strong> {config.partnership.currentStatus}
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <strong>Owner:</strong> {config.demoBarn.ownerName}, {config.demoBarn.ownerTitle}
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div style={styles.tabNavigation}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'financials', label: 'Financials' },
              { key: 'metrics', label: 'Performance' },
              { key: 'implementation', label: 'Implementation' },
            ].map((tab) => (
              <button
                key={tab.key}
                style={getTabStyle(tab.key)}
                onClick={() => setSelectedTab(tab.key as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Content Based on Selected Tab */}
      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'financials' && (
        <div style={styles.section}>
          <div style={styles.sectionContent}>
            <h2 style={styles.sectionTitle}>5-Year Financial Projection</h2>
            
            {/* ROI Calculator */}
            <div style={{
              backgroundColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.arenaSand,
              padding: '3rem',
              borderRadius: brandConfig.layout.borderRadius,
              marginBottom: '3rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                <CalculatorIcon sx={{ fontSize: '3rem', marginRight: '1rem' }} />
                <h3 style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold, margin: 0 }}>
                  {config.roiCalculator.title}
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
                    {formatCurrency(config.roiCalculator.outputs.monthlyAIRevenue)}
                  </div>
                  <div>Monthly AI Revenue</div>
                </div>
                <div>
                  <div style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
                    {formatCurrency(config.roiCalculator.outputs.annualAIRevenue)}
                  </div>
                  <div>Annual AI Revenue</div>
                </div>
                <div>
                  <div style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
                    {formatCurrency(config.roiCalculator.outputs.fiveYearAIRevenue)}
                  </div>
                  <div>5-Year AI Revenue</div>
                </div>
                <div>
                  <div style={{ fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
                    {formatCurrency(config.roiCalculator.outputs.totalFiveYearValue)}
                  </div>
                  <div>Total 5-Year Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedTab === 'metrics' && (
        <div style={styles.section}>
          <div style={styles.sectionContent}>
            <h2 style={styles.sectionTitle}>Client Success Stories</h2>
            
            {config.testimonials.map((testimonial, index) => (
              <div key={index} style={styles.testimonialCard}>
                <div style={styles.quote}>"{testimonial.quote}"</div>
                <div style={styles.testimonialAuthor}>
                  <strong>{testimonial.clientName}</strong> - {testimonial.horseName} ({testimonial.discipline})
                </div>
                <div style={{ 
                  fontSize: brandConfig.typography.fontSizeSm, 
                  color: brandConfig.colors.neutralGray,
                  marginTop: '0.5rem'
                }}>
                  {testimonial.incidentDate}
                  {testimonial.vetCostSaved && (
                    <span style={{ 
                      marginLeft: '1rem',
                      color: brandConfig.colors.successGreen,
                      fontWeight: brandConfig.typography.weightSemiBold 
                    }}>
                      Saved: {formatCurrency(testimonial.vetCostSaved)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedTab === 'implementation' && (
        <div style={styles.section}>
          <div style={styles.sectionContent}>
            <h2 style={styles.sectionTitle}>Implementation Success</h2>
            <div style={{
              backgroundColor: brandConfig.colors.hunterGreen,
              color: brandConfig.colors.arenaSand,
              padding: '3rem',
              borderRadius: brandConfig.layout.borderRadius,
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: brandConfig.typography.fontSize2xl, marginBottom: '2rem' }}>
                From Trial to Success in 90 Days
              </h3>
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div>
                  <div style={{ fontSize: brandConfig.typography.fontSize3xl, fontWeight: brandConfig.typography.weightBold }}>30</div>
                  <div>Days Trial Period</div>
                </div>
                <div>
                  <div style={{ fontSize: brandConfig.typography.fontSize3xl, fontWeight: brandConfig.typography.weightBold }}>96%</div>
                  <div>Client Adoption Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: brandConfig.typography.fontSize3xl, fontWeight: brandConfig.typography.weightBold }}>$4,800</div>
                  <div>First Month Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.sectionContent}>
          <h2 style={{
            fontSize: brandConfig.typography.fontSize3xl,
            fontWeight: brandConfig.typography.weightBold,
            marginBottom: '1rem',
          }}>
            {config.contact.title}
          </h2>
          <p style={{
            fontSize: brandConfig.typography.fontSizeXl,
            marginBottom: '2rem',
            opacity: 0.9,
          }}>
            {config.contact.subtitle}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem',
          }}>
            <div>
              <ContactIcon sx={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
              <div>{config.contact.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
              <div>{config.contact.email}</div>
            </div>
          </div>
          
          <button 
            style={styles.ctaButton}
            onClick={() => window.open(config.contact.calendlyLink, '_blank')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
          >
            Schedule Partnership Discovery Call
          </button>
        </div>
      </section>
    </div>
  );
}; 