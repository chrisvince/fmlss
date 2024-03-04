import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HashtagsPage from '../../components/HashtagsPage'
import type { HashtagsSortMode } from '../../types'
import { createHashtagsCacheKey } from '../../utils/createCacheKeys'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import constants from '../../constants'
import { NextApiRequest } from 'next'
import isInternalRequest from '../../utils/isInternalRequest'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import fetchSidebarFallbackData, {
  SidebarResourceKey,
} from '../../utils/data/sidebar/fetchSidebarData'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: unknown
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
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()

  const sidebarDataPromise = fetchSidebarFallbackData({
    db: adminDb,
    exclude: [SidebarResourceKey.Hashtags],
  })

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        key: hashtagsCacheKey,
      },
    }
  }

  const [hashtags, sidebarFallbackData] = await Promise.all([
    getHashtags({ db: adminDb, sortMode }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [hashtagsCacheKey]: hashtags,
      },
      key: hashtagsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Hashtags as any)
