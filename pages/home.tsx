import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { SWRConfig } from 'swr'

import HomePage from '../components/HomePage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import type { Post } from '../types'
import { createPostFeedCacheKey } from '../utils/createCacheKeys'
import getPostFeed from '../utils/data/posts/getPostFeed'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'
const postFeedCacheKey = createPostFeedCacheKey('latest')
interface PropTypes {
  fallback: {
    [key: string]: Post[]
  }
}

const Home = ({ fallback }: PropTypes) => {
  return (
    <SWRConfig value={{ fallback }}>
      <HomePage />
    </SWRConfig>
  )
}

const getServerSidePropsFn = async ({ AuthUser }: { AuthUser: AuthUser }) => {
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id
  const posts = await getPostFeed({
    db: adminDb,
    uid,
  })

  return {
    props: {
      fallback: {
        [postFeedCacheKey]: posts,
      },
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Home as any)
