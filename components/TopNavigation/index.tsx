import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuthUser } from 'next-firebase-auth'
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Container } from '@mui/system'
import {
  AccountCircleRounded,
  LogoutRounded,
  Menu as MenuIcon,
  PersonRounded,
} from '@mui/icons-material'
import Image from 'next/image'

import constants from '../../constants'
import CenterSectionContainer from '../CenterSectionContainer'
import LeftNavigationMobile from '../LeftNavigationMobile'

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
  const { email, signOut } = useAuthUser()
  const router = useRouter()
  const profileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const theme = useTheme()
  const isAboveSm = useMediaQuery(theme.breakpoints.up('sm'))

  const handleMobileMenuOpen = () => setMobileNavigationOpen(true)
  const handleMobileMenuClose = () => setMobileNavigationOpen(false)
  const handleProfileMenuClose = () => setProfileMenuOpen(false)
  const handleSignOutClick = signOut

  const handleProfileMenuButtonClick = () =>
    setProfileMenuOpen((current) => !current)

  const handleMobileMenuButtonClick = () =>
    setMobileNavigationOpen((current) => !current)

  useEffect(() => {
    if (!isAboveSm) return
    setMobileNavigationOpen(false)
  }, [isAboveSm])

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileNavigationOpen(false)
      setProfileMenuOpen(false)
    }
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
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          height: TOP_NAVIGATION_HEIGHT,
          marginBottom: {
            xs: TOP_NAVIGATION_MARGIN_BOTTOM_XS,
            sm: TOP_NAVIGATION_MARGIN_BOTTOM_SM,
          },
          backgroundColor: 'background.paper',
          zIndex: 1210,
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
                gridTemplateColumns: 'auto 1fr',
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
                <Link href="/">
                  <Box component="a" sx={{ display: 'flex' }}>
                    <Image
                      alt="FAMELESS"
                      src="/fameless.svg"
                      height={19}
                      width={116}
                    />
                  </Box>
                </Link>
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
              <Box
                sx={{
                  display: {
                    marginRight: theme.spacing(-1),
                  },
                }}
              >
                <IconButton
                  id="profile-menu-button"
                  aria-label="Profile menu"
                  ref={profileMenuButtonRef}
                  onClick={handleProfileMenuButtonClick}
                >
                  <AccountCircleRounded
                    sx={{
                      height: '32px',
                      width: '32px',
                      color: 'grey.400',
                    }}
                  />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={profileMenuButtonRef.current}
                  open={profileMenuOpen}
                  onClose={handleProfileMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'profile-menu-button',
                  }}
                >
                  <Link href="/profile" passHref>
                    <MenuItem>
                      <ListItemIcon>
                        <PersonRounded />
                      </ListItemIcon>
                      <ListItemText primary="Profile" secondary={email} />
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={handleSignOutClick}>
                    <ListItemIcon>
                      <LogoutRounded />
                    </ListItemIcon>
                    <ListItemText>Sign out</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
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
