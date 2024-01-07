import { useId } from 'react'

import { Post } from '../../types'
import ListItemFrame from '../ListItemFrame'
import PostItem from '../PostItem'

type PropTypes = {
  onLikePost: (slug: string) => Promise<void>
  onWatchPost: (documentPath: string) => Promise<void>
  post: Post
}

const PostListItem = ({ onLikePost, onWatchPost, post }: PropTypes) => {
  const ariaLabelledById = useId()

  return (
    <ListItemFrame
      aria-labelledby={ariaLabelledById}
      component="article"
      href={`/post/${encodeURIComponent(post.data.slug)}`}
    >
      <PostItem
        bodyElementId={ariaLabelledById}
        noBottomBorder
        onLikePost={onLikePost}
        onWatchPost={onWatchPost}
        post={post}
      />
    </ListItemFrame>
  )
}

export default PostListItem
