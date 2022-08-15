import { createTheme } from '@mui/material/styles'

const FONT_SIZE = {
  XS: '0.73333rem',
  SM: '0.86667rem',
  BASE: '1rem',
  LG: '1.13333rem',
  XL: '1.2666666666666666rem',
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
    warning: {
      main: '#e0bb00',
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
      fontSize: FONT_SIZE.XL,
      fontWeight: '500',
    },
    h6: {
      fontSize: FONT_SIZE.BASE,
      textTransform: 'uppercase',
      fontWeight: 600,
    },
    caption: {
      fontSize: FONT_SIZE.SM,
      fontWeight: '300',
    },
    body1: {
      fontSize: FONT_SIZE.LG,
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
        '.ReactVirtualized__List': {
          outline: 'none',
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
          textTransform: 'none',
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
          fontSize: FONT_SIZE.SM,
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
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
        },
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
          fontSize: FONT_SIZE.SM,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(1, 2),
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(2, 3),
          },
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
          },
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
          },
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        arrow: ({ theme }) => ({
          color: theme.palette.common.white,
          ':before': {
            boxShadow: theme.shadows[1],
          },
        }),
        tooltip: ({ theme }) => ({
          backgroundColor: theme.palette.common.white,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
          fontSize: FONT_SIZE.XS,
          '.MuiTooltip-popper[data-popper-placement*="bottom"] &': {
            marginTop: '7px',
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        sizeSmall: {
          fontSize: FONT_SIZE.XS,
        },
      },
    },
  },
  spacing: 8,
})

export default theme
