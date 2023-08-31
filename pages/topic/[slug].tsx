import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import TopicPage from '../../components/TopicPage'
import type { TopicSortMode } from '../../types'
import {
  createTopicCacheKey,
  createTopicPostsCacheKey,
  createSidebarHashtagsCacheKey,
} from '../../utils/createCacheKeys'
import getTopicPosts from '../../utils/data/posts/getTopicPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import getTopic from '../../utils/data/topic/getTopic'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL, TOPICS_ENABLED } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
  slug: string
}

const Topic = ({ fallback, slug }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <TopicPage slug={slug} />
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
  params: { slug },
  query: { sort = 'latest' },
  req,
}: {
  AuthUser: AuthUser
  params: { slug: string }
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

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id
  const sortMode = (SORT_MODE_MAP[sort] ?? 'latest') as TopicSortMode
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const topicPostsCacheKey = createTopicPostsCacheKey(slug, { sortMode })
  const topicCacheKey = createTopicCacheKey(slug)
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

  const sidebarDataPromise = fetchSidebarData({ db: adminDb })

  if (isInternalRequest(req)) {
    const { sidebarHashtags } = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
        slug,
        key: topicCacheKey,
      },
    }
  }

  const [posts, topic, { sidebarHashtags }] = await Promise.all([
    getTopicPosts(slug, {
      db: adminDb,
      uid,
      sortMode,
    }),
    getTopic(slug, { db: adminDb }),
    sidebarDataPromise,
  ])

  if (!topic || posts.length === 0) {
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
      slug,
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
