import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    bodyLarge: React.CSSProperties
  }
  interface TypographyVariantsOptions {
    bodyLarge?: React.CSSProperties
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    bodyLarge: true
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#3b90ce',
    },
    error: {
      main: '#f43639',
    },
    info: {
      main: '#3b90ce',
    },
    success: {
      main: '#4caf50',
    },
    divider: '#eeeeee',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: 'Assistant',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    htmlFontSize: 14,
    bodyLarge: {
      fontSize: '1.25rem',
    },
    h6: {
      fontSize: '1.1428571428571428rem',
      textTransform: 'uppercase',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: '320px',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'transparent',
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableFocusRipple: true,
        disableRipple: true,
        disableTouchRipple: true,
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 100,
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableFocusRipple: true,
        disableElevation: true,
        size: 'small',
      },
      styleOverrides: {
        grouped: {
          fontSize: '0.8571428571428571rem',
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiRadio: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
        size: 'small',
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          userSelect: 'none',
          marginLeft: 0,
          marginRight: '-7px',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
        },
      },
    },
  },
  spacing: 8,
})

export default theme
