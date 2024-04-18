import { SWRConfig } from 'swr'
import UserLikesPage from '../components/UserLikesPage'
import { createUserLikesCacheKey } from '../utils/createCacheKeys'
import constants from '../constants'
import isInternalRequest from '../utils/isInternalRequest'
import getSidebarDataServer from '../utils/data/sidebar/getSidebarDataServer'
import getUserLikesServer from '../utils/data/userLikes/getUserLikesServer'
import { GetServerSideProps } from 'next'
import getUidFromCookies from '../utils/auth/getUidFromCookies'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

interface PropTypes {
  fallback: {
    [key: string]: unknown
  }
}

const UserLikes = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <UserLikesPage />
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

  const userLikesCacheKey = createUserLikesCacheKey(uid)
  const sidebarDataPromise = getSidebarDataServer()

  if (isInternalRequest(req)) {
    const sidebarFallbackData = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        key: userLikesCacheKey,
        fallback: sidebarFallbackData,
      },
    }
  }

  const [posts, sidebarFallbackData] = await Promise.all([
    getUserLikesServer(uid),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      key: userLikesCacheKey,
      fallback: {
        ...sidebarFallbackData,
        [userLikesCacheKey]: posts,
      },
    },
  }
}

export default UserLikes
