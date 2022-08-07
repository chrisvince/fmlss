import { Box } from '@mui/system'
import { useId } from 'react'

import { Post } from '../../types'
import useLikeState from '../../utils/useLikeState'
import MobileContainer from '../MobileContainer'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import PostCaption from '../PostCaption'

type PropTypes = {
  hideActionBar?: boolean
  onLikePost?: (slug: string) => Promise<void>
  post: Post
}

const PostItem = ({ hideActionBar, onLikePost, post }: PropTypes) => {
  const { toggleLike, likesCount, like } = useLikeState({ post })
  const ariaLabelledById = useId()
  const byUser = !!post.user?.created
  const postCaptionType = byUser ? 'byUser' : null

  const handleLikeButtonClick = () => {
    toggleLike()
    onLikePost?.(post.data.slug)
  }

  return (
    <Box sx={{ pb: 2 }}>
      <MobileContainer>
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
            body={post!.data.body}
            id={ariaLabelledById}
            size="large"
          />
          {!hideActionBar && (
            <PostActionBar
              createdAt={post!.data.createdAt}
              like={like}
              likesCount={likesCount}
              onLike={handleLikeButtonClick}
              postsCount={post!.data.postsCount}
              slug={post!.data.slug}
            />
          )}
        </Box>
      </MobileContainer>
    </Box>
  )
}

export default PostItem
