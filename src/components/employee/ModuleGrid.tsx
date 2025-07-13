import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { Lock, LockOpen, Warning } from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { dashboardConfig } from '../../config/employeeDashboardData';
import type { IModule } from '../../interfaces/EmployeeTypes';

interface IModuleGridProps {
  modules: IModule[];
  onModuleClick?: (moduleId: string) => void;
}

export const ModuleGrid: React.FC<IModuleGridProps> = ({ modules, onModuleClick }) => {
  const getPermissionConfig = (permission: 'full' | 'limited' | 'none') => {
    switch (permission) {
      case 'full':
        return {
          label: dashboardConfig.permissions.full,
          color: brandConfig.colors.successGreen,
          icon: <LockOpen sx={{ fontSize: '1rem' }} />
        };
      case 'limited':
        return {
          label: dashboardConfig.permissions.limited,
          color: brandConfig.colors.alertAmber,
          icon: <Warning sx={{ fontSize: '1rem' }} />
        };
      case 'none':
        return {
          label: dashboardConfig.permissions.none,
          color: brandConfig.colors.sterlingSilver,
          icon: <Lock sx={{ fontSize: '1rem' }} />
        };
      default:
        return {
          label: dashboardConfig.permissions.unknown,
          color: brandConfig.colors.sterlingSilver,
          icon: <Lock sx={{ fontSize: '1rem' }} />
        };
    }
  };

  const styles = {
    moduleCard: {
      minHeight: '200px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: `1px solid ${brandConfig.colors.sterlingSilver}30`,
      borderRadius: brandConfig.layout.borderRadius,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 24px ${brandConfig.colors.stableMahogany}15`,
      }
    },
    moduleCardDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      '&:hover': {
        transform: 'none',
        boxShadow: 'none',
      }
    },
    moduleIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    moduleTitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary,
      textAlign: 'center',
      marginBottom: '0.5rem'
    },
    moduleDescription: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.hunterGreen,
      fontFamily: brandConfig.typography.fontSecondary,
      textAlign: 'center',
      lineHeight: brandConfig.typography.lineHeightNormal,
      marginBottom: '1rem'
    },
    permissionChip: {
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSizeXs,
      marginTop: '0.5rem'
    }
  };

  const handleModuleClick = (module: IModule) => {
    if (module.disabled) {
      alert(dashboardConfig.messages.accessDenied);
      return;
    }
    
    if (onModuleClick) {
      onModuleClick(module.id);
    } else {
      console.log('Opening module:', module.title);
    }
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 2 }}>
      {modules.map((module) => {
        const permissionConfig = getPermissionConfig(module.permission);
        
        return (
          <Grid item xs={12} sm={6} md={3} key={module.id}>
            <Card
              sx={{
                ...styles.moduleCard,
                ...(module.disabled && styles.moduleCardDisabled),
                background: module.disabled 
                  ? `linear-gradient(135deg, ${brandConfig.colors.sterlingSilver}10, ${brandConfig.colors.sterlingSilver}05)`
                  : `linear-gradient(135deg, ${brandConfig.colors.arenaSand}10, ${brandConfig.colors.hunterGreen}05)`
              }}
              onClick={() => handleModuleClick(module)}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '1.5rem',
                height: '100%'
              }}>
                <Box sx={styles.moduleIcon}>
                  {module.icon}
                </Box>
                
                <Typography sx={styles.moduleTitle}>
                  {module.title}
                </Typography>
                
                <Typography sx={styles.moduleDescription}>
                  {module.description}
                </Typography>
                
                <Chip
                  icon={permissionConfig.icon}
                  label={permissionConfig.label}
                  size="small"
                  sx={{
                    ...styles.permissionChip,
                    backgroundColor: permissionConfig.color,
                    color: 'white',
                    marginTop: 'auto'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}; 