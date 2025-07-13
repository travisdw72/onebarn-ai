import { createTheme, ThemeOptions } from '@mui/material/styles';
import { brandConfig } from './brandConfig';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      equine: {
        colors: typeof brandConfig.colors;
        typography: typeof brandConfig.typography;
      };
    };
  }
  
  interface ThemeOptions {
    custom?: {
      equine?: {
        colors?: typeof brandConfig.colors;
        typography?: typeof brandConfig.typography;
      };
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: brandConfig.colors.stableMahogany,
      light: brandConfig.colors.chestnutGlow,
      dark: '#5A3124',
      contrastText: brandConfig.colors.arenaSand,
    },
    secondary: {
      main: brandConfig.colors.hunterGreen,
      light: brandConfig.colors.pastureSage,
      dark: '#1F3F23',
      contrastText: brandConfig.colors.arenaSand,
    },
    background: {
      default: brandConfig.colors.arenaSand,
      paper: '#FFFFFF',
    },
    text: {
      primary: brandConfig.colors.midnightBlack,
      secondary: brandConfig.colors.sterlingSilver,
    },
    success: {
      main: brandConfig.colors.successGreen,
    },
    warning: {
      main: brandConfig.colors.alertAmber,
    },
    error: {
      main: brandConfig.colors.errorRed,
    },
    info: {
      main: brandConfig.colors.infoBlue,
    },
  },
  typography: {
    fontFamily: brandConfig.typography.fontPrimary,
    h1: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize4xl,
      fontWeight: brandConfig.typography.weightBold,
      lineHeight: brandConfig.typography.lineHeightTight,
      color: brandConfig.colors.stableMahogany,
    },
    h2: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      lineHeight: brandConfig.typography.lineHeightTight,
      color: brandConfig.colors.stableMahogany,
    },
    h3: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightSemiBold,
      lineHeight: brandConfig.typography.lineHeightNormal,
    },
    h4: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightSemiBold,
      lineHeight: brandConfig.typography.lineHeightNormal,
    },
    h5: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightMedium,
      lineHeight: brandConfig.typography.lineHeightNormal,
    },
    h6: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightMedium,
      lineHeight: brandConfig.typography.lineHeightNormal,
    },
    body1: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightRegular,
      lineHeight: brandConfig.typography.lineHeightRelaxed,
    },
    body2: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightRegular,
      lineHeight: brandConfig.typography.lineHeightNormal,
    },
    button: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: parseInt(brandConfig.layout.borderRadius),
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: brandConfig.layout.borderRadius,
          textTransform: 'none',
          fontWeight: brandConfig.typography.weightSemiBold,
          fontSize: brandConfig.typography.fontSizeBase,
          minHeight: '48px', // Touch-friendly for mobile
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: brandConfig.layout.boxShadow,
          },
        },
        containedPrimary: {
          backgroundColor: brandConfig.colors.stableMahogany,
          color: brandConfig.colors.arenaSand,
          '&:hover': {
            backgroundColor: '#5A3124',
            borderColor: brandConfig.colors.championGold,
            borderWidth: '2px',
            borderStyle: 'solid',
          },
        },
        containedSecondary: {
          backgroundColor: brandConfig.colors.hunterGreen,
          color: brandConfig.colors.arenaSand,
          '&:hover': {
            backgroundColor: '#1F3F23',
          },
        },
        outlined: {
          borderColor: brandConfig.colors.stableMahogany,
          color: brandConfig.colors.stableMahogany,
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: brandConfig.colors.arenaSand,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderLeft: `4px solid ${brandConfig.colors.stableMahogany}`,
          borderRadius: brandConfig.layout.borderRadius,
          boxShadow: brandConfig.layout.boxShadow,
          '&:hover': {
            boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: brandConfig.layout.borderRadius,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: brandConfig.colors.sterlingSilver,
            },
            '&:hover fieldset': {
              borderColor: brandConfig.colors.stableMahogany,
            },
            '&.Mui-focused fieldset': {
              borderColor: brandConfig.colors.stableMahogany,
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: brandConfig.colors.midnightBlack,
            fontWeight: brandConfig.typography.weightMedium,
            '&.Mui-focused': {
              color: brandConfig.colors.stableMahogany,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandConfig.colors.midnightBlack,
          color: brandConfig.colors.arenaSand,
          boxShadow: brandConfig.layout.boxShadow,
          height: brandConfig.layout.headerHeight,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: brandConfig.layout.sidebarWidth,
          backgroundColor: brandConfig.colors.arenaSand,
          borderRight: `1px solid ${brandConfig.colors.sterlingSilver}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightMedium,
          fontSize: brandConfig.typography.fontSizeSm,
        },
      },
    },
  },
  custom: {
    equine: {
      colors: brandConfig.colors,
      typography: brandConfig.typography,
    },
  },
};

export const equineTheme = createTheme(themeOptions);

// Responsive theme adjustments for mobile-first design
export const responsiveTheme = createTheme({
  ...themeOptions,
  breakpoints: {
    values: {
      xs: parseInt(brandConfig.layout.breakpoints.mobileXs),
      sm: parseInt(brandConfig.layout.breakpoints.mobileSm),
      md: parseInt(brandConfig.layout.breakpoints.mobileMd),
      lg: parseInt(brandConfig.layout.breakpoints.tablet),
      xl: parseInt(brandConfig.layout.breakpoints.desktop),
    },
  },
}); 