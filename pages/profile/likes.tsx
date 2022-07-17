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
import { Post } from '../../types'
import { createMiniCategoriesCacheKey, createMiniHashtagsCacheKey, createUserLikesCacheKey } from '../../utils/createCacheKeys'
import getCategories from '../../utils/data/categories/getCategories'
import getHashtags from '../../utils/data/hashtags/getHashtags'
import getUserLikes from '../../utils/data/userLikes/getUserLikes'
import constants from '../../constants'

const { MINI_LIST_CACHE_TIME, MINI_LIST_COUNT } = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
}

const UserLikes = ({ fallback }: PropTypes) => {
  return (
    <SWRConfig value={{ fallback }}>
      <UserLikesPage />
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
  const userLikesCacheKey = createUserLikesCacheKey(uid)
  const posts = await getUserLikes(uid, {
    db: adminDb,
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

  // @ts-expect-error
  await admin.app().delete()

  return {
    props: {
      key: userLikesCacheKey,
      fallback: {
        [miniCategoriesCacheKey]: miniCategories,
        [miniHashtagsCacheKey]: miniHashtags,
        [userLikesCacheKey]: posts,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserLikes as any)
