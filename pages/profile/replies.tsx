import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import UserRepliesPage from '../../components/UserRepliesPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import { Post } from '../../types'
import { createMiniCategoriesCacheKey, createMiniHashtagsCacheKey, createUserRepliesCacheKey } from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getUserPosts from '../../utils/data/userPosts/getUserPosts'
import constants from '../../constants'

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
}

const UserReplies = ({ fallback }: PropTypes) => {
  return (
    <SWRConfig value={{ fallback }}>
      <UserRepliesPage />
    </SWRConfig>
  )
}

const getServerSidePropsFn = async ({
  AuthUser,
}: {
  AuthUser: AuthUser
  params: {
    hashtag: string
  }
}) => {
  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()
  const uid = AuthUser.id

  if (!uid) {
    return { notFound: true }
  }
  const userRepliesCacheKey = createUserRepliesCacheKey(uid)
  const posts = await getUserPosts(uid, {
    db: adminDb,
    type: 'reply',
  })

  const miniHashtagsCacheKey = createMiniHashtagsCacheKey()
  const miniHashtags = await getHashtags({
    cacheKey: miniHashtagsCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  const miniCategoriesCacheKey = createMiniCategoriesCacheKey()
  const miniCategories = await getCategories({
    cacheKey: miniCategoriesCacheKey,
    cacheTime: MINI_LIST_CACHE_TIME,
    db: adminDb,
    limit: MINI_LIST_COUNT,
  })

  return {
    props: {
      fallback: {
        [miniCategoriesCacheKey]: miniCategories,
        [miniHashtagsCacheKey]: miniHashtags,
        [userRepliesCacheKey]: posts,
      },
      key: userRepliesCacheKey,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserReplies as any)
