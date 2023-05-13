import { LockRounded } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import CaptionLink from '../CaptionLink'

interface PropTypes {
  type: 'byUser' | null
}

const PostCaption = ({ type }: PropTypes) => {
  if (!type) return null

  const Icon = {
    byUser: LockRounded,
  }[type]

  const text = {
    byUser: 'Posted by you',
  }[type]

  const href = {
    byUser: '/profile/posts',
  }[type]

  const tooltip = {
    byUser: "Only you can see that you're the author of this post",
  }[type]

  if (href) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <CaptionLink href={href} tooltip={tooltip} tooltipPlacement="right">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {Icon && (
              <Icon
                sx={{
                  fontSize: '1em',
                  marginRight: 0.8,
                }}
              />
            )}
            {text}
          </Box>
        </CaptionLink>
      </Box>
    )
  }

  return (
    <Typography variant="caption" component="div">
      {text}
    </Typography>
  )
}

export default PostCaption
