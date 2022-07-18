import {
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import CategoriesPage from '../../components/CategoriesPage'
import type { CategoriesSortMode, Post } from '../../types'
import {
  createCategoriesCacheKey,
  createMiniHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import constants from '../../constants'
import getHashtags from '../../utils/data/hashtags/getHashtags'

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
}

const Feed = ({ fallback }: PropTypes) => {
  return (
    <SWRConfig value={{ fallback }}>
      <CategoriesPage />
    </SWRConfig>
  )
}

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
}

const getServerSidePropsFn = async ({
  params: { sortMode: sortModeArray },
}: {
  params: { sortMode: string }
}) => {
  if (sortModeArray?.length > 1) {
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'popular'
  const sortMode = SORT_MODE_MAP[sortModeParam] as CategoriesSortMode

  if (!sortMode) {
    return { notFound: true }
  }

  const categoriesCacheKey = createCategoriesCacheKey(sortMode)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const categories = await getCategories({
    db: adminDb,
    sortMode,
  })

  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const miniHashtags = await getHashtags({
    cacheKey: miniHashtagsCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  return {
    props: {
      fallback: {
        [miniHashtagsCacheKey]: miniHashtags,
        [categoriesCacheKey]: categories,
      },
      key: categoriesCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  getServerSidePropsFn as any
)

export default withAuthUser()(Feed as any)
