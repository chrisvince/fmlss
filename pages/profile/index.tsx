import {
  AuthUser,
  getFirebaseAdmin,
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
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import constants from '../../constants'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const UserProfile = () => {
  const authUser = useAuthUser()
  const handleSignOutButtonClick = authUser.signOut

  return (
    <Page pageTitle="Profile" thinContainer renderPageTitle>
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
          secondaryAction={!authUser.emailVerified && <EmailVerificationLink />}
        >
          <ListItemButton component={Link} href="/profile/change-email">
            <ListItemText primary="Change email" secondary={authUser.email} />
          </ListItemButton>
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
          <ListItemButton component={Link} href="/profile/change-password">
            <ListItemText primary="Change password" />
          </ListItemButton>
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

const getServerSidePropsFn = async ({ AuthUser }: { AuthUser: AuthUser }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const userHasUsername = await checkIfUserHasUsername(uid, { db: adminDb })

  if (uid && !userHasUsername) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      redirect: {
        destination: '/sign-up/username',
        permanent: false,
      },
    }
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserProfile as any)
