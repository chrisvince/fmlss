import {
  AuthUser,
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
    [key: string]: unknown
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
  AuthUser,
  params: { sortMode: sortModeArray },
  req,
}: {
  AuthUser: AuthUser
  params: { sortMode: string }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  if (!CATEGORIES_ENABLED) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

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
          [miniHashtagsCacheKey]: miniHashtags,
          [categoriesCacheKey]: null,
        },
        key: categoriesCacheKey,
      },
    }
  }

  const [categories, miniHashtags] = await Promise.all([
    getCategories({ db: adminDb, sortMode }),
    getMiniHashtags(),
  ])

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

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Categories as any)
