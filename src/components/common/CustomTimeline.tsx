import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { brandConfig } from '../../config/brandConfig';

interface ITimelineEvent {
  year: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ICustomTimelineProps {
  events: ITimelineEvent[];
  getIcon?: (year: string) => React.ReactNode;
}

export const CustomTimeline: React.FC<ICustomTimelineProps> = ({ events, getIcon }) => {
  return (
    <Box sx={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
      {/* Timeline Line */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: brandConfig.colors.sterlingSilver,
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      />
      
      {events.map((event, index) => (
        <Box
          key={event.year}
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            mb: 6,
            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
          }}
        >
          {/* Year Label */}
          <Box
            sx={{
              flex: '0 0 40%',
              display: 'flex',
              justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
              pr: index % 2 === 0 ? 4 : 0,
              pl: index % 2 === 0 ? 0 : 4,
            }}
          >
            <Typography
              sx={{
                fontSize: '2rem',
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.championGold,
                fontFamily: 'Bebas Neue, display',
              }}
            >
              {event.year}
            </Typography>
          </Box>
          
          {/* Timeline Dot */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 48,
              height: 48,
              backgroundColor: brandConfig.colors.stableMahogany,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            {getIcon ? getIcon(event.year) : event.icon}
          </Box>
          
          {/* Event Content */}
          <Box
            sx={{
              flex: '0 0 40%',
              display: 'flex',
              justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
              pl: index % 2 === 0 ? 4 : 0,
              pr: index % 2 === 0 ? 0 : 4,
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{ width: '100%', maxWidth: '320px' }}
            >
              <Card
                sx={{
                  background: brandConfig.gradients.statusCard,
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeXl,
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      mb: 1,
                    }}
                  >
                    {event.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeBase,
                      color: brandConfig.colors.textSecondary,
                      lineHeight: brandConfig.typography.lineHeightRelaxed,
                    }}
                  >
                    {event.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>
      ))}
    </Box>
  );
}; 