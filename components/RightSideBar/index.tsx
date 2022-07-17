import { Box, useTheme } from '@mui/system'

import constants from '../../constants'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'

const {
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
} = constants

interface PropTypes {
  children: React.ReactNode
}

const RightSideBar = ({ children }: PropTypes) => {
  const theme = useTheme()
  const naviMarginBottomXs = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_XS)
  const naviMarginBottomSm = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)

  return (
    <Box
      component="aside"
      sx={{
        position: 'sticky',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        top: {
          xs: `calc(${TOP_NAVIGATION_HEIGHT} + ${naviMarginBottomXs})`,
          sm: `calc(${TOP_NAVIGATION_HEIGHT} + ${naviMarginBottomSm})`,
        },
      }}
    >
      {children}
    </Box>
  )
}

export default RightSideBar
