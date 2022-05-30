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
  const hasComments = !!post.comments.length
  return (
    <div>
      <h1>Post</h1>
      <div>id: {post.id}</div>
      <div>test: {post.test}</div>
      {hasComments && (
        <div>comments: {post.comments.map(({ id }) => id).join(', ')}</div>
      )}
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
  const paths = docs.docs.map(doc => ({
    params: {
      id: doc.id,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { id } = context.params as { id: string }

  const postRef = db.collection(constants.POSTS_COLLECTION).doc(id)
  const commentsRef = postRef.collection(constants.COMMENTS_COLLECTION)

  const postDoc = await postRef.get()
  if (!postDoc.exists) return { notFound: true }

  const commentDocs = await commentsRef.get()

  const post = postDoc.data()
  const comments = commentDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  return {
    props: {
      post: {
        id: postDoc.id,
        ...post,
        comments,
      },
    },
    revalidate: constants.REVALIDATE_TIME,
  }
}

export default PostPage
