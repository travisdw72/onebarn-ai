// Chat Integration Component for Support Tabs
// Elegant, subtle design that integrates seamlessly with existing support interfaces

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Grid,
  Fade,
  Collapse
} from '@mui/material';
import {
  Chat as ChatIcon,
  SmartToy as AIIcon,
  SupportAgent as AgentIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { LiveChatWidget } from '../chat/LiveChatWidget';

interface IChatIntegrationProps {
  title?: string;
  description?: string;
  showWidget?: boolean;
  chatType?: 'ai_with_escalation' | 'ai_only' | 'live_agent';
}

export const ChatIntegration: React.FC<IChatIntegrationProps> = ({
  title = "Need Help?",
  description = "Get instant support or connect with our team",
  showWidget = true,
  chatType = 'ai_with_escalation'
}) => {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const chatOptions = [
    {
      id: 'ai_with_escalation',
      title: 'AI Assistant',
      description: 'Instant answers with human backup',
      icon: <AIIcon />,
      color: brandConfig.colors.ribbonBlue,
      features: ['Instant responses', 'Smart escalation', '24/7 available'],
      recommended: true
    },
    {
      id: 'live_agent',
      title: 'Live Support',
      description: 'Direct connection to our team',
      icon: <AgentIcon />,
      color: brandConfig.colors.hunterGreen,
      features: ['Human expertise', 'Complex issues', 'Personal touch'],
      recommended: false
    }
  ];

  const styles = {
    container: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: '12px',
      padding: brandConfig.spacing.lg,
      marginBottom: brandConfig.spacing.lg,
      border: `1px solid ${brandConfig.colors.sterlingSilver}20`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.3s ease'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: brandConfig.spacing.md
    },
    title: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.midnightBlack,
      margin: 0
    },
    description: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.neutralGray,
      margin: 0
    },
    quickActions: {
      display: 'flex',
      gap: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.md,
      flexWrap: 'wrap' as const
    },
    primaryButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.lg}`,
      borderRadius: '8px',
      border: 'none',
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightMedium,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: brandConfig.colors.hunterGreen,
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: brandConfig.colors.neutralGray,
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
      borderRadius: '8px',
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: `${brandConfig.colors.ribbonBlue}08`,
        borderColor: brandConfig.colors.ribbonBlue,
        color: brandConfig.colors.ribbonBlue
      }
    },
    detailsSection: {
      backgroundColor: `${brandConfig.colors.arenaSand}30`,
      borderRadius: '8px',
      padding: brandConfig.spacing.md,
      marginTop: brandConfig.spacing.md
    },
    optionCard: {
      backgroundColor: brandConfig.colors.barnWhite,
      border: `1px solid ${brandConfig.colors.sterlingSilver}40`,
      borderRadius: '8px',
      padding: brandConfig.spacing.md,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      '&:hover': {
        borderColor: brandConfig.colors.ribbonBlue,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }
    },
    recommendedBadge: {
      backgroundColor: brandConfig.colors.victoryRose,
      color: brandConfig.colors.barnWhite,
      fontSize: '0.7rem',
      fontWeight: 'bold',
      padding: '2px 6px',
      borderRadius: '4px',
      alignSelf: 'flex-start' as const
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      margin: `${brandConfig.spacing.sm} 0 0 0`,
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray
    },
    featureItem: {
      marginBottom: brandConfig.spacing.xs,
      '&:before': {
        content: '"✓"',
        color: brandConfig.colors.successGreen,
        fontWeight: 'bold',
        marginRight: brandConfig.spacing.xs
      }
    },
    securityNote: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray,
      marginTop: brandConfig.spacing.md,
      padding: brandConfig.spacing.sm,
      backgroundColor: `${brandConfig.colors.successGreen}08`,
      borderRadius: '6px',
      border: `1px solid ${brandConfig.colors.successGreen}20`
    }
  };

  const handleChatStart = (type: string) => {
    setWidgetOpen(true);
    // The LiveChatWidget will handle the chat type
  };

  return (
    <>
      <Box sx={styles.container}>
        {/* Elegant Header */}
        <Box sx={styles.header}>
          <Box>
            <Typography sx={styles.title}>
              {title}
            </Typography>
            <Typography sx={styles.description}>
              {description}
            </Typography>
          </Box>
          <ChatIcon sx={{ 
            fontSize: '1.5rem', 
            color: brandConfig.colors.ribbonBlue,
            opacity: 0.7
          }} />
        </Box>

        {/* Quick Action Buttons */}
        <Box sx={styles.quickActions}>
          <button
            style={styles.primaryButton}
            onClick={() => handleChatStart('ai_with_escalation')}
          >
            <ChatIcon sx={{ fontSize: '1.1rem' }} />
            Start Chat
          </button>
          
          <button
            style={styles.secondaryButton}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <CollapseIcon sx={{ fontSize: '1rem' }} /> : <ExpandIcon sx={{ fontSize: '1rem' }} />}
            {showDetails ? 'Less Options' : 'More Options'}
          </button>
        </Box>

        {/* Expandable Details */}
        <Collapse in={showDetails}>
          <Box sx={styles.detailsSection}>
            <Typography variant="h6" sx={{ 
              fontSize: brandConfig.typography.fontSizeLg,
              fontWeight: brandConfig.typography.weightSemiBold,
              color: brandConfig.colors.midnightBlack,
              marginBottom: brandConfig.spacing.md
            }}>
              Choose Your Support Method
            </Typography>
            
            <Grid container spacing={2}>
              {chatOptions.map((option) => (
                <Grid item xs={12} sm={6} key={option.id}>
                  <Box
                    sx={styles.optionCard}
                    onClick={() => handleChatStart(option.id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ color: option.color, fontSize: '1.5rem' }}>
                        {option.icon}
                      </Box>
                      {option.recommended && (
                        <Box sx={styles.recommendedBadge}>
                          RECOMMENDED
                        </Box>
                      )}
                    </Box>
                    
                    <Typography variant="h6" sx={{ 
                      fontWeight: brandConfig.typography.weightSemiBold,
                      color: brandConfig.colors.midnightBlack,
                      marginBottom: brandConfig.spacing.xs,
                      fontSize: brandConfig.typography.fontSizeBase
                    }}>
                      {option.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{
                      color: brandConfig.colors.neutralGray,
                      marginBottom: brandConfig.spacing.sm,
                      fontSize: brandConfig.typography.fontSizeSm
                    }}>
                      {option.description}
                    </Typography>
                    
                    <ul style={styles.featureList}>
                      {option.features.map((feature, index) => (
                        <li key={index} style={styles.featureItem}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Security Note */}
            <Box sx={styles.securityNote}>
              <SecurityIcon sx={{ fontSize: '1rem', color: brandConfig.colors.successGreen }} />
              <Typography variant="caption">
                HIPAA compliant • End-to-end encrypted • Available 24/7
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Live Chat Widget */}
      {showWidget && (
        <LiveChatWidget 
          chatType={chatType}
          initialMessage="Hello! I need help with something."
        />
      )}
    </>
  );
};

export default ChatIntegration; 