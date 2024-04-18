import { SWRConfig } from 'swr'
import UserRepliesPage from '../components/UserRepliesPage'
import { createUserRepliesCacheKey } from '../utils/createCacheKeys'
import constants from '../constants'
import isInternalRequest from '../utils/isInternalRequest'
import getSidebarDataServer from '../utils/data/sidebar/getSidebarDataServer'
import getUserPostsServer from '../utils/data/userPosts/getUserPostsServer'
import { PostType } from '../types'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../utils/auth/getUidFromCookies'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const UserReplies = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <UserRepliesPage />
  </SWRConfig>
)

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const uid = await getUidFromCookies(req.cookies)

  if (!uid) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const userRepliesCacheKey = createUserRepliesCacheKey(uid)
  const sidebarDataPromise = getSidebarDataServer()

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: sidebarFallbackData,
        key: userRepliesCacheKey,
      },
    }
  }

  const [posts, sidebarFallbackData] = await Promise.all([
    getUserPostsServer(uid, { type: PostType.Reply }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        ...sidebarFallbackData,
        [userRepliesCacheKey]: posts,
      },
      key: userRepliesCacheKey,
    },
  }
}

export default UserReplies
