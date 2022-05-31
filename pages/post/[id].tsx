import { GetStaticPropsContext } from 'next'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { Post } from '../../types'
import constants from '../../constants'
import PostReplyForm from '../../components/PostReplyForm'
import mapPostDbToClient from '../../utils/mapPostDbToClient'

const db = firebase.firestore()

interface PropTypes {
  post: Post
}

const PostPage = ({ post: postProp }: PropTypes) => {
  const [post, setPost] = useState<Post>(postProp)
  const [replies, setReplies] = useState<Post[]>(postProp.posts ?? [])
  const hasReplies = !!replies.length

  const createdAt =
    post.createdAt &&
    new Date(post.createdAt).toLocaleString()

  useEffect(() => {
    const unsubscribeReplies = db
      .collection(`${post.reference}/posts`)
      .orderBy('createdAt')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(({ type }) => {
          if (type !== 'added') return
          const docData = snapshot.docs.map(doc => mapPostDbToClient(doc))
          setReplies(docData)
        })
      })

    const unsubscribePost = db
      .doc(post.reference)
      .onSnapshot(doc => {
        const newPost = mapPostDbToClient(doc)
        setPost(newPost)
      })

      return () => {
        unsubscribeReplies()
        unsubscribePost()
      }
  }, [post.reference])

  return (
    <div>
      <h1>Post</h1>
      <div>id: {post.id}</div>
      <div>body: {post.body}</div>
      <div>created at: {createdAt}</div>
      <div>reference: {post.reference}</div>
      <div>
        <Link href={`/post/${post.id}`}>Link</Link>
      </div>
      {post.parentId && (
        <div>
          <Link href={`/post/${post.parentId}`}>
            <a>Parent</a>
          </Link>
        </div>
      )}
      {hasReplies && (
        <div>
          <h2>Replies ({post.postsCount})</h2>
          <ul>
            {replies.map(({ id, body }) => (
              <li key={id}>
                <Link href={`/post/${id}`}>
                  <a>{id} / {body}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <PostReplyForm replyingToReference={post.reference} />
    </div>
  )
}

export const getStaticPaths = async () => {
  const docs = await db
    .collectionGroup(constants.POSTS_COLLECTION)
    .get()

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

  const postsRef = await db
    .collectionGroup(constants.POSTS_COLLECTION)
    .where('id', '==', id)
    .limit(1)
    .get()

  const postDoc = postsRef.docs[0]
  
  if (!postDoc.exists) return { notFound: true }

  const postRef = postDoc.ref
  const repliesRef = postRef.collection(constants.POSTS_COLLECTION)
  const replyDocs = await repliesRef.orderBy('createdAt').get()
  const post = mapPostDbToClient(postDoc, replyDocs.docs)

  return {
    props: {
      key: postDoc.id,
      post,
    },
    revalidate: constants.REVALIDATE_TIME,
  }
}

export default PostPage
