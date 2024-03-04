import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import UserPostsPage from '../components/UserPostsPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import { createUserPostsCacheKey } from '../utils/createCacheKeys'
import getUserPosts from '../utils/data/userPosts/getUserPosts'
import constants from '../constants'
import isInternalRequest from '../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import fetchSidebarFallbackData from '../utils/data/sidebar/fetchSidebarData'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const UserPosts = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <UserPostsPage />
  </SWRConfig>
)

const getServerSidePropsFn = async ({
  AuthUser,
  req,
}: {
  AuthUser: AuthUser
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id

  // @ts-expect-error: we know uid is defined
  const userPostsCacheKey = createUserPostsCacheKey(uid)
  const sidebarDataPromise = fetchSidebarFallbackData({ db: adminDb })

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        key: userPostsCacheKey,
      },
    }
  }

  const [posts, sidebarFallbackData] = await Promise.all([
    // @ts-expect-error: we know uid is defined
    getUserPosts(uid, { db: adminDb, type: 'post' }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [userPostsCacheKey]: posts,
      },
      key: userPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserPosts as any)
