import React from 'react';
import { Card, CardContent, CardHeader, Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Schedule, CalendarToday } from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { dashboardConfig } from '../../config/employeeDashboardData';
import type { IScheduleItem } from '../../interfaces/EmployeeTypes';

interface ISchedulePanelProps {
  schedule: IScheduleItem[];
  title?: string;
  onViewFullSchedule?: () => void;
}

export const SchedulePanel: React.FC<ISchedulePanelProps> = ({ 
  schedule, 
  title = dashboardConfig.headers.todaysSchedule,
  onViewFullSchedule 
}) => {
  const styles = {
    scheduleCard: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}08, ${brandConfig.colors.hunterGreen}08)`,
      border: `1px solid ${brandConfig.colors.sterlingSilver}30`,
      borderRadius: brandConfig.layout.borderRadius,
      height: '100%'
    },
    scheduleItem: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}10, ${brandConfig.colors.sterlingSilver}05)`,
      border: `1px solid ${brandConfig.colors.sterlingSilver}20`,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '0.5rem',
      padding: '1rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateX(4px)',
        boxShadow: `0 4px 12px ${brandConfig.colors.hunterGreen}15`,
      }
    },
    scheduleTitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary,
      marginBottom: '0.3rem'
    },
    scheduleClient: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.hunterGreen,
      fontFamily: brandConfig.typography.fontSecondary,
      fontWeight: brandConfig.typography.weightMedium
    },
    scheduleDescription: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.hunterGreen,
      fontFamily: brandConfig.typography.fontSecondary
    },
    scheduleTime: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.successGreen,
      fontFamily: brandConfig.typography.fontDisplay
    },
    fullScheduleButton: {
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontSecondary,
      fontWeight: brandConfig.typography.weightMedium,
      '&:hover': {
        backgroundColor: brandConfig.colors.infoBlue,
      }
    }
  };

  return (
    <Card sx={styles.scheduleCard}>
      <CardHeader
        title={title}
        titleTypographyProps={{
          fontSize: brandConfig.typography.fontSizeXl,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.stableMahogany,
          fontFamily: brandConfig.typography.fontPrimary
        }}
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<CalendarToday />}
            sx={styles.fullScheduleButton}
            onClick={onViewFullSchedule}
          >
            {dashboardConfig.buttons.fullSchedule}
          </Button>
        }
      />
      <CardContent>
        <List disablePadding>
          {schedule.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem
                sx={styles.scheduleItem}
                onClick={() => console.log('Schedule item clicked:', item.title)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={styles.scheduleTitle}>
                          {item.title}
                        </Typography>
                        <Typography sx={styles.scheduleClient}>
                          {item.client} • {item.description}
                        </Typography>
                      </Box>
                      <Typography sx={styles.scheduleTime}>
                        {item.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < schedule.length - 1 && (
                <Divider sx={{ margin: '0.5rem 0', opacity: 0.3 }} />
              )}
            </React.Fragment>
          ))}
        </List>
        
        {schedule.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: brandConfig.colors.hunterGreen
          }}>
            <Schedule sx={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <Typography variant="h6" sx={{ fontFamily: brandConfig.typography.fontSecondary }}>
              {dashboardConfig.messages.noScheduledSessions}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 