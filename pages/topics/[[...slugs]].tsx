import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import TopicsPage from '../../components/TopicsPage'
import { TopicsSortMode } from '../../types'
import {
  createTopicsCacheKey,
  createSidebarHashtagsCacheKey,
  createTopicCacheKey,
} from '../../utils/createCacheKeys'
import getTopics from '../../utils/data/topics/getTopics'
import constants from '../../constants'
import { NextApiRequest } from 'next'
import isInternalRequest from '../../utils/isInternalRequest'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'
import { SidebarResourceKey } from '../../utils/data/sidebar/fetchSidebarData'
import getTopic from '../../utils/data/topic/getTopic'

const { TOPICS_ENABLED, GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  parentTopicPath: string | null
}

const Topics = ({ fallback, parentTopicPath }: PropTypes) => (
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

const getServerSidePropsFn = async ({
  params: { slugs = [] },
  req,
  query: { sort = TopicsSortMode.Popular },
}: {
  AuthUser: AuthUser
  params: { slugs: string[] }
  query: { sort: string }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  if (!TOPICS_ENABLED) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

  const sortMode = SORT_MODE_MAP[sort] ?? TopicsSortMode.Popular
  const parentTopicPath = slugs.join('/') || null
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()

  const parentTopicPromise = parentTopicPath
    ? getTopic(parentTopicPath, {
        db: adminDb,
      })
    : null

  const sidebarDataPromise = fetchSidebarData({
    db: adminDb,
    exclude: [SidebarResourceKey.TOPICS],
  })

  if (isInternalRequest(req)) {
    const [parentTopic, { sidebarHashtags }] = await Promise.all([
      parentTopicPromise,
      sidebarDataPromise,
    ])

    const topicsCacheKey = createTopicsCacheKey({
      sortMode,
      parentTopicRef: parentTopic?.data.ref,
    })

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
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
        key: topicsCacheKey,
        parentTopicPath,
      },
    }
  }

  const parentTopic = await parentTopicPromise

  const topicsCacheKey = createTopicsCacheKey({
    sortMode,
    parentTopicRef: parentTopic?.data.ref,
  })

  const [topics, { sidebarHashtags }] = await Promise.all([
    getTopics({ db: adminDb, sortMode, parentTopicRef: parentTopic?.data.ref }),
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
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [topicsCacheKey]: topics,
      },
      key: topicsCacheKey,
      parentTopicPath,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Topics as any)
