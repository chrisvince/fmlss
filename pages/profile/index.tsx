import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import Link from 'next/link'

import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListSubheader,
} from '@mui/material'

import MobileContainer from '../../components/MobileContainer'
import EmailVerificationLink from '../../components/EmailVerificationLink'
import Page from '../../components/Page'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const UserProfile = () => {
  const authUser = useAuthUser()
  const handleSignOutButtonClick = authUser.signOut

  return (
    <Page pageTitle="Profile" thinContainer>
      <List
        sx={{
          '& .MuiListItemButton-root': {
            borderRadius: 0,
          },
          '& .MuiListItem-root': {
            padding: 0,
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            '&:first-of-type': {
              borderTop: '1px solid',
              borderTopColor: 'divider',
            },
          },
        }}
        subheader={
          <MobileContainer>
            <ListSubheader component="div" disableGutters>
              Account
            </ListSubheader>
          </MobileContainer>
        }
      >
        <ListItem
          disableGutters
          secondaryAction={
            !authUser.emailVerified && <EmailVerificationLink />
          }
        >
          <Link href="/profile/change-email" passHref>
            <ListItemButton component="a">
              <ListItemText primary="Change email" secondary={authUser.email} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      <List
        sx={{
          '& .MuiListItemButton-root': {
            borderRadius: 0,
          },
          '& .MuiListItem-root': {
            padding: 0,
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            '&:first-of-type': {
              borderTop: '1px solid',
              borderTopColor: 'divider',
            },
          },
        }}
        subheader={
          <MobileContainer>
            <ListSubheader component="div" disableGutters>
              Security
            </ListSubheader>
          </MobileContainer>
        }
      >
        <ListItem disableGutters>
          <Link href="/profile/change-password" passHref>
            <ListItemButton component="a">
              <ListItemText primary="Change password" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton onClick={handleSignOutButtonClick}>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Page>
  )
}

export const getServerSideProps =
  withAuthUserTokenSSR(withAuthUserTokenSSRConfig(ROUTE_MODE))()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserProfile as any)
