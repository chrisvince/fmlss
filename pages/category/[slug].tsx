import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import CategoryPage from '../../components/CategoryPage'
import type { CategorySortMode } from '../../types'
import {
  createCategoryCacheKey,
  createCategoryPostsCacheKey,
  createMiniHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getCategoryPosts from '../../utils/data/posts/getCategoryPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import getCategory from '../../utils/data/category/getCategory'

const {
  CATEGORIES_ENABLED,
  GET_SERVER_SIDE_PROPS_TIME_LABEL,
  MINI_LIST_CACHE_TIME,
  MINI_LIST_COUNT,
} = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  slug: string
}

const Category = ({ fallback, slug }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <CategoryPage slug={slug} />
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

  if (!CATEGORIES_ENABLED) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ?? 'latest') as CategorySortMode
  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const categoryPostsCacheKey = createCategoryPostsCacheKey(slug, { sortMode })
  const categoryCacheKey = createCategoryCacheKey(slug)
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

  const getMiniHashtags = () =>
    getHashtags({
      cacheKey: miniHashtagsCacheKey,
      cacheTime: MINI_LIST_CACHE_TIME,
      db: adminDb,
      limit: MINI_LIST_COUNT,
    })

  if (isInternalRequest(req)) {
    const miniHashtags = await getMiniHashtags()
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          [categoryPostsCacheKey]: null,
          [miniHashtagsCacheKey]: miniHashtags,
        },
        slug,
        key: categoryPostsCacheKey,
      },
    }
  }

  const [posts, category, miniHashtags] = await Promise.all([
    getCategoryPosts(slug, {
      db: adminDb,
      uid,
      sortMode,
    }),
    getCategory(slug, { db: adminDb }),
    getMiniHashtags(),
  ])

  if (!category || posts.length === 0) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [categoryCacheKey]: category,
        [categoryPostsCacheKey]: posts,
        [miniHashtagsCacheKey]: miniHashtags,
      },
      slug,
      key: categoryPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getServerSidePropsFn as any
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser()(Category as any)
