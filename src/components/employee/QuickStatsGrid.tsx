import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';
import { dashboardConfig } from '../../config/employeeDashboardData';
import type { IQuickStat } from '../../interfaces/EmployeeTypes';

interface IQuickStatsGridProps {
  stats: IQuickStat[];
  onStatClick?: (statId: string) => void;
}

export const QuickStatsGrid: React.FC<IQuickStatsGridProps> = ({ stats, onStatClick }) => {
  const getTooltipText = (statId: string) => {
    return dashboardConfig.tooltips[statId as keyof typeof dashboardConfig.tooltips] || dashboardConfig.tooltips.default;
  };
  const styles = {
    statCard: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}, ${brandConfig.colors.sterlingSilver}30)`,
      border: `2px solid ${brandConfig.colors.stableMahogany}60`,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}25`,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
              '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${brandConfig.colors.stableMahogany}40`,
          border: `2px solid ${brandConfig.colors.successGreen}`,
          '& .stat-number': {
            color: brandConfig.colors.successGreen,
          }
        }
    },
    statNumber: {
      fontSize: brandConfig.typography.fontSize4xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontDisplay,
      marginBottom: '0.5rem',
      textAlign: 'center',
      textShadow: `0 2px 4px ${brandConfig.colors.stableMahogany}20`
    },
    statLabel: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.hunterGreen,
      fontFamily: brandConfig.typography.fontSecondary,
      fontWeight: brandConfig.typography.weightSemiBold,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }
  };

  return (
    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.id}>
          <Tooltip 
            title={getTooltipText(stat.id)}
            placement="top"
            arrow
          >
            <Card 
              sx={styles.statCard}
              onClick={() => onStatClick && onStatClick(stat.id)}
            >
              <CardContent sx={{ textAlign: 'center', padding: '1.5rem' }}>
                <Typography 
                  variant="h2" 
                  component="div" 
                  className="stat-number"
                  sx={styles.statNumber}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={styles.statLabel}
                >
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
}; 