import { SWRConfig } from 'swr'

import TopicPage from '../../components/TopicPage'
import { TopicSortMode, TopicsSortMode } from '../../types'
import {
  createTopicCacheKey,
  createTopicPostsSWRGetKey,
  createTopicsCacheKey,
} from '../../utils/createCacheKeys'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer from '../../utils/data/sidebar/getSidebarDataServer'
import slugify from '../../utils/slugify'
import getTopicServer from '../../utils/data/topic/getTopicServer'
import getTopicsServer from '../../utils/data/topics/getTopicsServer'
import getTopicPostsServer from '../../utils/data/posts/getTopicPostsServer'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../../utils/auth/getUidFromCookies'
import { unstable_serialize } from 'swr/infinite'
import handleSWRError from '../../utils/handleSWRError'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL, SUBTOPICS_ON_TOPIC_PAGE_LIMIT } =
  constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  path: string
}

const Topic = ({ fallback, path }: PropTypes) => (
  <SWRConfig value={{ fallback, onError: handleSWRError }}>
    <TopicPage path={path} />
  </SWRConfig>
)

const SORT_MODE_MAP: {
  [key: string]: TopicSortMode
} = {
  latest: TopicSortMode.Latest,
  popular: TopicSortMode.Popular,
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  req,
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const slugs = (params?.slugs as string[] | undefined) ?? []
  const sort = (query?.sort as string | undefined) ?? TopicSortMode.Popular
  const path = slugs.map(slugify).join('/')
  const uid = await getUidFromCookies(req.cookies)
  const sortMode = SORT_MODE_MAP[sort] ?? TopicSortMode.Popular

  const topicPostsCacheKey = createTopicPostsSWRGetKey({
    path,
    sortMode,
    uid,
  })

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
        key: topic.data.slug,
        path,
      },
    }
  }

  const [posts, sidebarFallbackData] = await Promise.all([
    getTopicPostsServer(path, {
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
        [unstable_serialize(topicPostsCacheKey)]: posts,
        [topicsCacheKey]: topics,
      },
      key: topic.data.slug,
      path,
    },
  }
}

export default Topic
