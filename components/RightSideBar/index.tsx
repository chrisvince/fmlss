import { Box, useTheme } from '@mui/system'

import constants from '../../constants'

const {
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
} = constants

interface PropTypes {
  children: React.ReactNode
}

const RightSideBar = ({ children }: PropTypes) => {
  const { spacing } = useTheme()
  const naviMarginBottomXs = spacing(TOP_NAVIGATION_MARGIN_BOTTOM_XS)
  const naviMarginBottomSm = spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)
  const bottomBuffer = spacing(4)

  return (
    <Box
      sx={{
        position: 'sticky',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        top: {
          xs: `calc(${TOP_NAVIGATION_HEIGHT} + ${naviMarginBottomXs})`,
          sm: `calc(${TOP_NAVIGATION_HEIGHT} + ${naviMarginBottomSm})`,
        },
        maxHeight: {
          xs: `calc(100vh - ${TOP_NAVIGATION_HEIGHT} - ${naviMarginBottomXs})`,
          sm: `calc(100vh - ${TOP_NAVIGATION_HEIGHT} - ${naviMarginBottomSm})`,
        },
        overflowY: 'auto',
        paddingBottom: bottomBuffer,
      }}
    >
      {children}
    </Box>
  )
}

export default RightSideBar
