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
  createSidebarHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getCategoryPosts from '../../utils/data/posts/getCategoryPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import getCategory from '../../utils/data/category/getCategory'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'

const { CATEGORIES_ENABLED, GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

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
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
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

  const sidebarDataPromise = fetchSidebarData({ db: adminDb })

  if (isInternalRequest(req)) {
    const { sidebarHashtags } = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          [categoryPostsCacheKey]: null,
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
        slug,
        key: categoryPostsCacheKey,
      },
    }
  }

  const [posts, category, { sidebarHashtags }] = await Promise.all([
    getCategoryPosts(slug, {
      db: adminDb,
      uid,
      sortMode,
    }),
    getCategory(slug, { db: adminDb }),
    sidebarDataPromise,
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
        [sidebarHashtagsCacheKey]: sidebarHashtags,
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
