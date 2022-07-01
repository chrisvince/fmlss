import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HomePage from '../../components/HomePage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import type { Post } from '../../types'
import { FeedSortMode } from '../../types/FeedSortMode'
import { createPostFeedCacheKey } from '../../utils/createCacheKeys'
import getPostFeed from '../../utils/data/posts/getPostFeed'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
}

const Home = ({ fallback }: PropTypes) => {
  return (
    <SWRConfig value={{ fallback }}>
      <HomePage />
    </SWRConfig>
  )
}

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
}: {
  AuthUser: AuthUser,
  params: { sortMode: string }
}) => {
  if (sortModeArray?.length > 1) {
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'latest'
  const sortMode = SORT_MODE_MAP[sortModeParam] as FeedSortMode

  if (!sortMode) {
    return { notFound: true }
  }

  const postFeedCacheKey = createPostFeedCacheKey(sortMode)
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id
  const posts = await getPostFeed({
    db: adminDb,
    sortMode,
    uid,
  })

  return {
    props: {
      fallback: {
        [postFeedCacheKey]: posts,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Home as any)
