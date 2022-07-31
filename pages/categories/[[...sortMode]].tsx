import {
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import CategoriesPage from '../../components/CategoriesPage'
import type { CategoriesSortMode } from '../../types'
import {
  createCategoriesCacheKey,
  createMiniHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import constants from '../../constants'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import { NextApiRequest } from 'next'
import isInternalRequest from '../../utils/isInternalRequest'

const {
  GET_SERVER_SIDE_PROPS_TIME_LABEL,
  MINI_LIST_CACHE_TIME,
  MINI_LIST_COUNT,
} = constants

interface PropTypes {
  fallback: {
    [key: string]: any
  }
}

const Categories = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <CategoriesPage />
  </SWRConfig>
)

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
}

const getServerSidePropsFn = async ({
  params: { sortMode: sortModeArray },
  req,
}: {
  params: { sortMode: string }
  req: NextApiRequest,
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  if (sortModeArray?.length > 1) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'popular'
  const sortMode = SORT_MODE_MAP[sortModeParam] as CategoriesSortMode

  if (!sortMode) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  const categoriesCacheKey = createCategoriesCacheKey(sortMode)
  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()

  const miniHashtags = await getHashtags({
    cacheKey: miniHashtagsCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  if (isInternalRequest(req)) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      props: {
        fallback: {
          [miniHashtagsCacheKey]: miniHashtags,
          [categoriesCacheKey]: null,
        },
        key: categoriesCacheKey,
      },
    }
  }

  const categories = await getCategories({
    db: adminDb,
    sortMode,
  })

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
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

export default withAuthUser()(Categories as any)
