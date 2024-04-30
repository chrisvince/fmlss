import { SWRConfig } from 'swr'

import TopicsPage from '../../components/TopicsPage'
import { TopicsSortMode } from '../../types'
import {
  createTopicCacheKey,
  createTopicsSWRGetKey,
} from '../../utils/createCacheKeys'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import getSidebarDataServer from '../../utils/data/sidebar/getSidebarDataServer'
import { SidebarResourceKey } from '../../utils/data/sidebar/getSidebarDataServer'
import getTopicsServer from '../../utils/data/topics/getTopicsServer'
import getTopicServer from '../../utils/data/topic/getTopicServer'
import { GetServerSideProps } from 'next'
import { unstable_serialize } from 'swr/infinite'

const { TOPICS_ENABLED, GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface Props {
  fallback: {
    [key: string]: unknown
  }
  parentTopicPath: string | null
}

const Topics = ({ fallback, parentTopicPath }: Props) => (
  <SWRConfig value={{ fallback }}>
    <TopicsPage parentTopicPath={parentTopicPath} />
  </SWRConfig>
)

const SORT_MODE_MAP: {
  [key: string]: TopicsSortMode
} = {
  latest: TopicsSortMode.Latest,
  popular: TopicsSortMode.Popular,
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  req,
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const slugs = (params?.slugs as string[] | undefined) ?? []
  const sort = (query?.sort as string | undefined) ?? TopicsSortMode.Popular

  if (!TOPICS_ENABLED) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

  const sortMode = SORT_MODE_MAP[sort] ?? TopicsSortMode.Popular
  const parentTopicPath = slugs.join('/')

  const parentTopicPromise = parentTopicPath
    ? getTopicServer(parentTopicPath)
    : null

  const sidebarDataPromise = getSidebarDataServer({
    exclude: [SidebarResourceKey.Topics],
  })

  if (isInternalRequest(req)) {
    const [parentTopic, sidebarFallbackData] = await Promise.all([
      parentTopicPromise,
      sidebarDataPromise,
    ])

    if (parentTopicPath && !parentTopic) {
      console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

      return {
        notFound: true,
      }
    }

    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          ...(parentTopicPath && parentTopic
            ? {
                [createTopicCacheKey(parentTopicPath)]: parentTopic,
              }
            : {}),
          ...sidebarFallbackData,
        },
        parentTopicPath,
      },
    }
  }

  const parentTopic = await parentTopicPromise

  const topicsCacheKey = createTopicsSWRGetKey({
    parentTopicRef: parentTopic?.data.ref,
    sortMode,
  })

  const [topics, sidebarFallbackData] = await Promise.all([
    getTopicsServer({ sortMode, parentTopicRef: parentTopic?.data.ref }),
    sidebarDataPromise,
  ])

  if (parentTopicPath && !parentTopic) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      notFound: true,
    }
  }

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        ...(parentTopicPath && parentTopic
          ? {
              [createTopicCacheKey(parentTopicPath)]: parentTopic,
            }
          : {}),
        ...sidebarFallbackData,
        [unstable_serialize(topicsCacheKey)]: topics,
      },
      parentTopicPath,
    },
  }
}

export default Topics
