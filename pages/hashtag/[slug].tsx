import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HashtagPage from '../../components/HashtagPage'
import type { HashtagSortMode } from '../../types'
import {
  createHashtagPostsCacheKey,
  createSidebarCategoriesCacheKey,
  createSidebarHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getHashtagPosts from '../../utils/data/posts/getHashtagPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'

const {
  CATEGORIES_ENABLED,
  GET_SERVER_SIDE_PROPS_TIME_LABEL,
  SIDEBAR_LIST_CACHE_TIME,
  SIDEBAR_LIST_COUNT,
} = constants

const DEFAULT_POST_TYPE = 'post'

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  slug: string
}

const Hashtag = ({ fallback, slug }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <HashtagPage slug={slug} />
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
  params: { slug },
  query: { sort = 'latest' },
  req,
}: {
  AuthUser: AuthUser
  params: { slug: string }
  query: { sort: string }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ?? 'latest') as HashtagSortMode
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

  const hashtagPostsCacheKey = createHashtagPostsCacheKey(
    slug,
    DEFAULT_POST_TYPE,
    sortMode
  )
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarCategoriesCacheKey = createSidebarCategoriesCacheKey()

  const getSidebarHashtags = () =>
    getHashtags({
      cacheKey: sidebarHashtagsCacheKey,
      cacheTime: SIDEBAR_LIST_CACHE_TIME,
      db: adminDb,
      limit: SIDEBAR_LIST_COUNT,
    })

  const getsidebarCategories = () =>
    getCategories({
      cacheKey: sidebarCategoriesCacheKey,
      cacheTime: SIDEBAR_LIST_CACHE_TIME,
      db: adminDb,
      limit: SIDEBAR_LIST_COUNT,
    })

  if (isInternalRequest(req)) {
    const [sidebarHashtags, sidebarCategories] = await Promise.all([
      getSidebarHashtags(),
      CATEGORIES_ENABLED ? getsidebarCategories() : [],
    ])

    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          ...(CATEGORIES_ENABLED
            ? { [sidebarCategoriesCacheKey]: sidebarCategories }
            : {}),
          [sidebarHashtagsCacheKey]: sidebarHashtags,
          [hashtagPostsCacheKey]: null,
        },
        slug,
        key: hashtagPostsCacheKey,
      },
    }
  }

  const [posts, sidebarHashtags, sidebarCategories] = await Promise.all([
    getHashtagPosts(slug, {
      db: adminDb,
      uid,
      showType: DEFAULT_POST_TYPE,
      sortMode,
    }),
    getSidebarHashtags(),
    CATEGORIES_ENABLED ? getsidebarCategories() : [],
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [sidebarCategoriesCacheKey]: sidebarCategories,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [hashtagPostsCacheKey]: posts,
      },
      slug,
      key: hashtagPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getServerSidePropsFn as any
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser()(Hashtag as any)
