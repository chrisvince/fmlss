import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HashtagsPage from '../../components/HashtagsPage'
import type { HashtagsSortMode } from '../../types'
import {
  createHashtagsCacheKey,
  createMiniCategoriesCacheKey,
} from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import constants from '../../constants'
import { NextApiRequest } from 'next'
import isInternalRequest from '../../utils/isInternalRequest'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'

const {
  CATEGORIES_ENABLED,
  GET_SERVER_SIDE_PROPS_TIME_LABEL,
  MINI_LIST_CACHE_TIME,
  MINI_LIST_COUNT,
} = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

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
  AuthUser,
  params: { sortMode: sortModeArray },
  req,
}: {
  AuthUser: AuthUser
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
  const uid = AuthUser.id
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

  const miniCategories = CATEGORIES_ENABLED
    ? await getCategories({
        cacheKey: miniCategoriesCacheKey,
        cacheTime: MINI_LIST_CACHE_TIME,
        db: adminDb,
        limit: MINI_LIST_COUNT,
      })
    : []

  if (isInternalRequest(req)) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      props: {
        fallback: {
          ...(CATEGORIES_ENABLED
            ? { [miniCategoriesCacheKey]: miniCategories }
            : {}),
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

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Hashtags as any)
