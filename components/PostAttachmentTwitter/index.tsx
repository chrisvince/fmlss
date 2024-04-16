import { Box, Link, Typography } from '@mui/material'
import { type PostAttachmentTwitter } from '../../types'

import PostAttachmentLayout from '../PostAttachmentLayout'
import PostAttachmentBorder from '../PostAttachmentBorder'
import XLogo from './XLogo'

interface Props {
  attachment: PostAttachmentTwitter
}

const PostAttachmentTwitter = ({ attachment }: Props) => {
  const { href, body } = attachment

  return (
    <PostAttachmentBorder>
      <Link
        href={href}
        target="_blank"
        rel="noopener"
        underline="none"
        sx={{
          position: 'relative',
          display: 'block',
          px: 1.5,
          py: 1.5,
          transition: 'ease-in-out 200ms',
          transitionProperty: 'background-color',
        }}
      >
        <PostAttachmentLayout
          media={
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <XLogo sx={{ maxWidth: '45px' }} />
            </Box>
          }
          text={
            <Typography variant="caption">
              <Box sx={{ fontWeight: 600, marginBlockEnd: 1 }}>
                X&ensp;(x.com)
              </Box>
              <Box
                dangerouslySetInnerHTML={{ __html: body }}
                sx={{
                  '& blockquote': {
                    maxWidth: 'unset !important',
                    minWidth: 'unset !important',
                    marginInlineStart: 'unset',
                    marginInlineEnd: 'unset',
                    marginBlockStart: 'unset',
                    marginBlockEnd: 'unset',
                  },
                  '& a': {
                    color: 'primary.main',
                  },
                  '& p': {
                    marginBlockStart: 1,
                    marginBlockEnd: 1,
                  },
                }}
              />
            </Typography>
          }
        />
      </Link>
    </PostAttachmentBorder>
  )
}

export default PostAttachmentTwitter
