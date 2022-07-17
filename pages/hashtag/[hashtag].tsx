import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HashtagPage from '../../components/HashtagPage'
import type { HashtagSortMode, Post } from '../../types'
import { createHashtagPostsCacheKey, createMiniCategoriesCacheKey, createMiniHashtagsCacheKey } from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getHashtagPosts from '../../utils/data/posts/getHashtagPosts'
import constants from '../../constants'

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

const DEFAULT_POST_TYPE = 'post'

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
  hashtag: string
}

const Hashtag = ({ fallback, hashtag }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <HashtagPage hashtag={hashtag} />
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
  params: { hashtag },
  query: { sort = 'latest' },
}: {
  AuthUser: AuthUser
  params: { hashtag: string }
  query: { sort: string }
}) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ?? 'latest') as HashtagSortMode

  const hashtagPostsCacheKey = createHashtagPostsCacheKey(
    hashtag,
    DEFAULT_POST_TYPE,
    sortMode,
  )
  const posts = await getHashtagPosts(hashtag, {
    db: adminDb,
    uid,
    showType: DEFAULT_POST_TYPE,
    sortMode,
  })

  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const miniHashtags = await getHashtags({
    cacheKey: miniHashtagsCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  const miniCategoriesCacheKey = createMiniCategoriesCacheKey()
  const miniCategories = await getCategories({
    cacheKey: miniCategoriesCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  // @ts-expect-error
  await admin.app().delete()

  return {
    props: {
      fallback: {
        [miniCategoriesCacheKey]: miniCategories,
        [miniHashtagsCacheKey]: miniHashtags,
        [hashtagPostsCacheKey]: posts,
      },
      hashtag,
      key: hashtagPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  getServerSidePropsFn as any
)

export default withAuthUser()(Hashtag as any)
