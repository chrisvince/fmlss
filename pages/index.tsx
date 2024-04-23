import { SWRConfig } from 'swr'

import FeedPage from '../components/FeedPage'
import { FeedSortMode } from '../types'
import {
  createPostFeedSWRGetKey,
  createUserCacheKey,
} from '../utils/createCacheKeys'
import constants from '../constants'
import isInternalRequest from '../utils/isInternalRequest'
import getSidebarDataServer from '../utils/data/sidebar/getSidebarDataServer'
import getPostFeedServer from '../utils/data/posts/getPostFeedServer'
import getUserDataServer from '../utils/data/user/getUserDataServer'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../utils/auth/getUidFromCookies'
import { unstable_serialize } from 'swr/infinite'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const Feed = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <FeedPage sortMode={FeedSortMode.Latest} />
  </SWRConfig>
)

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const uid = await getUidFromCookies(req.cookies)

  if (!uid) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    }
  }

  const postFeedCacheKey = createPostFeedSWRGetKey({
    sortMode: FeedSortMode.Latest,
    uid,
  })

  const userCacheKey = createUserCacheKey(uid)
  const sidebarDataPromise = getSidebarDataServer()

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
      },
    }
  }

  const [posts, sidebarFallbackData, userData] = await Promise.all([
    getPostFeedServer({
      sortMode: FeedSortMode.Latest,
      uid,
    }),
    sidebarDataPromise,
    getUserDataServer(uid),
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        [unstable_serialize(postFeedCacheKey)]: [posts],
        [userCacheKey]: userData,
        ...sidebarFallbackData,
      },
    },
  }
}

export default Feed
