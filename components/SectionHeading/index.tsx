import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/system'

import constants from '../../constants'
import MobileContainer from '../MobileContainer'

const {
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
} = constants

interface PropTypes {
  children: string | React.ReactNode
  sticky?: boolean
}

const SectionHeading = ({ children, sticky = true }: PropTypes) => {
  const theme = useTheme()
  const navMarginBottomSm = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)
  if (!children) return null

  const stickyStyles = sticky ? {
    position: {
      sm: 'sticky',
    },
    top: {
      sm: `calc(${TOP_NAVIGATION_HEIGHT} + ${navMarginBottomSm})`,
    },
  } : {}

  return (
    <Box
      sx={{
        backgroundColor: {
          sm: 'background.paper',
        },
        marginBottom: {
          xs: 1,
          sm: 2,
        },
        ...stickyStyles,
        zIndex: {
          sm: 1208,
        },
        borderBottom: {
          sm: '1px solid',
        },
        borderColor: {
          sm: 'divider',
        },
        paddingBottom: 0.5,
        paddingTop: {
          xs: 1,
          sm: 0,
        },
      }}
    >
      <MobileContainer>
        <Typography
          component="h1"
          variant="h6"
        >
          {children}
        </Typography>
      </MobileContainer>
    </Box>
  )
}

export default SectionHeading
