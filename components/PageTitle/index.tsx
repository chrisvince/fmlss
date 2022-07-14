import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/system'

import constants from '../../constants'

const {
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
} = constants

const PageHeading = ({ children }: { children: string }) => {
  const theme = useTheme()
  const navMarginBottomSm = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)
  if (!children) return null

  return (
    <Box
      sx={{
        backgroundColor: {
          sm: 'background.paper',
        },
        marginBottom: 2,
        position: {
          sm: 'sticky',
        },
        top: {
          sm: `calc(${TOP_NAVIGATION_HEIGHT} + ${navMarginBottomSm})`,
        },
        zIndex: {
          sm: 1209,
        },
        borderBottom: '1px solid',
        borderColor: 'divider',
        paddingBottom: 1,
        paddingTop: {
          xs: 1,
          sm: 0,
        },
      }}
    >
      <Typography
        component="h1"
        variant="h6"
      >
        {children}
      </Typography>
    </Box>
  )
}

export default PageHeading
