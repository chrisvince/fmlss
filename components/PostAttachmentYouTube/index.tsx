import { Box, Link, Typography } from '@mui/material'
import { type PostAttachmentYouTube } from '../../types'

import PostAttachmentLayout, {
  PostAttachmentLayoutLayout,
} from '../PostAttachmentLayout'
import PostAttachmentBorder from '../PostAttachmentBorder'

interface Props {
  attachment: PostAttachmentYouTube
}

const PostAttachmentYouTube = ({ attachment }: Props) => {
  const { href, title, author, image } = attachment

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
          layout={PostAttachmentLayoutLayout.MediaLarge}
          media={
            <picture>
              <img
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.alt}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </picture>
          }
          text={
            <Typography variant="caption">
              <Box sx={{ fontWeight: 600, marginBlockEnd: 1 }}>YouTube</Box>
              <Box sx={{ marginBlockEnd: 1 }}>{author.name}</Box>
              <Box sx={{ marginBlockEnd: 1 }}>{title}</Box>
            </Typography>
          }
        />
      </Link>
    </PostAttachmentBorder>
  )
}

export default PostAttachmentYouTube
