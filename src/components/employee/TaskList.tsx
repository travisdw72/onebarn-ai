import React from 'react';
import { Card, CardContent, CardHeader, Box, Typography, Chip, IconButton } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { dashboardConfig } from '../../config/employeeDashboardData';
import type { ITask } from '../../interfaces/EmployeeTypes';

interface ITaskListProps {
  tasks: ITask[];
  onTaskComplete?: (taskId: string) => void;
}

export const TaskList: React.FC<ITaskListProps> = ({ tasks, onTaskComplete }) => {
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return brandConfig.colors.errorRed;
      case 'medium':
        return brandConfig.colors.alertAmber;
      case 'low':
        return brandConfig.colors.successGreen;
      default:
        return brandConfig.colors.sterlingSilver;
    }
  };

  const styles = {
    taskCard: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}10, ${brandConfig.colors.sterlingSilver}05)`,
      border: `1px solid ${brandConfig.colors.sterlingSilver}30`,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}15`,
      }
    },
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    taskTitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary
    },
    taskTime: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.hunterGreen,
      fontFamily: brandConfig.typography.fontSecondary
    },
    taskDescription: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.midnightBlack,
      fontFamily: brandConfig.typography.fontSecondary,
      lineHeight: brandConfig.typography.lineHeightNormal
    },
    priorityChip: {
      fontWeight: brandConfig.typography.weightMedium,
      fontSize: brandConfig.typography.fontSizeXs,
      textTransform: 'uppercase'
    }
  };

  return (
    <Card sx={{ marginBottom: 3 }}>
      <CardHeader 
        title={dashboardConfig.headers.priorityTasks}
        titleTypographyProps={{
          fontSize: brandConfig.typography.fontSizeXl,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.stableMahogany,
          fontFamily: brandConfig.typography.fontPrimary
        }}
        action={
          <IconButton>
            <CheckCircle sx={{ color: brandConfig.colors.successGreen }} />
          </IconButton>
        }
      />
      <CardContent>
        {tasks.map((task) => (
          <Box
            key={task.id}
            sx={{
              ...styles.taskCard,
              borderLeft: `4px solid ${getPriorityColor(task.priority)}`
            }}
          >
            <CardContent>
              <Box sx={styles.taskHeader}>
                <Typography sx={styles.taskTitle}>
                  {task.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={task.priority.toUpperCase()}
                    size="small"
                    sx={{
                      ...styles.priorityChip,
                      backgroundColor: getPriorityColor(task.priority),
                      color: 'white'
                    }}
                  />
                  <Typography sx={styles.taskTime}>
                    {dashboardConfig.messages.due} {task.dueDate} {task.dueTime && task.dueTime}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={styles.taskDescription}>
                {task.description}
              </Typography>
            </CardContent>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}; 