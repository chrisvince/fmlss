import { ArrowBack, PersonRounded } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { useId } from 'react'

import usePost from '../../utils/data/post/usePost'
import useLikeState from '../../utils/useLikeState'
import ActionButton from '../ActionButton'
import MobileContainer from '../MobileContainer'
import PostActionBar from '../PostActionBar'
import PostBody from '../PostBody'
import PostCaption from '../PostCaption'

type PropTypes = {
  slug: string
}

const PostItem = ({ slug }: PropTypes) => {
  const { post } = usePost(slug)
  const router = useRouter()
  const { toggleLike, likesCount, like } = useLikeState({ post })

  const handleLikeButtonClick = () => {
    toggleLike()
    // update like with usePost
  }

  const byUser = !!post.user?.created
  const showPostCatption = !!byUser
  const postCaptionText = byUser ? 'Posted by me' : undefined
  const postCaptionHref = byUser ? '/profile/posts' : undefined
  const postCaptionIcon = byUser ? PersonRounded : undefined
  const ariaLabelledById = useId()

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
          <Box sx={{ ml: '-10px' }}>
            <ActionButton
              icon={ArrowBack}
              text="Back"
              onClick={() => router.back()}
            />
          </Box>
          {showPostCatption && (
            <PostCaption href={postCaptionHref} icon={postCaptionIcon}>
              {postCaptionText}
            </PostCaption>
          )}
          <PostBody body={post.data.body} id={ariaLabelledById} />
          <PostActionBar
            createdAt={post.data.createdAt}
            like={like}
            likesCount={likesCount}
            onLike={handleLikeButtonClick}
            postsCount={post.data.postsCount}
            slug={post.data.slug}
          />
        </Box>
      </MobileContainer>
    </Box>
  )
}

export default PostItem
