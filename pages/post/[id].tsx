import { GetStaticPropsContext } from 'next'
import firebase from 'firebase'
import 'firebase/firestore'

import type { Post } from '../../types'
import constants from '../../constants'

const db = firebase.firestore()

interface PropTypes {
  post: Post
}

const PostPage = ({ post }: PropTypes) => {
  return (
    <div>
      <h1>Post</h1>
      <div>id: {post.id}</div>
      <div>test: {post.test}</div>
    </div>
  )
}

interface Path {
  params: {
    id: string
  }
}

export const getStaticPaths = async () => {
  const docs = await db.collection(constants.POSTS_COLLECTION).get()
  const paths: Path[] = []
  docs.forEach((doc) => paths.push({ params: { id: doc.id } }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { id } = context.params as { id: string }
  const doc = await db.collection(constants.POSTS_COLLECTION).doc(id).get()
  if (!doc.exists) return { notFound: true }

  return {
    props: {
      post: {
        id: doc.id,
        ...doc.data(),
      },
    },
    revalidate: constants.REVALIDATE_TIME,
  }
}

export default PostPage
