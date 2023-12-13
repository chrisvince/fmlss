import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import TopicPage from '../../components/TopicPage'
import { TopicSortMode } from '../../types'
import {
  createTopicCacheKey,
  createTopicPostsCacheKey,
  createSidebarHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getTopicPosts from '../../utils/data/posts/getTopicPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import getTopic from '../../utils/data/topic/getTopic'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'
import slugify from '../../utils/slugify'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL, TOPICS_ENABLED } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  path: string
}

const Topic = ({ fallback, path }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <TopicPage path={path} />
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
  params: { slugs = [] },
  query: { sort = 'latest' },
  req,
}: {
  AuthUser: AuthUser
  params: { slugs: string[] }
  query: { sort: string }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  const path = slugs.map(slugify).join('/')

  if (!TOPICS_ENABLED) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ??
    TopicSortMode.Latest) as TopicSortMode
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const topicPostsCacheKey = createTopicPostsCacheKey(path, { sortMode })
  const topicCacheKey = createTopicCacheKey(path)
  const sidebarDataPromise = fetchSidebarData({ db: adminDb })

  if (isInternalRequest(req)) {
    const { sidebarHashtags } = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
        path,
        key: topicCacheKey,
      },
    }
  }

  const [posts, topic, { sidebarHashtags }] = await Promise.all([
    getTopicPosts(path, {
      db: adminDb,
      uid,
      sortMode,
    }),
    getTopic(path, { db: adminDb }),
    sidebarDataPromise,
  ])

  if (!topic) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [topicCacheKey]: topic,
        [topicPostsCacheKey]: posts,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
      },
      path,
      key: topicCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR()(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getServerSidePropsFn as any
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser()(Topic as any)
