import React from 'react';
import { Box, Button, Typography, Avatar, Chip } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';
import { dashboardConfig } from '../../config/employeeDashboardData';
import type { IEmployeeRole } from '../../interfaces/EmployeeTypes';

interface IRoleSelectorProps {
  roles: IEmployeeRole[];
  activeRole: string;
  onRoleChange: (roleId: string) => void;
}

export const RoleSelector: React.FC<IRoleSelectorProps> = ({ 
  roles, 
  activeRole, 
  onRoleChange 
}) => {
  const styles = {
    container: {
      marginBottom: '2rem',
      padding: '1.5rem',
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}, ${brandConfig.colors.sterlingSilver}40)`,
      borderRadius: brandConfig.layout.borderRadius,
      border: `2px solid ${brandConfig.colors.stableMahogany}60`,
      boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}20`
    },
    welcomeHeader: {
      marginBottom: '1.5rem'
    },
    welcomeTitle: {
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontDisplay,
      marginBottom: '0.5rem'
    },
    welcomeSubtitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontSecondary,
      fontWeight: brandConfig.typography.weightMedium
    },
    roleButtonsContainer: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
      marginTop: '1rem'
    },
    roleButton: {
      padding: '0.8rem 1.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      backgroundColor: brandConfig.colors.arenaSand,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontSecondary,
      fontWeight: brandConfig.typography.weightSemiBold,
      fontSize: brandConfig.typography.fontSizeBase,
      transition: 'all 0.3s ease',
      textTransform: 'none',
      minWidth: '180px',
      boxShadow: `0 2px 6px ${brandConfig.colors.stableMahogany}30`,
      '&:hover': {
        backgroundColor: brandConfig.colors.hunterGreen,
        borderColor: brandConfig.colors.hunterGreen,
        color: brandConfig.colors.arenaSand,
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${brandConfig.colors.hunterGreen}40`,
      }
    },
    roleButtonActive: {
      backgroundColor: brandConfig.colors.stableMahogany,
      borderColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}50`,
      transform: 'translateY(-1px)',
      '&:hover': {
        backgroundColor: brandConfig.colors.stableMahogany,
        borderColor: brandConfig.colors.stableMahogany,
        color: brandConfig.colors.arenaSand,
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 16px ${brandConfig.colors.stableMahogany}60`,
      }
    },
    userProfileContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '1rem',
      padding: '1rem',
      background: `linear-gradient(135deg, ${brandConfig.colors.hunterGreen}80, ${brandConfig.colors.stableMahogany}60)`,
      borderRadius: brandConfig.layout.borderRadius,
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      boxShadow: `0 3px 8px ${brandConfig.colors.stableMahogany}30`
    },
    userAvatar: {
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold,
      width: '48px',
      height: '48px'
    },
    userInfo: {
      flex: 1
    },
    userName: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontPrimary
    },
    userTitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontSecondary,
      opacity: 0.9
    },
    roleBadge: {
      backgroundColor: brandConfig.colors.successGreen,
      color: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontSecondary,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSizeXs,
      padding: '0.5rem 1rem'
    }
  };

  const activeRoleData = roles.find(role => role.id === activeRole);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.welcomeHeader}>
        <Typography sx={styles.welcomeTitle}>
          {dashboardConfig.welcome.title}
        </Typography>
        <Typography sx={styles.welcomeSubtitle}>
          {dashboardConfig.welcome.subtitle}
        </Typography>
        
        <Box sx={styles.roleButtonsContainer}>
          {roles.map((role) => (
            <Button
              key={role.id}
              variant="outlined"
              startIcon={<span style={{ fontSize: '1.2rem' }}>{role.icon}</span>}
              sx={{
                ...styles.roleButton,
                ...(activeRole === role.id && styles.roleButtonActive)
              }}
              onClick={() => onRoleChange(role.id)}
            >
              {role.displayName}
            </Button>
          ))}
        </Box>
      </Box>

      {activeRoleData && (
        <Box sx={styles.userProfileContainer}>
          <Avatar sx={styles.userAvatar}>
            {activeRoleData.user.avatar}
          </Avatar>
          <Box sx={styles.userInfo}>
            <Typography sx={styles.userName}>
              {activeRoleData.user.name}
            </Typography>
            <Typography sx={styles.userTitle}>
              {activeRoleData.user.title}
            </Typography>
          </Box>
          <Chip
            label={activeRoleData.badge}
            sx={styles.roleBadge}
          />
        </Box>
      )}
    </Box>
  );
}; 