import { createTheme } from '@mui/material/styles'

const FONT_SIZE = {
  SMALL: '0.86667rem',
  BASE: '1rem',
  LARGE: '1.13333rem',
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
    fontSize: 15,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    htmlFontSize: 15,
    h5: {
      fontSize: FONT_SIZE.LARGE,
    },
    h6: {
      fontSize: FONT_SIZE.BASE,
      textTransform: 'uppercase',
      fontWeight: 600,
    },
    caption: {
      fontSize: FONT_SIZE.SMALL,
      fontWeight: '300',
    },
    body1: {
      fontSize: FONT_SIZE.LARGE,
      fontWeight: '500',
    },
    body2: {
      fontWeight: '500',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: '15px',
        },
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
          fontSize: FONT_SIZE.SMALL,
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
    MuiListItemText: {
      styleOverrides: {
        secondary: {
          fontSize: FONT_SIZE.SMALL,
        },
      },
    },
  },
  spacing: 8,
})

export default theme
