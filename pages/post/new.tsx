import { AuthUser, getFirebaseAdmin, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import NewPostPage from '../../components/NewPostPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import constants from '../../constants'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const NewPost = () => <NewPostPage />

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

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(NewPost)
