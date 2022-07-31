import { AuthUser, getFirebaseAdmin, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import UserPostsPage from '../../components/UserPostsPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import { createMiniCategoriesCacheKey, createMiniHashtagsCacheKey, createUserPostsCacheKey } from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getUserPosts from '../../utils/data/userPosts/getUserPosts'
import constants from '../../constants'
import isInternalRequest from '../../utils/isInternalRequest'
import { NextApiRequest } from 'next'

const {
  GET_SERVER_SIDE_PROPS_TIME_LABEL,
  MINI_LIST_CACHE_TIME,
  MINI_LIST_COUNT,
} = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: any
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
  req: NextApiRequest,
}) => {
  console.time(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id

  if (!uid) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return { notFound: true }
  }
  const userPostsCacheKey = createUserPostsCacheKey(uid)
  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const miniCategoriesCacheKey = createMiniCategoriesCacheKey()

  const miniHashtags = await getHashtags({
    cacheKey: miniHashtagsCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  const miniCategories = await getCategories({
    cacheKey: miniCategoriesCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  if (isInternalRequest(req)) {
    console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
    return {
      props: {
        fallback: {
          [miniCategoriesCacheKey]: miniCategories,
          [miniHashtagsCacheKey]: miniHashtags,
          [userPostsCacheKey]: null,
        },
        key: userPostsCacheKey,
      },
    }
  }

  const posts = await getUserPosts(uid, {
    db: adminDb,
    type: 'post',
  })

  console.timeEnd(GET_SERVER_SIDE_PROPS_TIME_LABEL)
  return {
    props: {
      fallback: {
        [miniCategoriesCacheKey]: miniCategories,
        [miniHashtagsCacheKey]: miniHashtags,
        [userPostsCacheKey]: posts,
      },
      key: userPostsCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserPosts as any)
