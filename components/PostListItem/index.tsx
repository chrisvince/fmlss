import { useRouter } from 'next/router'
import { useId } from 'react'

import { Post } from '../../types'
import ListItemFrame from '../ListItemFrame'
import PostItem from '../PostItem'

type PropTypes = {
  post: Post
  onLikePost: (slug: string) => Promise<void>
}

const PostListItem = ({ onLikePost, post }: PropTypes) => {
  const { push: navigate } = useRouter()
  const ariaLabelledById = useId()

  const handleOpen = () =>
    navigate(`/post/${encodeURIComponent(post.data.slug)}`)

  return (
    <ListItemFrame
      component="article"
      onOpen={handleOpen}
      aria-labelledby={ariaLabelledById}
    >
      <PostItem
        bodyElementId={ariaLabelledById}
        onLikePost={onLikePost}
        post={post}
      />
    </ListItemFrame>
  )
}

export default PostListItem
