import { Box } from '@mui/system'
import { useId } from 'react'

import usePost from '../../utils/data/post/usePost'
import useLikeState from '../../utils/useLikeState'
import MobileContainer from '../MobileContainer'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import PostCaption from '../PostCaption'

type PropTypes = {
  hideActionBar?: boolean
  slug: string
}

const PostItem = ({ hideActionBar, slug }: PropTypes) => {
  const { post, isLoading } = usePost(slug)
  const { toggleLike, likesCount, like } = useLikeState({ post })

  const handleLikeButtonClick = () => {
    toggleLike()
    // update like with usePost
  }

  const byUser = !!post?.user?.created
  const postCaptionType = byUser ? 'byUser' : null
  const ariaLabelledById = useId()

  if (isLoading) {
    return null
  }

  return (
    <Box
      sx={{
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
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
