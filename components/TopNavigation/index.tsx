import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from '@mui/material'
import { Container } from '@mui/system'
import {
  LoginRounded,
  LogoutRounded,
  Menu as MenuIcon,
  PersonRounded,
  SettingsRounded,
} from '@mui/icons-material'

import constants from '../../constants'
import CenterSectionContainer from '../CenterSectionContainer'
import LeftNavigationMobile from '../LeftNavigationMobile'
import Brand from '../Brand'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import NotificationsNavigationItem from '../NotificationsNavigationItem'
import signOut from '../../utils/auth/signOut'
import useAuth from '../../utils/auth/useAuth'

const {
  SIDEBAR_GAP_MD,
  SIDEBAR_GAP_SM,
  SIDEBAR_WIDTH_LG,
  SIDEBAR_WIDTH_MD,
  SIDEBAR_WIDTH_SM,
  SIDEBAR_WIDTH_XS,
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
} = constants

interface Props {
  disableBottomPaddingXs?: boolean
}
const TopNavigation = ({ disableBottomPaddingXs = false }: Props) => {
  const { displayName, email, uid } = useAuth()
  const router = useRouter()
  const settingsMenuButtonRef = useRef<HTMLButtonElement>(null)
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false)
  const theme = useTheme()
  const isAboveSm = useMediaQuery(theme.breakpoints.up('sm'))
  const shouldCollapse = useSelector(
    (state: RootState) => state.navigation.shouldCollapse
  )

  const handleMobileMenuOpen = () => setMobileNavigationOpen(true)
  const handleMobileMenuClose = () => setMobileNavigationOpen(false)
  const handleSettingsMenuClose = () => setSettingsMenuOpen(false)

  const handleSignOutClick = async () => {
    await signOut()
    router.push('/welcome')
  }

  const handleSettingsMenuButtonClick = () =>
    setSettingsMenuOpen(current => !current)

  const handleMobileMenuButtonClick = () =>
    setMobileNavigationOpen(current => !current)

  useEffect(() => {
    if (!isAboveSm) return
    setMobileNavigationOpen(false)
  }, [isAboveSm])

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileNavigationOpen(false)
      setSettingsMenuOpen(false)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const showMobileNav = !useScrollTrigger({
    threshold: shouldCollapse ? parseInt(TOP_NAVIGATION_HEIGHT) : Infinity,
  })

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1210,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          height: TOP_NAVIGATION_HEIGHT,
          marginBottom: {
            xs: theme.spacing(
              disableBottomPaddingXs ? 0 : TOP_NAVIGATION_MARGIN_BOTTOM_XS
            ),
            sm: theme.spacing(TOP_NAVIGATION_MARGIN_BOTTOM_SM),
          },
          transform: {
            xs: showMobileNav ? 'translateY(0)' : 'translateY(-100%)',
            sm: 'unset',
          },
          transition: {
            xs: 'transform 0.4s ease',
            sm: 'unset',
          },
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
                md: SIDEBAR_GAP_MD,
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
                <Brand height={19} width={116} padded />
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
              <CenterSectionContainer>
                {/* middle section */}
              </CenterSectionContainer>
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
                  display: 'flex',
                  marginRight: theme.spacing(-0.7),
                }}
              >
                <NotificationsNavigationItem />
                <IconButton
                  id="settings-menu-button"
                  aria-label="Settings menu"
                  ref={settingsMenuButtonRef}
                  onClick={handleSettingsMenuButtonClick}
                  sx={{ padding: 0.7 }}
                >
                  <PersonRounded />
                </IconButton>
                <Menu
                  anchorEl={settingsMenuButtonRef.current}
                  open={settingsMenuOpen}
                  onClose={handleSettingsMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'settings-menu-button',
                  }}
                >
                  {uid && (
                    <MenuItem component={Link} href="/settings">
                      <ListItemIcon>
                        <SettingsRounded />
                      </ListItemIcon>
                      <ListItemText
                        primary="Settings"
                        secondary={displayName ?? email}
                      />
                    </MenuItem>
                  )}
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <MenuItem
                    component={uid ? undefined : Link}
                    href={uid ? undefined : '/'}
                    onClick={uid ? handleSignOutClick : undefined}
                  >
                    <ListItemIcon>
                      {uid ? <LogoutRounded /> : <LoginRounded />}
                    </ListItemIcon>
                    <ListItemText>{uid ? 'Sign out' : 'Sign in'}</ListItemText>
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
