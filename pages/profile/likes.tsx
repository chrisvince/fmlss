import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import UserLikesPage from '../../components/UserLikesPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import {
  createSidebarTopicsCacheKey,
  createSidebarHashtagsCacheKey,
  createUserLikesCacheKey,
} from '../../utils/createCacheKeys'
import getUserLikes from '../../utils/data/userLikes/getUserLikes'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'
import checkIfUserHasUsername from '../../utils/data/user/checkIfUserHasUsername'
import fetchSidebarData from '../../utils/data/sidebar/fetchSidebarData'

const { GET_SERVER_SIDE_PROPS_TIME_LABEL } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

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

const getServerSidePropsFn = async ({
  AuthUser,
  req,
}: {
  AuthUser: AuthUser
  req: NextApiRequest
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id

  if (!uid) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }

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

  const userLikesCacheKey = createUserLikesCacheKey(uid)
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarTopicsCacheKey = createSidebarTopicsCacheKey()
  const sidebarDataPromise = fetchSidebarData({ db: adminDb })

  if (isInternalRequest(req)) {
    const { sidebarHashtags, sidebarTopics } = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        key: userLikesCacheKey,
        fallback: {
          [sidebarTopicsCacheKey]: sidebarTopics,
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
      },
    }
  }

  const [posts, { sidebarHashtags, sidebarTopics }] = await Promise.all([
    getUserLikes(uid, { db: adminDb }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      key: userLikesCacheKey,
      fallback: {
        [sidebarTopicsCacheKey]: sidebarTopics,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [userLikesCacheKey]: posts,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserLikes as any)
