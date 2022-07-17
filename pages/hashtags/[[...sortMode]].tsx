import {
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HashtagsPage from '../../components/HashtagsPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import type { HashtagsSortMode, Post } from '../../types'
import { createHashtagsCacheKey, createMiniCategoriesCacheKey } from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import constants from '../../constants'

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
}

const Feed = ({ fallback }: PropTypes) => {
  return (
    <SWRConfig value={{ fallback }}>
      <HashtagsPage />
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
  const sortMode = SORT_MODE_MAP[sortModeParam] as HashtagsSortMode

  if (!sortMode) {
    return { notFound: true }
  }

  const hashtagsCacheKey = createHashtagsCacheKey(sortMode)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const hashtags = await getHashtags({
    db: adminDb,
    sortMode,
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
        [hashtagsCacheKey]: hashtags,
      },
      key: hashtagsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Feed as any)
