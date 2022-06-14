import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

import ComposePostButton from '../components/ComposePostButton'
import Feed from '../components/Feed'
import Page from '../components/Page'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import type { Post } from '../types'
import getPosts from '../utils/data/posts/getPosts'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'
interface PropTypes {
  posts: Post[]
}

const Home = ({ posts }: PropTypes) => {
  return (
    <Page pageTitle="Home">
      <h1>Home</h1>
      <ComposePostButton />
      <Feed initPosts={posts} />
    </Page>
  )
}

const getServerSidePropsFn = async ({ AuthUser }: { AuthUser: AuthUser }) => {
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id
  const posts = await getPosts({
    db: adminDb,
    includeFirebaseDocs: false,
    uid,
  })

  return {
    props: {
      posts,
    },
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Home as any)
