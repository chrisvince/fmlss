import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HashtagPage from '../../components/HashtagPage'
import { HashtagSortMode } from '../../types'
import {
  createHashtagPostsCacheKey,
  createSidebarTopicsCacheKey,
  createSidebarHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getHashtagPosts, {
  HashtagShowType,
} from '../../utils/data/posts/getHashtagPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const DEFAULT_POST_TYPE = HashtagShowType.Post

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  slug: string
}

const Hashtag = ({ fallback, slug }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <HashtagPage slug={slug} />
  </SWRConfig>
)

const SORT_MODE_MAP: {
  [key: string]: HashtagSortMode
} = {
  [HashtagSortMode.Latest]: HashtagSortMode.Latest,
  [HashtagSortMode.Popular]: HashtagSortMode.Popular,
}

const getServerSidePropsFn = async ({
  AuthUser,
  params: { slug },
  query: { sort = HashtagSortMode.Popular },
  req,
}: {
  AuthUser: AuthUser
  params: { slug: string }
  query: { sort: HashtagSortMode }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ??
    HashtagSortMode.Popular) as HashtagSortMode

  const hashtagPostsCacheKey = createHashtagPostsCacheKey(
    slug,
    DEFAULT_POST_TYPE,
    sortMode
  )
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarTopicsCacheKey = createSidebarTopicsCacheKey()
  const sidebarDataPromise = fetchSidebarData({ db: adminDb })

  if (isInternalRequest(req)) {
    const { sidebarHashtags, sidebarTopics } = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          [sidebarTopicsCacheKey]: sidebarTopics,
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
        slug,
        key: hashtagPostsCacheKey,
      },
    }
  }

  const [posts, { sidebarHashtags, sidebarTopics }] = await Promise.all([
    getHashtagPosts(slug, {
      db: adminDb,
      uid,
      showType: DEFAULT_POST_TYPE,
      sortMode,
    }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [sidebarTopicsCacheKey]: sidebarTopics,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [hashtagPostsCacheKey]: posts,
      },
      slug,
      key: hashtagPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getServerSidePropsFn as any
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser()(Hashtag as any)
