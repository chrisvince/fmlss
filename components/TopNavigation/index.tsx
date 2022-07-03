import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { Container } from '@mui/system'
import MenuIcon from '@mui/icons-material/Menu'

import constants from '../../constants'
import CenterSectionContainer from '../CenterSectionContainer'
import LeftNavigationMobile from '../LeftNavigationMobile'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const {
  SIDEBAR_GAP_LG,
  SIDEBAR_GAP_SM,
  SIDEBAR_WIDTH_LG,
  SIDEBAR_WIDTH_MD,
  SIDEBAR_WIDTH_SM,
  SIDEBAR_WIDTH_XS,
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
} = constants

const TopNavigation = () => {
  const router = useRouter()
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const theme = useTheme()
  const isAboveSm = useMediaQuery(theme.breakpoints.up('sm'))

  const handleMobileMenuButtonClick = () =>
    setMobileNavigationOpen(current => !current)

  const handleMobileMenuOpen = () => setMobileNavigationOpen(true)
  const handleMobileMenuClose = () => setMobileNavigationOpen(false)

  useEffect(() => {
    if (!isAboveSm) return
    setMobileNavigationOpen(false)
  }, [isAboveSm])

  useEffect(() => {
    const handleRouteChange = () => setMobileNavigationOpen(false)
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          height: TOP_NAVIGATION_HEIGHT,
          marginBottom: {
            xs: TOP_NAVIGATION_MARGIN_BOTTOM_XS,
            sm: TOP_NAVIGATION_MARGIN_BOTTOM_SM,
          },
          backgroundColor: 'lightgray',
          zIndex: 8500,
        }}
      >
        <Container sx={{ height: '100%' }}>
          <Box
            sx={{
              display: 'grid',
              height: '100%',
              alignItems: 'center',
              gridTemplateColumns: {
                xs: `${SIDEBAR_WIDTH_XS} 1fr`,
                sm: `${SIDEBAR_WIDTH_SM} 1fr min-content`,
                md: `${SIDEBAR_WIDTH_MD} 1fr ${SIDEBAR_WIDTH_MD}`,
                lg: `${SIDEBAR_WIDTH_LG} 1fr ${SIDEBAR_WIDTH_LG}`,
              },
              columnGap: {
                xs: SIDEBAR_GAP_SM,
                md: SIDEBAR_GAP_LG,
              },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                alignItems: 'center',
                gridAutoFlow: 'column',
                gridTemplateColumns: 'min-content 1fr',
                columnGap: 2,
              }}
            >
              <Box
                sx={{
                  display: {
                    xs: 'block',
                    sm: 'none',
                    marginLeft: theme.spacing(-1),
                  },
                }}
              >
                <IconButton onClick={handleMobileMenuButtonClick}>
                  <MenuIcon />
                </IconButton>
              </Box>
              <Box>
                <b>FAMELESS</b>
              </Box>
            </Box>
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            >
              <CenterSectionContainer>middle</CenterSectionContainer>
            </Box>
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                justifySelf: 'end',
              }}
            >
              3
            </Box>
          </Box>
        </Container>
      </Box>
      <LeftNavigationMobile
        open={mobileNavigationOpen}
        onOpen={handleMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />
    </>
  )
}

export default TopNavigation
