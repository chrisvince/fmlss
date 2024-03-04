import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import { NextApiRequest } from 'next'

import FeedPage from '../../components/FeedPage'
import { FeedSortMode } from '../../types'
import {
  createPostFeedCacheKey,
  createUserCacheKey,
} from '../../utils/createCacheKeys'
import getPostFeed from '../../utils/data/posts/getPostFeed'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import fetchSidebarFallbackData from '../../utils/data/sidebar/fetchSidebarData'
import getUser from '../../utils/data/user/getUser'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Feed = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <FeedPage sortMode={FeedSortMode.Latest} />
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
  const uid = AuthUser.id

  if (!uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const postFeedCacheKey = createPostFeedCacheKey(FeedSortMode.Latest)
  const userCacheKey = createUserCacheKey(uid)

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const sidebarDataPromise = fetchSidebarFallbackData({ db: adminDb })

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        key: postFeedCacheKey,
      },
    }
  }

  const [posts, sidebarFallbackData, user] = await Promise.all([
    getPostFeed({
      db: adminDb,
      sortMode: FeedSortMode.Latest,
      uid,
    }),
    sidebarDataPromise,
    getUser(uid, { db: adminDb }),
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        [userCacheKey]: user,
        [postFeedCacheKey]: posts,
        ...sidebarFallbackData,
      },
      key: postFeedCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Feed as any)
