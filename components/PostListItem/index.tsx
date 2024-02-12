import { useId } from 'react'

import { Post } from '../../types'
import ListItemFrame from '../ListItemFrame'
import PostItem from '../PostItem'
import { ReactionId } from '../../types/Reaction'

type PropTypes = {
  onLikePost: (slug: string) => Promise<void>
  onPostReaction?: (
    reaction: ReactionId | undefined,
    slug: string
  ) => Promise<void>
  onWatchPost: (documentPath: string) => Promise<void>
  post: Post
}

const PostListItem = ({
  onLikePost,
  onPostReaction,
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
        noBottomBorder
        onLikePost={onLikePost}
        onPostReaction={onPostReaction}
        onWatchPost={onWatchPost}
        post={post}
      />
    </ListItemFrame>
  )
}

export default PostListItem
