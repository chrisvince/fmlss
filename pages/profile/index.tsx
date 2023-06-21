import {
  AuthUser,
  getFirebaseAdmin,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

import { ListItem, ListItemText, ListItemButton } from '@mui/material'

import Page from '../../components/Page'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import constants from '../../constants'
import ProfileList from '../../components/ProfileList'
import ProfileListItem from '../../components/ProfileListItem'
import ProfileEmailListItem from '../../components/ProfileEmailListItem'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const UserProfile = () => {
  const authUser = useAuthUser()
  const handleSignOutButtonClick = authUser.signOut

  return (
    <Page pageTitle="Profile" thinContainer renderPageTitle>
      <ProfileList heading="Account">
        <ProfileListItem
          href="/profile/name"
          primaryText="Name"
          secondaryText={authUser.displayName}
        />
        <ProfileEmailListItem />
      </ProfileList>
      <ProfileList heading="Security">
        <ProfileListItem href="/profile/password" primaryText="Password" />
        <ListItem>
          <ListItemButton onClick={handleSignOutButtonClick}>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ListItem>
      </ProfileList>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserProfile as any)
