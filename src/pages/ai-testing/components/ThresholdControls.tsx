/**
 * ⚙️ Threshold Controls Component
 * Real-time threshold adjustment interface for AI optimization filters
 * Includes preset management and configuration export/import
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  ButtonGroup,
  Tooltip,
  Divider,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  RestartAlt as ResetIcon,
  Save as SaveIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  Info as InfoIcon,
  Tune as TuneIcon
} from '@mui/icons-material';

import { brandConfig } from '../../../config/brandConfig';
import { aiTestingData } from '../../../config/aiTestingData';
import type { 
  IThresholdControlsProps, 
  IThresholdSliderProps,
  IThresholdValues 
} from '../../../interfaces/AITestingTypes';

// Individual threshold slider component
const ThresholdSlider: React.FC<IThresholdSliderProps> = ({
  label,
  description,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  disabled = false,
  tooltip
}) => {
  const styles = {
    sliderContainer: {
      marginBottom: brandConfig.spacing.lg,
      opacity: disabled ? 0.6 : 1
    },
    sliderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: brandConfig.spacing.sm
    },
    sliderLabel: {
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.stableMahogany,
      fontSize: brandConfig.typography.fontSizeBase
    },
    sliderValue: {
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.ribbonBlue,
      fontSize: brandConfig.typography.fontSizeLg,
      minWidth: '50px',
      textAlign: 'right' as const
    },
    sliderDescription: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray,
      marginBottom: brandConfig.spacing.md
    },
    slider: {
      color: brandConfig.colors.stableMahogany,
      '& .MuiSlider-thumb': {
        backgroundColor: brandConfig.colors.ribbonBlue,
        '&:hover': {
          boxShadow: `0px 0px 0px 8px ${brandConfig.colors.ribbonBlue}25`
        }
      },
      '& .MuiSlider-track': {
        backgroundColor: brandConfig.colors.stableMahogany,
        border: 'none'
      },
      '& .MuiSlider-rail': {
        backgroundColor: brandConfig.colors.sterlingSilver
      }
    }
  };

  return (
    <Box sx={styles.sliderContainer}>
      <Box sx={styles.sliderHeader}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.xs }}>
          <Typography sx={styles.sliderLabel}>
            {label}
          </Typography>
          {tooltip && (
            <Tooltip title={tooltip}>
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Typography sx={styles.sliderValue}>
          {value}{unit}
        </Typography>
      </Box>
      
      <Typography sx={styles.sliderDescription}>
        {description}
      </Typography>
      
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(_, newValue) => onChange(newValue as number)}
        disabled={disabled}
        sx={styles.slider}
        valueLabelDisplay="auto"
        valueLabelFormat={(val) => `${val}${unit}`}
      />
    </Box>
  );
};

export const ThresholdControls: React.FC<IThresholdControlsProps> = ({
  values,
  onChange,
  onPresetSelect,
  onReset,
  onSave,
  onExport,
  onImport,
  disabled = false
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  // Handle individual threshold changes
  const handleThresholdChange = useCallback((key: keyof IThresholdValues, value: number) => {
    const newValues = { ...values, [key]: value };
    onChange(newValues);
    setSelectedPreset(null); // Clear preset selection when manually adjusting
  }, [values, onChange]);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: 'conservative' | 'balanced' | 'aggressive') => {
    setSelectedPreset(preset);
    onPresetSelect(preset);
  }, [onPresetSelect]);

  // Handle menu operations
  const handleMenuClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  // Handle file import
  const handleImportClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImport(file);
      }
    };
    input.click();
    handleMenuClose();
  }, [onImport, handleMenuClose]);

  // Styles using brandConfig
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.lg
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: brandConfig.spacing.md
    },
    headerText: {
      color: brandConfig.colors.textSecondary,
      fontSize: brandConfig.typography.fontSizeSm
    },
    presetsSection: {
      marginBottom: brandConfig.spacing.lg
    },
    presetsTitle: {
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.sm
    },
    presetButtons: {
      display: 'flex',
      gap: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.md
    },
    presetButton: {
      flex: 1,
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
      textTransform: 'none' as const,
      fontWeight: brandConfig.typography.weightMedium
    },
    activePreset: {
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.barnWhite,
      '&:hover': {
        backgroundColor: '#3A5785'
      }
    },
    inactivePreset: {
      backgroundColor: brandConfig.colors.surface,
      color: brandConfig.colors.stableMahogany,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
      '&:hover': {
        backgroundColor: brandConfig.colors.arenaSand
      }
    },
    slidersSection: {
      flex: 1
    },
    actionsSection: {
      marginTop: brandConfig.spacing.lg,
      paddingTop: brandConfig.spacing.lg,
      borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`
    },
    actionButtons: {
      display: 'flex',
      gap: brandConfig.spacing.sm,
      flexWrap: 'wrap' as const
    },
    actionButton: {
      textTransform: 'none' as const,
      fontWeight: brandConfig.typography.weightMedium,
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`
    },
    resetButton: {
      borderColor: brandConfig.colors.alertAmber,
      color: brandConfig.colors.alertAmber,
      '&:hover': {
        borderColor: brandConfig.colors.alertAmber,
        backgroundColor: `${brandConfig.colors.alertAmber}15`
      }
    },
    saveButton: {
      backgroundColor: brandConfig.colors.successGreen,
      color: brandConfig.colors.barnWhite,
      '&:hover': {
        backgroundColor: '#2E6B2F'
      }
    },
    exportButton: {
      borderColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.ribbonBlue,
      '&:hover': {
        borderColor: brandConfig.colors.ribbonBlue,
        backgroundColor: `${brandConfig.colors.ribbonBlue}15`
      }
    }
  };

  // Get preset configuration data
  const presets = aiTestingData.thresholdControls.presets.options;
  const sliderConfigs = aiTestingData.thresholdControls.sliders;

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Typography sx={styles.headerText}>
          {aiTestingData.thresholdControls.subtitle}
        </Typography>
        <Chip
          icon={<TuneIcon />}
          label={selectedPreset || 'Custom'}
          size="small"
          sx={{
            backgroundColor: selectedPreset 
              ? brandConfig.colors.ribbonBlue 
              : brandConfig.colors.neutralGray,
            color: brandConfig.colors.barnWhite
          }}
        />
      </Box>

      {/* Quick Presets Section */}
      <Box sx={styles.presetsSection}>
        <Typography sx={styles.presetsTitle}>
          {aiTestingData.thresholdControls.presets.title}
        </Typography>
        <Box sx={styles.presetButtons}>
          {presets.map((preset) => (
            <Button
              key={preset.key}
              variant="contained"
              onClick={() => handlePresetSelect(preset.key as any)}
              disabled={disabled}
              sx={{
                ...styles.presetButton,
                ...(selectedPreset === preset.key ? styles.activePreset : styles.inactivePreset)
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>
                  {preset.label}
                </Typography>
                <Typography variant="caption" component="div">
                  {preset.description}
                </Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </Box>

      <Divider />

      {/* Individual Threshold Sliders */}
      <Box sx={styles.slidersSection}>
        <ThresholdSlider
          label={sliderConfigs.imageQuality.label}
          description={sliderConfigs.imageQuality.description}
          value={values.imageQuality}
          min={sliderConfigs.imageQuality.min}
          max={sliderConfigs.imageQuality.max}
          step={sliderConfigs.imageQuality.step}
          unit={sliderConfigs.imageQuality.unit}
          onChange={(value) => handleThresholdChange('imageQuality', value)}
          disabled={disabled}
          tooltip={aiTestingData.tooltips.imageQuality}
        />

        <ThresholdSlider
          label={sliderConfigs.occupancy.label}
          description={sliderConfigs.occupancy.description}
          value={values.occupancy}
          min={sliderConfigs.occupancy.min}
          max={sliderConfigs.occupancy.max}
          step={sliderConfigs.occupancy.step}
          unit={sliderConfigs.occupancy.unit}
          onChange={(value) => handleThresholdChange('occupancy', value)}
          disabled={disabled}
          tooltip={aiTestingData.tooltips.occupancy}
        />

        <ThresholdSlider
          label={sliderConfigs.motion.label}
          description={sliderConfigs.motion.description}
          value={values.motion}
          min={sliderConfigs.motion.min}
          max={sliderConfigs.motion.max}
          step={sliderConfigs.motion.step}
          unit={sliderConfigs.motion.unit}
          onChange={(value) => handleThresholdChange('motion', value)}
          disabled={disabled}
          tooltip={aiTestingData.tooltips.motion}
        />

        <ThresholdSlider
          label={sliderConfigs.duplicate.label}
          description={sliderConfigs.duplicate.description}
          value={values.duplicate}
          min={sliderConfigs.duplicate.min}
          max={sliderConfigs.duplicate.max}
          step={sliderConfigs.duplicate.step}
          unit={sliderConfigs.duplicate.unit}
          onChange={(value) => handleThresholdChange('duplicate', value)}
          disabled={disabled}
          tooltip={aiTestingData.tooltips.duplicate}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={styles.actionsSection}>
        <Box sx={styles.actionButtons}>
          <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={onReset}
            disabled={disabled}
            sx={{ ...styles.actionButton, ...styles.resetButton }}
          >
            {aiTestingData.thresholdControls.actions.reset}
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={disabled}
            sx={{ ...styles.actionButton, ...styles.saveButton }}
          >
            {aiTestingData.thresholdControls.actions.save}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={onExport}
            disabled={disabled}
            sx={{ ...styles.actionButton, ...styles.exportButton }}
          >
            {aiTestingData.thresholdControls.actions.export}
          </Button>

          <Button
            variant="outlined"
            startIcon={<ImportIcon />}
            onClick={handleImportClick}
            disabled={disabled}
            sx={{ ...styles.actionButton, ...styles.exportButton }}
          >
            {aiTestingData.thresholdControls.actions.import}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}; 