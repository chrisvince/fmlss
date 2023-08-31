import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import TopicsPage from '../../components/TopicsPage'
import type { TopicsSortMode } from '../../types'
import {
  createTopicsCacheKey,
  createSidebarHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getTopics from '../../utils/data/topics/getTopics'
import constants from '../../constants'
import { NextApiRequest } from 'next'
import isInternalRequest from '../../utils/isInternalRequest'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'
import { SidebarResourceKey } from '../../utils/data/sidebar/fetchSidebarData'

const { TOPICS_ENABLED, GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Topics = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <TopicsPage />
  </SWRConfig>
)

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
}

const getServerSidePropsFn = async ({
  AuthUser,
  params: { sortMode: sortModeArray },
  req,
}: {
  AuthUser: AuthUser
  params: { sortMode: string }
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  if (!TOPICS_ENABLED) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      notFound: true,
    }
  }

  if (sortModeArray?.length > 1) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  const sortModeParam = sortModeArray?.[0] ?? 'popular'
  const sortMode = SORT_MODE_MAP[sortModeParam] as TopicsSortMode

  if (!sortMode) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

  const topicsCacheKey = createTopicsCacheKey(sortMode)
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const userHasUsername = await checkIfUserHasUsername(uid, { db: adminDb })

  if (uid && !userHasUsername) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      redirect: {
        destination: '/sign-up/username',
        permanent: false,
      },
    }
  }

  const sidebarDataPromise = fetchSidebarData({
    db: adminDb,
    exclude: [SidebarResourceKey.TOPICS],
  })

  if (isInternalRequest(req)) {
    const { sidebarHashtags } = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
        key: topicsCacheKey,
      },
    }
  }

  const [topics, { sidebarHashtags }] = await Promise.all([
    getTopics({ db: adminDb, sortMode }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [topicsCacheKey]: topics,
      },
      key: topicsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Topics as any)
