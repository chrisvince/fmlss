import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import formatDate from '../../utils/formatting/formatDate'
import formatLikesCount from '../../utils/formatting/formatLikesCount'
import formatReplyCount from '../../utils/formatting/formatReplyCount'
import CaptionLink from '../CaptionLink'
import HighlightButton from '../HighlightButton'
import LikeButton from '../LikeButton'
import ReplyButton from '../ReplyButton'
import ShareButton from '../ShareButton'

interface PropTypes {
  createdAt: string
  like: boolean
  likesCount: number
  onLike: () => any
  postsCount: number
  slug: string
}

const PostActionBar = ({
  createdAt,
  like,
  likesCount,
  onLike,
  postsCount,
  slug,
}: PropTypes) => {
  const formattedCreatedAt = formatDate(createdAt)
  const isoCreatedAt = new Date(createdAt).toISOString()

  return (
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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Typography variant="caption">
            <time dateTime={isoCreatedAt}>
              {formattedCreatedAt}
            </time>
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <CaptionLink href={`/post/${encodeURIComponent(slug)}`}>
            {formatLikesCount(likesCount)}
          </CaptionLink>
          <CaptionLink href={`/post/${encodeURIComponent(slug)}#replies`}>
            {formatReplyCount(postsCount)}
          </CaptionLink>
        </Box>
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
        <LikeButton like={like} onClick={onLike} />
        <ReplyButton slug={slug} />
        <HighlightButton />
        <ShareButton slug={slug} />
      </Box>
    </Box>
  )
}

export default PostActionBar
