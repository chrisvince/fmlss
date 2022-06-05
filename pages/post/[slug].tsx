import Link from 'next/link'
import { useState } from 'react'
import { AuthUser, getFirebaseAdmin, withAuthUserTokenSSR } from 'next-firebase-auth'

import type { Post } from '../../types'
import constants from '../../constants'
import PostReplyForm from '../../components/PostReplyForm'
import mapPostDbToClient from '../../utils/mapPostDbToClient'
import useIsNewPost from '../../utils/useIsNewPost'

const {
  POSTS_COLLECTION,
  USERS_COLLECTION,
  AUTHORED_POSTS_COLLECTION,
  AUTHORED_REPLIES_COLLECTION,
} = constants

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

  const isNewReply = useIsNewPost(post.posts, `${post.reference}/posts`, {
    sortDirection: 'asc',
  })

  return (
    <div>
      <h1>Post</h1>
      <div>id: {post.id}</div>
      <div>body: {post.body}</div>
      {post.createdByUser && <div>Created by me!</div>}
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
      {isNewReply && <div>There is a new reply!</div>}
      {hasReplies && (
        <div>
          <h2>Replies ({post.postsCount})</h2>
          <ul>
            {replies.map(({ id, body, createdByUser }) => (
              <li key={id}>
                {createdByUser && <div>Created by me</div>}
                <div></div>
                <Link href={`/post/${id}`}>
                  <a>
                    {id} / {body}
                  </a>
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

const getServerSidePropsFn = async ({
  AuthUser,
  params,
}: {
  AuthUser: AuthUser
  params: {
    slug: string
  }
}) => {
  const db = getFirebaseAdmin().firestore()
  const uid = AuthUser.id
  const { slug } = params

  const postsRef = await db
    .collectionGroup(POSTS_COLLECTION)
    .where('slug', '==', slug)
    .limit(1)
    .get()

  if (postsRef.empty) return { notFound: true }

  const postDoc = postsRef.docs[0]
  const postRef = postDoc.ref

  const authoredPostsRef = await db
    .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
    .where('originReference', '==', postRef)
    .limit(1)
    .get()

  const postCreatedByUser = !authoredPostsRef.empty
  const post = mapPostDbToClient(postDoc, postCreatedByUser)
  
  const replyDocs = await postRef
    .collection(POSTS_COLLECTION)
    .orderBy('createdAt')
    .get()

  const repliesPromise = replyDocs.docs.map(async replyDoc => {
    const authoredRepliesRef = await db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_REPLIES_COLLECTION}`)
      .where('originReference', '==', replyDoc.ref)
      .limit(1)
      .get()

    const replyCreatedByUser = !authoredRepliesRef.empty
    return mapPostDbToClient(replyDoc, replyCreatedByUser)
  })
  const replies = await Promise.all(repliesPromise)

  return {
    props: {
      key: postDoc.id,
      post: {
        ...post,
        posts: replies,
      },
    },
  }
}

export const getServerSideProps =
  withAuthUserTokenSSR()(getServerSidePropsFn as any)

export default PostPage
