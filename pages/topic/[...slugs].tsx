import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import TopicPage from '../../components/TopicPage'
import { TopicSortMode, TopicsSortMode } from '../../types'
import {
  createTopicCacheKey,
  createTopicPostsCacheKey,
  createTopicsCacheKey,
} from '../../utils/createCacheKeys'
import getTopicPosts from '../../utils/data/posts/getTopicPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import getTopic from '../../utils/data/topic/getTopic'
import fetchSidebarFallbackData from '../../utils/data/sidebar/fetchSidebarData'
import slugify from '../../utils/slugify'
import getTopics from '../../utils/data/topics/getTopics'

const {
  GET_SERVER_SIDE_PROPS_TIME_LABEL,
  SUBTOPICS_ON_TOPIC_PAGE_LIMIT,
  TOPICS_ENABLED,
} = constants

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
  [key: string]: TopicSortMode
} = {
  latest: TopicSortMode.Latest,
  popular: TopicSortMode.Popular,
}

const getServerSidePropsFn = async ({
  AuthUser,
  params: { slugs = [] },
  query: { sort = TopicSortMode.Latest },
  req,
}: {
  AuthUser: AuthUser
  params: { slugs: string[] }
  query: { sort: TopicSortMode }
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
  const sortMode = SORT_MODE_MAP[sort] ?? TopicSortMode.Popular
  const topicPostsCacheKey = createTopicPostsCacheKey(path, { sortMode })
  const topicCacheKey = createTopicCacheKey(path)
  const sidebarDataPromise = fetchSidebarFallbackData({ db: adminDb })
  const topic = await getTopic(path, { db: adminDb })

  if (!topic) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

  const topicsCacheKey = createTopicsCacheKey({
    limit: SUBTOPICS_ON_TOPIC_PAGE_LIMIT,
    pageIndex: 0,
    parentTopicRef: topic.data.ref,
    sortMode: TopicsSortMode.Popular,
  })

  const topics = await getTopics({
    db: adminDb,
    limit: SUBTOPICS_ON_TOPIC_PAGE_LIMIT,
    parentTopicRef: topic.data.ref,
    sortMode: TopicsSortMode.Popular,
  })

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          ...sidebarFallbackData,
          [topicCacheKey]: topic,
          [topicsCacheKey]: topics,
        },
        path,
        key: topicCacheKey,
      },
    }
  }

  const [posts, sidebarFallbackData] = await Promise.all([
    getTopicPosts(path, {
      db: adminDb,
      uid,
      sortMode,
    }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [topicCacheKey]: topic,
        [topicPostsCacheKey]: posts,
        [topicsCacheKey]: topics,
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
