import firebase from 'firebase/app'
import 'firebase/firestore'
import {
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
import constants from '../functions/src/constants'
import type { Post } from '../types'
import mapPostDbToClient from '../utils/mapPostDbToClient'

const db = firebase.firestore()

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'
interface PropTypes {
  posts: Post[]
}

const Home = ({ posts }: PropTypes) => {
  return (
    <Page pageTitle="Home">
      <h1>Home</h1>
      <ComposePostButton />
      <Feed posts={posts} />
    </Page>
  )
}

const getServerSidePropsFn = async () => {
  const postsRef = await db
    .collection(constants.POSTS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get()

  const posts = postsRef.docs.map((doc) => mapPostDbToClient(doc))
  return {
    props: {
      posts,
    }
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(getServerSidePropsFn as any)

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Home as any)
