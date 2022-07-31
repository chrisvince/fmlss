import {
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HashtagsPage from '../../components/HashtagsPage'
import type { HashtagsSortMode } from '../../types'
import { createHashtagsCacheKey, createMiniCategoriesCacheKey } from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import constants from '../../constants'
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

const Hashtags = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <HashtagsPage />
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
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  if (sortModeArray?.length > 1) {
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'popular'
  const sortMode = SORT_MODE_MAP[sortModeParam] as HashtagsSortMode

  if (!sortMode) {
    return { notFound: true }
  }

  const hashtagsCacheKey = createHashtagsCacheKey(sortMode)
  const miniCategoriesCacheKey = createMiniCategoriesCacheKey()

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()

  const miniCategories = await getCategories({
    cacheKey: miniCategoriesCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  if (isInternalRequest(req)) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      props: {
        fallback: {
          [miniCategoriesCacheKey]: miniCategories,
          [hashtagsCacheKey]: null,
        },
        key: hashtagsCacheKey,
      },
    }
  }

  const hashtags = await getHashtags({
    db: adminDb,
    sortMode,
  })

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [miniCategoriesCacheKey]: miniCategories,
        [hashtagsCacheKey]: hashtags,
      },
      key: hashtagsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  getServerSidePropsFn as any
)

export default withAuthUser()(Hashtags as any)
