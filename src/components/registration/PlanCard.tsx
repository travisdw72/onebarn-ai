import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { brandConfig } from '../../config/brandConfig';
import { IPlan } from '../../interfaces/RegistrationTypes';

interface IPlanCardProps {
  plan: IPlan;
  selected: boolean;
  onSelect: (planId: string) => void;
  horseCount: number;
  billingCycle: 'monthly' | 'annual';
}

export const PlanCard: React.FC<IPlanCardProps> = ({
  plan,
  selected,
  onSelect,
  horseCount,
  billingCycle
}) => {
  const getDisplayPrice = () => {
    let basePrice = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly;
    
    if (horseCount > plan.horses.included) {
      const additionalHorses = horseCount - plan.horses.included;
      basePrice += additionalHorses * plan.horses.additional;
    }
    
    return basePrice;
  };

  const getSavings = () => {
    if (billingCycle === 'annual') {
      const monthlyTotal = getDisplayPrice() / (1 - 0.15); // Reverse the 15% discount
      const annualTotal = getDisplayPrice() * 12;
      return Math.round(monthlyTotal * 12 - annualTotal);
    }
    return 0;
  };

  const styles = {
    card: {
      height: '100%',
      position: 'relative' as const,
      border: selected 
        ? `3px solid ${brandConfig.colors.championGold}` 
        : `1px solid ${brandConfig.colors.neutralGray}`,
      borderRadius: brandConfig.layout.borderRadius,
      backgroundColor: selected ? brandConfig.colors.surface : brandConfig.colors.barnWhite,
      boxShadow: selected ? brandConfig.layout.boxShadow : 'none',
      transition: brandConfig.animations.transitions.smooth,
      cursor: 'pointer',
      '&:hover': {
        boxShadow: brandConfig.layout.boxShadow,
        transform: 'translateY(-2px)'
      }
    },
    popularBadge: {
      position: 'absolute' as const,
      top: brandConfig.spacing.md,
      right: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.championGold,
      color: brandConfig.colors.barnWhite,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSizeXs
    },
    planName: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.xs
    },
    planSubtitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.textSecondary,
      marginBottom: brandConfig.spacing.md
    },
    priceContainer: {
      textAlign: 'center' as const,
      marginBottom: brandConfig.spacing.lg,
      padding: brandConfig.spacing.md,
      backgroundColor: selected ? brandConfig.colors.barnWhite : brandConfig.colors.surface,
      borderRadius: brandConfig.layout.borderRadius
    },
    price: {
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany
    },
    priceUnit: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.textSecondary,
      fontWeight: brandConfig.typography.weightRegular
    },
    savings: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.successGreen,
      fontWeight: brandConfig.typography.weightBold,
      marginTop: brandConfig.spacing.xs
    },
    horseInfo: {
      textAlign: 'center' as const,
      marginBottom: brandConfig.spacing.md,
      padding: brandConfig.spacing.sm,
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.layout.borderRadius
    },
    horseText: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.textSecondary
    },
    featuresList: {
      marginBottom: brandConfig.spacing.lg
    },
    featureItem: {
      paddingY: brandConfig.spacing.xs,
      paddingX: 0
    },
    featureIcon: {
      color: brandConfig.colors.successGreen,
      minWidth: '32px'
    },
    featureText: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.text
    },
    selectButton: {
      backgroundColor: selected 
        ? brandConfig.colors.championGold 
        : brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      fontWeight: brandConfig.typography.weightBold,
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.lg}`,
      width: '100%',
      '&:hover': {
        backgroundColor: selected 
          ? brandConfig.colors.championGold 
          : brandConfig.colors.stableMahoganyDark
      }
    },
    storage: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.textSecondary,
      marginTop: brandConfig.spacing.xs,
      textAlign: 'center' as const
    }
  };

  return (
    <Card sx={styles.card} onClick={() => onSelect(plan.id)}>
      {plan.popular && (
        <Chip 
          label="Most Popular" 
          icon={<StarIcon />}
          sx={styles.popularBadge}
        />
      )}
      
      <CardContent>
        <Typography sx={styles.planName}>
          {plan.displayName}
        </Typography>
        
        <Typography sx={styles.planSubtitle}>
          {plan.subtitle}
        </Typography>

        <Box sx={styles.priceContainer}>
          <Typography sx={styles.price}>
            ${getDisplayPrice()}
            <Typography component="span" sx={styles.priceUnit}>
              /{billingCycle === 'annual' ? 'month' : 'month'}
            </Typography>
          </Typography>
          
          {billingCycle === 'annual' && (
            <Typography sx={styles.savings}>
              Save ${getSavings()}/year
            </Typography>
          )}
        </Box>

        <Box sx={styles.horseInfo}>
          <Typography sx={styles.horseText}>
            {horseCount <= plan.horses.included 
              ? `Includes up to ${plan.horses.included} horses`
              : `${plan.horses.included} horses included + ${horseCount - plan.horses.included} additional`
            }
          </Typography>
          <Typography sx={styles.storage}>
            {plan.storage} video storage • {plan.cameras.included} cameras included
          </Typography>
        </Box>

        <List sx={styles.featuresList}>
          {plan.features.map((feature, index) => (
            <ListItem key={index} sx={styles.featureItem}>
              <ListItemIcon sx={styles.featureIcon}>
                <CheckCircleIcon />
              </ListItemIcon>
              <ListItemText 
                primary={feature}
                primaryTypographyProps={{ sx: styles.featureText }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>

      <CardActions sx={{ padding: brandConfig.spacing.md }}>
        <Button 
          variant="contained"
          sx={styles.selectButton}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(plan.id);
          }}
        >
          {selected ? 'Selected' : 'Select Plan'}
        </Button>
      </CardActions>
    </Card>
  );
}; 