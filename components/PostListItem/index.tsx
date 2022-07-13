import { useRouter } from 'next/router'

import { Post } from '../../types'
import {
  createPostLike,
  removePostLike,
} from '../../utils/callableFirebaseFunctions'
import truncateString from '../../utils/truncateString'
import LikeButton from '../LikeButton'
import ListItemFrame from '../ListItemFrame'
import PostBody from '../PostBody'

type PropTypes = {
  post: Post
}

const PostListItem = ({ post }: PropTypes) => {
  const { push: navigate } = useRouter()

  const handleOpen = () =>
    navigate(`/post/${encodeURIComponent(post.data.slug)}`)

  const handleLike = () => createPostLike({ slug: post.data.slug })
  const handleUnlike = () => removePostLike({ slug: post.data.slug })
  const title = truncateString(post.data.body)

  return (
    <ListItemFrame
      component="article"
      onOpen={handleOpen}
      aria-label={title}
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
    </ListItemFrame>
  )
}

export default PostListItem
