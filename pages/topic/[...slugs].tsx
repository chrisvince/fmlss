import { AuthAction, withUser, withUserTokenSSR } from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import TopicPage from '../../components/TopicPage'
import { TopicSortMode, TopicsSortMode } from '../../types'
import {
  createTopicCacheKey,
  createTopicPostsCacheKey,
  createTopicsCacheKey,
} from '../../utils/createCacheKeys'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer from '../../utils/data/sidebar/getSidebarDataServer'
import slugify from '../../utils/slugify'
import PageSpinner from '../../components/PageSpinner'
import getTopicServer from '../../utils/data/topic/getTopicServer'
import getTopicsServer from '../../utils/data/topics/getTopicsServer'
import getTopicPostsServer from '../../utils/data/posts/getTopicPostsServer'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL, SUBTOPICS_ON_TOPIC_PAGE_LIMIT } =
  constants

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

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.RENDER,
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ user, params, query, req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const slugs = (params?.slugs as string[] | undefined) ?? []
  const sort = (query?.sort as string | undefined) ?? TopicSortMode.Popular
  const path = slugs.map(slugify).join('/')
  const uid = user?.id

  if (!uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const sortMode = SORT_MODE_MAP[sort] ?? TopicSortMode.Popular
  console.log('sortMode', sortMode)
  const topicPostsCacheKey = createTopicPostsCacheKey(path, { sortMode })

  console.log('topicPostsCacheKey', topicPostsCacheKey)
  const topicCacheKey = createTopicCacheKey(path)
  const sidebarDataPromise = getSidebarDataServer()
  const topic = await getTopicServer(path)

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

  const topics = await getTopicsServer({
    limit: SUBTOPICS_ON_TOPIC_PAGE_LIMIT,
    parentTopicRef: topic.data.ref,
    sortMode: TopicsSortMode.Popular,
  })

  console.log('topics', topics)

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

  console.log('path', path)
  const [posts, sidebarFallbackData] = await Promise.all([
    getTopicPostsServer(path, {
      uid,
      sortMode,
    }),
    sidebarDataPromise,
  ])

  console.log('postsNEW', posts)

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
})

export default withUser<PropTypes>({
  LoaderComponent: PageSpinner,
  whenAuthed: AuthAction.RENDER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
})(Topic)
