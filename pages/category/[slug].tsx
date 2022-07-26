import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import CategoryPage from '../../components/CategoryPage'
import type { CategorySortMode, Post } from '../../types'
import {
  createCategoryPostsCacheKey,
  createMiniHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getCategoryPosts from '../../utils/data/posts/getCategoryPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import useCategory from '../../utils/data/category/useCategory'
import Error from 'next/error'

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
  slug: string
}

const Category = ({ fallback, slug }: PropTypes) => {
  const { category, isLoading } = useCategory(slug)

  if (!isLoading && !category) {
    return <Error statusCode={404} />
  }

  return (
    <SWRConfig value={{ fallback }}>
      <CategoryPage slug={slug} />
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
  params: { slug },
  query: { sort = 'latest' },
  req,
}: {
  AuthUser: AuthUser
  params: { slug: string }
  query: { sort: string }
  req: NextApiRequest
}) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ?? 'latest') as CategorySortMode

  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const categoryPostsCacheKey = createCategoryPostsCacheKey(slug, sortMode)

  const miniHashtags = await getHashtags({
    cacheKey: miniHashtagsCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  if (isInternalRequest(req)) {
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

  const posts = await getCategoryPosts(slug, {
    db: adminDb,
    uid,
    sortMode,
  })

  return {
    props: {
      fallback: {
        [categoryPostsCacheKey]: posts,
        [miniHashtagsCacheKey]: miniHashtags,
      },
      slug,
      key: categoryPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  getServerSidePropsFn as any
)

export default withAuthUser()(Category as any)
