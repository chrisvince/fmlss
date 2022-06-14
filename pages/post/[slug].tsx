import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  AuthUser,
  getFirebaseAdmin,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

import type { Post } from '../../types'
import PostReplyForm from '../../components/PostReplyForm'
import useIsNewPost from '../../utils/useIsNewPost'
import getPost from '../../utils/data/post/getPost'
import getMoreReplies from '../../utils/data/post/getMoreReplies'
import addNewReply from '../../utils/data/post/addNewReply'
import { useRouter } from 'next/router'

interface PropTypes {
  post: Post
}

const PostPage = ({ post: postProp }: PropTypes) => {
  const router = useRouter()
  const { id: uid } = useAuthUser()
  const [post, setPost] = useState<Post>(postProp)
  
  const [repliesCount, setRepliesCount] = useState<number>(
    post.data?.postsCount ?? 0
  )
    
  const { slug } = router.query as { slug: string }
  const hasReplies = !!post.replies?.length

  useEffect(() => {
    const hydratePost = async () => {
      const post = await getPost(slug, { uid })
      setPost(post)
    }
    hydratePost()
  }, [slug, uid])

  const handleLoadMoreClick = async () => {
    const newPost = await getMoreReplies(post, { uid })
    setPost(newPost)
  }

  const handleNewReply = async (docId: string) => {
    const newPost = await addNewReply(post, docId)
    setPost(newPost)
    setRepliesCount(repliesCount + 1)
  }

  const postData = post.data!

  const isNewReply = useIsNewPost(post.replies, `${postData.reference}/posts`, {
    sortDirection: 'asc',
  })

  const createdAt = new Date(postData.createdAt).toLocaleString()

  return (
    <div>
      <h1>Post</h1>
      <div>id: {postData.id}</div>
      <div>body: {postData.body}</div>
      {post.createdByUser && <div>Created by me!</div>}
      <div>reference: {postData.reference}</div>
      <div>createdAt: {createdAt}</div>
      <div>
        <Link href={`/post/${postData.id}`}>Link</Link>
      </div>
      {postData.parentId && (
        <div>
          <Link href={`/post/${postData.parentId}`}>
            <a>Parent</a>
          </Link>
        </div>
      )}
      {!post.createdByUser && isNewReply && <div>There is a new reply!</div>}
      {hasReplies && (
        <div>
          <h2>Replies ({repliesCount})</h2>
          <ul>
            {post.replies!.map(({ data }) => (
              <li key={data.id}>
                {data.createdByUser && <div>Created by me</div>}
                <div></div>
                <Link href={`/post/${data.id}`}>
                  <a>
                    {data.id} / {data.body}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <button onClick={handleLoadMoreClick}>Load more</button>
        </div>
      )}
      <PostReplyForm
        replyingToReference={postData.reference}
        onNewReply={handleNewReply}
      />
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
  const adminDb = getFirebaseAdmin().firestore()
  const uid = AuthUser.id
  const { slug } = params

  const post = await getPost(slug, {
    uid,
    includeFirebaseDocs: false,
    db: adminDb,
  })

  if (!post.data) {
    return { notFound: true }
  }

  return {
    props: {
      key: post.data.id,
      post,
    },
  }
}

export const getServerSideProps =
  withAuthUserTokenSSR()(getServerSidePropsFn as any)

export default withAuthUser()(PostPage as any)
