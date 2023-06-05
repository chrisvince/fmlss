import { useId } from 'react'

import { Post } from '../../types'
import ListItemFrame from '../ListItemFrame'
import PostItem from '../PostItem'

type PropTypes = {
  measure?: () => void
  onLikePost: (slug: string) => Promise<void>
  onPostPreviewsLoaded?: () => void
  onWatchPost: (documentPath: string) => Promise<void>
  post: Post
}

const PostListItem = ({
  measure,
  onLikePost,
  onPostPreviewsLoaded,
  onWatchPost,
  post,
}: PropTypes) => {
  const ariaLabelledById = useId()

  return (
    <ListItemFrame
      aria-labelledby={ariaLabelledById}
      component="article"
      href={`/post/${encodeURIComponent(post.data.slug)}`}
    >
      <PostItem
        bodyElementId={ariaLabelledById}
        measure={measure}
        noBottomBorder
        onLikePost={onLikePost}
        onPostPreviewsLoaded={onPostPreviewsLoaded}
        onWatchPost={onWatchPost}
        post={post}
      />
    </ListItemFrame>
  )
}

export default PostListItem
