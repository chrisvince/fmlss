import { Box, useTheme } from '@mui/system'

import constants from '../../constants'

const {
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
} = constants

interface PropTypes {
  id: string
}

const ScrollLink = ({ id }: PropTypes) => {
  const { spacing } = useTheme()
  
  return (
    <Box
      component="a"
      id={id}
      aria-hidden="true"
      sx={{
        display: 'block',
        position: 'relative',
        visibility: 'hidden',
        top: {
          sm: `calc(-${TOP_NAVIGATION_HEIGHT} - ${spacing(
            TOP_NAVIGATION_MARGIN_BOTTOM_SM
          )})`,
          xs: `calc(-${TOP_NAVIGATION_HEIGHT} - ${spacing(
            TOP_NAVIGATION_MARGIN_BOTTOM_XS
          )})`,
        },
      }}
    />
  )
}

export default ScrollLink
