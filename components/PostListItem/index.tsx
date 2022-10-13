import { useId } from 'react'

import { Post } from '../../types'
import ListItemFrame from '../ListItemFrame'
import PostItem from '../PostItem'

type PropTypes = {
  post: Post
  onLikePost: (slug: string) => Promise<void>
}

const PostListItem = ({ onLikePost, post }: PropTypes) => {
  const ariaLabelledById = useId()

  return (
    <ListItemFrame
      aria-labelledby={ariaLabelledById}
      component="article"
      href={`/post/${encodeURIComponent(post.data.slug)}`}
    >
      <PostItem
        bodyElementId={ariaLabelledById}
        onLikePost={onLikePost}
        post={post}
        noBottomBorder
      />
    </ListItemFrame>
  )
}

export default PostListItem
