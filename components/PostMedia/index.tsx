import { Box } from '@mui/material'
import CloseButtonWrapper from '../CloseButtonWrapper'
import PostAttachmentBorder from '../PostAttachmentBorder'
import Image from 'next/image'
import { MediaItem } from '../../types/MediaItem'

interface Props {
  media: MediaItem[]
  onClose: (id: string) => void
}

const PostMedia = ({ media, onClose }: Props) => {
  const closeHandler = (id: string) => () => onClose(id)
  const gridLayout = media.length >= 2

  return (
    <Box
      sx={
        gridLayout
          ? {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
            }
          : undefined
      }
    >
      {media.map(({ id, url, height, width }) => (
        <CloseButtonWrapper key={id} onClose={closeHandler(id)}>
          <PostAttachmentBorder>
            <Image
              alt=""
              height={height}
              src={url}
              style={{
                maxWidth: '100%',
                height: '100%',
                display: 'block',
                ...(gridLayout
                  ? {
                      objectFit: 'contain',
                    }
                  : {}),
              }}
              width={width}
            />
          </PostAttachmentBorder>
        </CloseButtonWrapper>
      ))}
    </Box>
  )
}

export default PostMedia
