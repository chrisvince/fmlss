import { AuthUser, getFirebaseAdmin, withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import { SWRConfig } from 'swr'
import UserPostsPage from '../../components/UserPostsPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import { Post } from '../../types'
import { createUserPostsCacheKey } from '../../utils/createCacheKeys'
import getUserPosts from '../../utils/data/userPosts/getUserPosts'

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
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id

  if (!uid) {
    return { notFound: true }
  }
  const userPostsCacheKey = createUserPostsCacheKey(uid)
  const posts = await getUserPosts(uid, {
    db: adminDb,
  })

  return {
    props: {
      key: userPostsCacheKey,
      fallback: {
        [userPostsCacheKey]: posts,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserPosts as any)
