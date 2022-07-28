import { PersonRounded } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import CaptionLink from '../CaptionLink'

interface PropTypes {
  type: 'byUser' | null
}

const PostCaption = ({ type }: PropTypes) => {
  if (!type) return null

  const Icon = {
    byUser: PersonRounded,
  }[type]

  const text = {
    byUser: 'Posted by you',
  }[type]

  const href = {
    byUser: '/profile/posts',
  }[type]

  if (href) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <CaptionLink href={href}>
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
    <Typography
      variant="caption"
      component="div"
    >
      {text}
    </Typography>
  )
}

export default PostCaption
