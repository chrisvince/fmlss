import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import { NextApiRequest } from 'next'

import FeedPage from '../../components/FeedPage'
import type { FeedSortMode, Post } from '../../types'
import { createMiniCategoriesCacheKey, createMiniHashtagsCacheKey, createPostFeedCacheKey } from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getPostFeed from '../../utils/data/posts/getPostFeed'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

interface PropTypes {
  fallback: {
    [key: string]: Post[]
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
  if (sortModeArray?.length > 1) {
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'latest'
  const sortMode = SORT_MODE_MAP[sortModeParam] as FeedSortMode

  if (!sortMode) {
    return { notFound: true }
  }

  const postFeedCacheKey = createPostFeedCacheKey(sortMode)
  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const miniCategoriesCacheKey = createMiniCategoriesCacheKey()

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id

  const miniHashtags = await getHashtags({
    cacheKey: miniHashtagsCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  const miniCategories = await getCategories({
    cacheKey: miniCategoriesCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  if (isInternalRequest(req)) {
    return {
      props: {
        fallback: {
          [miniCategoriesCacheKey]: miniCategories,
          [miniHashtagsCacheKey]: miniHashtags,
          [postFeedCacheKey]: null,
        },
        key: postFeedCacheKey,
      },
    }
  }

  const posts = await getPostFeed({
    db: adminDb,
    sortMode,
    uid,
  })

  return {
    props: {
      fallback: {
        [miniCategoriesCacheKey]: miniCategories,
        [miniHashtagsCacheKey]: miniHashtags,
        [postFeedCacheKey]: posts,
      },
      key: postFeedCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  getServerSidePropsFn as any
)

export default withAuthUser()(Feed as any)
