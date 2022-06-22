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
import { createUserRepliesCacheKey } from '../../utils/createCacheKeys'
import getUserPosts from '../../utils/data/userPosts/getUserPosts'

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
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id

  if (!uid) {
    return { notFound: true }
  }
  const userRepliesCacheKey = createUserRepliesCacheKey(uid)
  const posts = await getUserPosts(uid, {
    db: adminDb,
    type: 'reply',
  })

  return {
    props: {
      key: userRepliesCacheKey,
      fallback: {
        [userRepliesCacheKey]: posts,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserReplies as any)
