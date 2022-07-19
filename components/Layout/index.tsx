import { Container, Box, useTheme } from '@mui/system'
import { useMediaQuery } from '@mui/material'

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
}

const Layout = ({ children }: PropTypes) => {
  const theme = useTheme()
  const disableGutters = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <TopNavigation />
      <Container disableGutters={disableGutters}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              sm: `${SIDEBAR_WIDTH_SM} 1fr`,
              md: `${SIDEBAR_WIDTH_MD} 1fr`,
              lg: `${SIDEBAR_WIDTH_LG} 1fr`,
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
