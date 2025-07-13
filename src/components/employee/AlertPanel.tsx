import React, { useState } from 'react';
import { Alert, AlertTitle, Box, IconButton, Collapse } from '@mui/material';
import { Close } from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import type { IAlert } from '../../interfaces/EmployeeTypes';

interface IAlertPanelProps {
  alerts: IAlert[];
  onAlertDismiss?: (alertId: string) => void;
}

export const AlertPanel: React.FC<IAlertPanelProps> = ({ alerts, onAlertDismiss }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    
    if (onAlertDismiss) {
      onAlertDismiss(alertId);
    }
  };

  const getSeverityColor = (type: IAlert['type']) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const styles = {
    alertContainer: {
      marginBottom: '1rem'
    },
    alertContent: {
      fontFamily: brandConfig.typography.fontSecondary,
      fontSize: brandConfig.typography.fontSizeBase,
      lineHeight: brandConfig.typography.lineHeightNormal
    },
    alertTitle: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontWeight: brandConfig.typography.weightSemiBold,
      marginBottom: '0.5rem'
    }
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ marginBottom: 2 }}>
      {visibleAlerts.map((alert) => (
        <Collapse key={alert.id} in={!dismissedAlerts.has(alert.id)}>
          <Alert
            severity={getSeverityColor(alert.type)}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => handleDismiss(alert.id)}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={styles.alertContainer}
          >
            <AlertTitle sx={styles.alertTitle}>
              {alert.title}
            </AlertTitle>
            <Box sx={styles.alertContent}>
              {alert.content}
              {alert.timestamp && (
                <Box sx={{ 
                  marginTop: '0.5rem', 
                  fontSize: brandConfig.typography.fontSizeXs,
                  opacity: 0.8 
                }}>
                  {alert.timestamp}
                </Box>
              )}
            </Box>
          </Alert>
        </Collapse>
      ))}
    </Box>
  );
}; 