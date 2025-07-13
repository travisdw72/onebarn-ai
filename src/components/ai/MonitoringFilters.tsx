/**
 * Monitoring Filters Component
 * Filter controls for AI monitoring dashboard
 * 
 * @description Configuration-driven filter component for AI monitoring
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Stack,
  Typography
} from '@mui/material';
import {
  FilterList,
  Clear,
  Update
} from '@mui/icons-material';

// Configuration imports
import { brandConfig } from '../../config/brandConfig';
import { aiMonitorConfig } from '../../config/aiMonitorConfig';

interface IMonitoringFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
  onReset: () => void;
  compactMode?: boolean;
}

export const MonitoringFilters: React.FC<IMonitoringFiltersProps> = ({
  filters,
  onChange,
  onReset,
  compactMode = false
}) => {
  const handleFilterChange = (key: string, value: any) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  const styles = {
    container: {
      padding: compactMode ? brandConfig.spacing.sm : brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
    },
    filterControl: {
      minWidth: '200px',
      marginBottom: compactMode ? brandConfig.spacing.sm : brandConfig.spacing.md,
    },
    actionButtons: {
      display: 'flex',
      gap: brandConfig.spacing.sm,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    resetButton: {
      color: brandConfig.colors.sterlingSilver,
      borderColor: brandConfig.colors.sterlingSilver,
    },
    applyButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography
        variant="h6"
        sx={{
          marginBottom: brandConfig.spacing.md,
          color: brandConfig.colors.stableMahogany,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
        }}
      >
        Filter Options
      </Typography>

      <Grid container spacing={2}>
        {/* Severity Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth sx={styles.filterControl}>
            <InputLabel>Severity</InputLabel>
            <Select
              value={filters.severity || 'all'}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              label="Severity"
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Time Range Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth sx={styles.filterControl}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={filters.timeRange || '24h'}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              label="Time Range"
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last Week</MenuItem>
              <MenuItem value="30d">Last Month</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth sx={styles.filterControl}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category || 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="behavior">Behavior</MenuItem>
              <MenuItem value="safety">Safety</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth sx={styles.filterControl}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="acknowledged">Acknowledged</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Horse Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Horse Name"
            value={filters.horseName || ''}
            onChange={(e) => handleFilterChange('horseName', e.target.value)}
            sx={styles.filterControl}
          />
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={styles.actionButtons}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={onReset}
              sx={styles.resetButton}
            >
              Reset Filters
            </Button>
            <Button
              variant="contained"
              startIcon={<Update />}
              onClick={() => onChange(filters)}
              sx={styles.applyButton}
            >
              Apply Filters
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Active Filters Display */}
      {Object.keys(filters).length > 0 && (
        <Box sx={{ marginTop: brandConfig.spacing.md }}>
          <Typography variant="body2" sx={{ marginBottom: brandConfig.spacing.sm }}>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Object.entries(filters).map(([key, value]) => {
              if (value && value !== 'all') {
                return (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    size="small"
                    onDelete={() => handleFilterChange(key, 'all')}
                    sx={{
                      backgroundColor: brandConfig.colors.stableMahogany,
                      color: brandConfig.colors.barnWhite,
                    }}
                  />
                );
              }
              return null;
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}; 