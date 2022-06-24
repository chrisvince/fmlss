import { useRouter } from 'next/router'
import { SyntheticEvent } from 'react'

import { Post } from '../../types'
import {
  createPostLike,
  removePostLike,
} from '../../utils/callableFirebaseFunctions'
import LikeButton from '../LikeButton'
import PostBody from '../PostBody'

type PropTypes = {
  post: Post
}

const IGNORE_NAVIGATE_TAG_NAMES = ['A', 'BUTTON']

const PostListItem = ({ post }: PropTypes) => {
  const { push: navigate } = useRouter()

  const handleClick = (event: SyntheticEvent) => {
    const { tagName } = event.target as HTMLAnchorElement
    if (IGNORE_NAVIGATE_TAG_NAMES.includes(tagName)) return
    if (window.getSelection()?.toString().length) return
    navigate(`/post/${post.data.slug}`)
  }

  const handleLike = () => createPostLike({ slug: post.data.slug })
  const handleUnlike = () => removePostLike({ slug: post.data.slug })

  return (
    <article
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        borderTop: '1px solid #eee',
        padding: '15px 0 30px 0',
      }}
    >
      <PostBody body={post.data.body} />
      <div
        style={{
          display: 'flex',
          gap: '20px',
        }}
      >
        {post.user?.created && (
          <div>Created by me</div>
        )}
        {!!post.data.postsCount && (
          <div>{post.data.postsCount} replies</div>
        )}
        <LikeButton
          like={!!post.user?.like}
          likesCount={post.data.likesCount}
          onLike={handleLike}
          onUnlike={handleUnlike}
        />
      </div>
    </article>
  )
}

export default PostListItem
