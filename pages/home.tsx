import {
  AuthUser,
  getFirebaseAdmin,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { useState } from 'react'

import ComposePostButton from '../components/ComposePostButton'
import Feed from '../components/Feed'

import Page from '../components/Page'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import constants from '../constants'
import type { Post } from '../types'
import mapPostDbToClient from '../utils/mapPostDbToClient'

const {
  POSTS_COLLECTION,
  USERS_COLLECTION,
  AUTHORED_POSTS_COLLECTION,
} = constants

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'
interface PropTypes {
  posts: Post[]
}

const Home = ({ posts: postsProp }: PropTypes) => {
  const [posts, setPosts] = useState<Post[]>(postsProp)

  return (
    <Page pageTitle="Home">
      <h1>Home</h1>
      <ComposePostButton />
      <Feed posts={posts} />
    </Page>
  )
}

const getServerSidePropsFn = async ({ AuthUser }: { AuthUser: AuthUser }) => {
  const db = getFirebaseAdmin().firestore()
  const uid = AuthUser.id

  const postsRef = await db
    .collection(POSTS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get()
  
  const postsPromise = postsRef.docs.map(async (doc) => {
    const authoredPostsRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .where('originReference', '==', doc.ref)
      .limit(1)
      .get()

    const createdByUser = !authoredPostsRef.empty

    return mapPostDbToClient(doc, createdByUser)
  })

  const posts = await Promise.all(postsPromise)

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
