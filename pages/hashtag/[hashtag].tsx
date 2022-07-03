import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HashtagPage from '../../components/HashtagPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import type { Post } from '../../types'
import { FeedSortMode } from '../../types/FeedSortMode'
import { createHashtagPostsCacheKey } from '../../utils/createCacheKeys'
import getHashtagPosts from '../../utils/data/posts/getHashtagPosts'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'
const DEFAULT_POST_TYPE = 'post'

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
  hashtag: string
}

const Hashtag = ({ fallback, hashtag }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <HashtagPage hashtag={hashtag} />
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
  params: { hashtag },
  query: { sort = 'latest' },
}: {
  AuthUser: AuthUser
  params: { hashtag: string }
  query: { sort: string }
}) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ?? 'latest') as FeedSortMode

  const hashtagPostsCacheKey = createHashtagPostsCacheKey(
    hashtag,
    DEFAULT_POST_TYPE,
    sortMode,
  )
  const posts = await getHashtagPosts(hashtag, {
    db: adminDb,
    uid,
    showType: DEFAULT_POST_TYPE,
    sortMode,
  })

  // @ts-expect-error
  await admin.app().delete()

  return {
    props: {
      fallback: {
        [hashtagPostsCacheKey]: posts,
      },
      hashtag,
      key: hashtagPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Hashtag as any)
