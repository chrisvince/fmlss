import { AuthUser, getFirebaseAdmin, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import UserPostsPage from '../../components/UserPostsPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import { Post } from '../../types'
import { createMiniCategoriesCacheKey, createMiniHashtagsCacheKey, createUserPostsCacheKey } from '../../utils/createCacheKeys'
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

const UserPosts = ({ fallback }: PropTypes) => {
  return (
    <SWRConfig value={{ fallback }}>
      <UserPostsPage />
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
  const userPostsCacheKey = createUserPostsCacheKey(uid)
  const posts = await getUserPosts(uid, {
    db: adminDb,
    type: 'post',
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
