import { Box } from '@mui/system'
import { ReactNode } from 'react'

const MEDIA_SMALL_SIZE = 80
const MEDIA_MEDIUM_SIZE = 120

export enum PostAttachmentLayoutLayout {
  MediaSmall = 'mediaSmall',
  MediaLarge = 'mediaLarge',
  MediaMedium = 'mediaMedium',
  Text = 'text',
}

interface Props {
  media?: ReactNode
  layout?: PostAttachmentLayoutLayout
  text: ReactNode
}

const PostAttachmentLayout = ({
  media,
  layout = media
    ? PostAttachmentLayoutLayout.MediaSmall
    : PostAttachmentLayoutLayout.Text,
  text,
}: Props) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateAreas: {
        [PostAttachmentLayoutLayout.Text]: '"text"',
        [PostAttachmentLayoutLayout.MediaSmall]: '"image text"',
        [PostAttachmentLayoutLayout.MediaMedium]: '"image text"',
        [PostAttachmentLayoutLayout.MediaLarge]: '"image" "text"',
      }[layout],
      gridTemplateColumns: {
        [PostAttachmentLayoutLayout.Text]: '1fr',
        [PostAttachmentLayoutLayout.MediaSmall]: `${MEDIA_SMALL_SIZE}px 1fr`,
        [PostAttachmentLayoutLayout.MediaMedium]: `${MEDIA_MEDIUM_SIZE}px 1fr`,
        [PostAttachmentLayoutLayout.MediaLarge]: '100%',
      }[layout],
      gridTemplateRows: {
        [PostAttachmentLayoutLayout.Text]: '1fr',
        [PostAttachmentLayoutLayout.MediaSmall]: `minmax(${MEDIA_SMALL_SIZE}px, 1fr)`,
        [PostAttachmentLayoutLayout.MediaMedium]: `minmax(${MEDIA_MEDIUM_SIZE}px, 1fr)`,
        [PostAttachmentLayoutLayout.MediaLarge]: 'auto 1fr',
      }[layout],
      gap: 2,
    }}
  >
    {media && <Box sx={{ gridArea: 'image' }}>{media}</Box>}
    <Box
      sx={{
        gridArea: 'text',
        alignSelf: 'center',
      }}
    >
      {text}
    </Box>
  </Box>
)

export default PostAttachmentLayout
