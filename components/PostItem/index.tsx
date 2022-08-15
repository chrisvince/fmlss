import { Box } from '@mui/system'

import { Post } from '../../types'
import useLikeState from '../../utils/useLikeState'
import CategoryChip from '../CategoryChip'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import PostCaption from '../PostCaption'
import constants from '../../constants'

const { POST_MAX_DEPTH } = constants

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
  const allowReplying = post.data.documentDepth < POST_MAX_DEPTH

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
      {(postCaptionType || post.data.category) && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 2,
            gridTemplateAreas: `"caption category"`,
          }}
        >
          <Box sx={{ gridArea: 'caption' }}>
            <PostCaption type={postCaptionType} />
          </Box>
          {post.data.category && (
            <Box
              sx={{
                gridArea: 'category',
                justifySelf: 'end',
              }}
            >
              <CategoryChip
                name={post.data.category.name}
                slug={post.data.category.slug}
              />
            </Box>
          )}
        </Box>
      )}
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
          showReplyButton={allowReplying}
          slug={post.data.slug}
        />
      )}
    </Box>
  )
}

export default PostItem
