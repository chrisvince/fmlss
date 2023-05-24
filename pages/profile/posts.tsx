import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import UserPostsPage from '../../components/UserPostsPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import {
  createSidebarCategoriesCacheKey,
  createSidebarHashtagsCacheKey,
  createUserPostsCacheKey,
} from '../../utils/createCacheKeys'
import getUserPosts from '../../utils/data/userPosts/getUserPosts'
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

const UserPosts = ({ fallback }: PropTypes) => (
  <SWRConfig value={{ fallback }}>
    <UserPostsPage />
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

  const userPostsCacheKey = createUserPostsCacheKey(uid)
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarCategoriesCacheKey = createSidebarCategoriesCacheKey()
  const sidebarDataPromise = fetchSidebarData({ db: adminDb })

  if (isInternalRequest(req)) {
    const { sidebarHashtags, sidebarCategories } = await sidebarDataPromise
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

    return {
      props: {
        fallback: {
          [sidebarCategoriesCacheKey]: sidebarCategories,
          [sidebarHashtagsCacheKey]: sidebarHashtags,
        },
        key: userPostsCacheKey,
      },
    }
  }

  const [posts, { sidebarHashtags, sidebarCategories }] = await Promise.all([
    getUserPosts(uid, { db: adminDb, type: 'post' }),
    sidebarDataPromise,
  ])

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)

  return {
    props: {
      fallback: {
        [sidebarCategoriesCacheKey]: sidebarCategories,
        [sidebarHashtagsCacheKey]: sidebarHashtags,
        [userPostsCacheKey]: posts,
      },
      key: userPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)(getServerSidePropsFn as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserPosts as any)
