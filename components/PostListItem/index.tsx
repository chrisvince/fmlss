import { PersonRounded } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { useId } from 'react'

import { Post } from '../../types'
import formatLikesCount from '../../utils/formatting/formatLikesCount'
import formatReplyCount from '../../utils/formatting/formatReplyCount'
import useLikeState from '../../utils/useLikeState'
import CaptionLink from '../CaptionLink'
import HighlightButton from '../HighlightButton'
import LikeButton from '../LikeButton'
import ListItemFrame from '../ListItemFrame'
import PostBody from '../PostBody'
import PostCaption from '../PostCaption'
import ReplyButton from '../ReplyButton'
import ShareButton from '../ShareButton'

type PropTypes = {
  post: Post
  onLikePost: (slug: string) => Promise<void>
}

const PostListItem = ({ post, onLikePost }: PropTypes) => {
  const { push: navigate } = useRouter()

  const handleOpen = () =>
    navigate(`/post/${encodeURIComponent(post.data.slug)}`)

  const { toggleLike, likesCount, like } = useLikeState({ post })

  const handleLikeButtonClick = () => {
    toggleLike()
    onLikePost(post.data.slug)
  }

  const byUser = !!post.user?.created
  const showPostCatption = !!byUser
  const postCaptionText = byUser ? 'Posted by me' : undefined
  const postCaptionHref = byUser ? '/profile/posts' : undefined
  const postCaptionIcon = byUser ? PersonRounded : undefined
  const ariaLabelledById = useId()

  return (
    <ListItemFrame
      component="article"
      onOpen={handleOpen}
      aria-labelledby={ariaLabelledById}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          gap: 2,
        }}
      >
        {showPostCatption && (
          <PostCaption href={postCaptionHref} icon={postCaptionIcon}>
            {postCaptionText}
          </PostCaption>
        )}
        <PostBody body={post.data.body} id={ariaLabelledById} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <CaptionLink href={`/post/${encodeURIComponent(post.data.slug)}`}>
              {formatLikesCount(likesCount)}
            </CaptionLink>
            <CaptionLink
              href={`/post/${encodeURIComponent(post.data.slug)}#replies`}
            >
              {formatReplyCount(post.data.postsCount)}
            </CaptionLink>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mx: -1,
              mb: -1,
            }}
          >
            <LikeButton
              like={like}
              onClick={handleLikeButtonClick}
            />
            <ReplyButton slug={post.data.slug} />
            <HighlightButton />
            <ShareButton />
          </Box>
        </Box>
      </Box>
    </ListItemFrame>
  )
}

export default PostListItem
