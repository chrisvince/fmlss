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
import { createUserLikesCacheKey } from '../../utils/createCacheKeys'
import getUserLikes from '../../utils/data/userLikes/getUserLikes'

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
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id

  if (!uid) {
    return { notFound: true }
  }
  const userLikesCacheKey = createUserLikesCacheKey(uid)
  const posts = await getUserLikes(uid, {
    db: adminDb,
  })

  return {
    props: {
      key: userLikesCacheKey,
      fallback: {
        [userLikesCacheKey]: posts,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserLikes as any)
