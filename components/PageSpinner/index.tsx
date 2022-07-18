import { CircularProgress } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import constants from '../../constants'

const {
  PAGE_SORT_SELECTOR_HEIGHT,
  PAGE_TITLE_HEIGHT,
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
} = constants

type Elements = 'pageTitle' | 'sortSelector'

interface Props {
  elements: Elements[]
}


const PageSpinner = ({ elements = ['pageTitle'] }: Props) => {
  const theme = useTheme()
  const hasElement = (element: Elements) => elements.includes(element)

  const sortSelector = hasElement('sortSelector')
    ? PAGE_SORT_SELECTOR_HEIGHT
    : 0

  const pageTitle = hasElement('pageTitle') ? PAGE_TITLE_HEIGHT : 0

  const navGapXs = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_XS)
  const navGapSm = theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM)

  const bottomGap = theme.spacing(4)

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: {
          xs: `calc(100vh - ${TOP_NAVIGATION_HEIGHT} - ${navGapXs} - ${pageTitle} - ${sortSelector} - ${bottomGap})`,
          sm: `calc(100vh - ${TOP_NAVIGATION_HEIGHT} - ${navGapSm} - ${pageTitle} - ${sortSelector} - ${bottomGap})`,
        },
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default PageSpinner
