import { Container, Box, useTheme } from '@mui/system'

import TopNavigation from '../TopNavigation'
import LeftNavigationDesktop from '../LeftNavigationDesktop'
import constants from '../../constants'

const {
  SIDEBAR_GAP_MD,
  SIDEBAR_GAP_SM,
  SIDEBAR_WIDTH_LG,
  SIDEBAR_WIDTH_MD,
  SIDEBAR_WIDTH_SM,
} = constants

interface PropTypes {
  children: React.ReactNode
  disableNavBottomPaddingXs?: boolean
}

const Layout = ({ children, disableNavBottomPaddingXs = false }: PropTypes) => {
  const theme = useTheme()

  return (
    <>
      <TopNavigation disableBottomPaddingXs={disableNavBottomPaddingXs} />
      <Container
        sx={{
          paddingLeft: {
            xs: 0,
            sm: theme.spacing(3),
          },
          paddingRight: {
            xs: 0,
            sm: theme.spacing(3),
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '100%',
              sm: `${SIDEBAR_WIDTH_SM} minmax(0, 1fr)`,
              md: `${SIDEBAR_WIDTH_MD} minmax(0, 1fr)`,
              lg: `${SIDEBAR_WIDTH_LG} minmax(0, 1fr)`,
            },
            columnGap: {
              sm: SIDEBAR_GAP_SM,
              md: SIDEBAR_GAP_MD,
            },
          }}
        >
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
              zIndex: 1209,
            }}
          >
            <LeftNavigationDesktop />
          </Box>
          <Box>{children}</Box>
        </Box>
      </Container>
    </>
  )
}

export default Layout
