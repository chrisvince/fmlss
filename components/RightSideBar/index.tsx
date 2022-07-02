import { Box, useTheme } from '@mui/system'

import constants from '../../constants'

const {
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
} = constants

const RightSideBar = () => {
  const theme = useTheme()
  const naviMarginBottomXs = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_XS)
  const naviMarginBottomSm = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: {
          xs: `calc(${TOP_NAVIGATION_HEIGHT} + ${naviMarginBottomXs})`,
          sm: `calc(${TOP_NAVIGATION_HEIGHT} + ${naviMarginBottomSm})`,
        },
      }}
    >
      Sidebar
    </Box>
  )
}

export default RightSideBar
