import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import CategoryPage from '../../components/CategoryPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import type { CategorySortMode, Post } from '../../types'
import {
  createCategoryCacheKey,
  createCategoryPostsCacheKey,
} from '../../utils/createCacheKeys'
import getCategory from '../../utils/data/category/getCategory'
import getCategoryPosts from '../../utils/data/posts/getCategoryPosts'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
  slug: string
}

const Hashtag = ({ fallback, slug }: PropTypes) => (
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
}: {
  AuthUser: AuthUser
  params: { slug: string }
  query: { sort: string }
}) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ?? 'latest') as CategorySortMode

  const categoryCacheKey = createCategoryCacheKey(slug)

  const categoryPostsCacheKey = createCategoryPostsCacheKey(
    slug,
    sortMode,
  )

  const category = await getCategory(slug, { db: adminDb })
  const posts = await getCategoryPosts(slug, {
    db: adminDb,
    uid,
    sortMode,
  })

  // @ts-expect-error
  await admin.app().delete()

  return {
    props: {
      fallback: {
        [categoryCacheKey]: category,
        [categoryPostsCacheKey]: posts,
      },
      slug,
      key: categoryPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Hashtag as any)
