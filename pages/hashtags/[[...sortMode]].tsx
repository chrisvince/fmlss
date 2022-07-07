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
import { createHashtagsCacheKey } from '../../utils/createCacheKeys'
import getHashtags from '../../utils/data/hashtags/getHashtags'

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

  // @ts-expect-error
  await admin.app().delete()

  return {
    props: {
      fallback: {
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
