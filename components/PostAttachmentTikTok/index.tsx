import { PostAttachmentTikTok } from '../../types'
import NextImage from 'next/image'
import { Box } from '@mui/system'
import { Typography, Link } from '@mui/material'
import PostAttachmentLayout, {
  PostAttachmentLayoutLayout,
} from '../PostAttachmentLayout'
import PostAttachmentBorder from '../PostAttachmentBorder'

interface Props {
  attachment: PostAttachmentTikTok
}

const PostAttachmentTikTok = ({ attachment: postAttachment }: Props) => (
  <PostAttachmentBorder>
    <Link
      href={postAttachment.href}
      target="_blank"
      rel="noopener"
      underline="none"
      sx={{ color: 'inherit' }}
    >
      <PostAttachmentLayout
        layout={PostAttachmentLayoutLayout.MediaMedium}
        media={
          <NextImage
            src={postAttachment.image.src}
            width={postAttachment.image.width}
            height={postAttachment.image.height}
            alt={postAttachment.image.alt}
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        }
        text={
          <Typography variant="caption">
            <Box sx={{ fontWeight: 600, marginBlockEnd: 1 }}>Tiktok</Box>
            <Box
              dangerouslySetInnerHTML={{ __html: postAttachment.textHtml }}
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

export default PostAttachmentTikTok
