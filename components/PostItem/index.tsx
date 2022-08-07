import { Box } from '@mui/system'

import { Post } from '../../types'
import useLikeState from '../../utils/useLikeState'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import PostCaption from '../PostCaption'

type PropTypes = {
  bodyElementId?: string
  bodySize?: 'small' | 'large'
  hideActionBar?: boolean
  onLikePost?: (slug: string) => Promise<void> | void
  post: Post
}

const PostItem = ({
  bodyElementId,
  bodySize = 'small',
  hideActionBar,
  onLikePost,
  post,
}: PropTypes) => {
  const { toggleLike, likesCount, like } = useLikeState({ post })
  const byUser = !!post.user?.created
  const postCaptionType = byUser ? 'byUser' : null

  const handleLikeButtonClick = () => {
    toggleLike()
    onLikePost?.(post.data.slug)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        gap: 2,
      }}
    >
      <PostCaption type={postCaptionType} />
      <PostBody
        body={post.data.body}
        id={bodyElementId}
        size={bodySize}
      />
      {!hideActionBar && (
        <PostActionBar
          createdAt={post.data.createdAt}
          like={like}
          likesCount={likesCount}
          onLike={handleLikeButtonClick}
          postsCount={post.data.postsCount}
          slug={post.data.slug}
        />
      )}
    </Box>
  )
}

export default PostItem
