import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import { NextApiRequest } from 'next'

import FeedPage from '../../components/FeedPage'
import type { FeedSortMode } from '../../types'
import {
  createSidebarCategoriesCacheKey,
  createSidebarHashtagsCacheKey,
  createPostFeedCacheKey,
} from '../../utils/createCacheKeys'
import getPostFeed from '../../utils/data/posts/getPostFeed'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Feed = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <FeedPage />
  </SWRConfig>
)

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
  'most-likes': 'mostLikes',
}

const getServerSidePropsFn = async ({
  AuthUser,
  params: { sortMode: sortModeArray },
  req,
}: {
  AuthUser: AuthUser
  params: { sortMode: string }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  if (sortModeArray?.length > 1) {
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'latest'
  const sortMode = SORT_MODE_MAP[sortModeParam] as FeedSortMode

  if (!sortMode) {
    return { notFound: true }
  }

  const postFeedCacheKey = createPostFeedCacheKey(sortMode)
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarCategoriesCacheKey = createSidebarCategoriesCacheKey()

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

  const sidebarDataPromise = fetchSidebarData({ db: adminDb })

  if (isInternalRequest(req)) {
    const { sidebarCategories, sidebarHashtags } = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          [sidebarCategoriesCacheKey]: sidebarCategories,
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
        key: postFeedCacheKey,
      },
    }
  }

  const [posts, { sidebarHashtags, sidebarCategories }] = await Promise.all([
    getPostFeed({
      db: adminDb,
      sortMode,
      uid,
    }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        [sidebarCategoriesCacheKey]: sidebarCategories,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [postFeedCacheKey]: posts,
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
