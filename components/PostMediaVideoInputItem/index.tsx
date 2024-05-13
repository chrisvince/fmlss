import CloseButtonWrapper from '../CloseButtonWrapper'
import PostAttachmentBorder from '../PostAttachmentBorder'
import {
  MediaInputItemVideo,
  MediaInputItemVideoStatus,
} from '../../types/MediaInputItem'
import MuxPlayer from '@mux/mux-player-react'
import { Box, useTheme } from '@mui/material'
import PostAttachmentSkeletonLoader from '../PostAttachmentSkeletonLoader'

interface Props {
  media: MediaInputItemVideo
  onClose: () => void
}

const PostMediaVideoInputItem = ({
  media: { id, playbackId, status },
  onClose,
}: Props) => {
  const theme = useTheme()

  if (status !== MediaInputItemVideoStatus.Ready) {
    return <PostAttachmentSkeletonLoader />
  }

  return (
    <CloseButtonWrapper key={id} onClose={onClose}>
      <PostAttachmentBorder>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <MuxPlayer
            accentColor={theme.palette.grey[800]}
            playbackId={playbackId}
            style={{ display: 'block' }}
          />
        </Box>
      </PostAttachmentBorder>
    </CloseButtonWrapper>
  )
}

export default PostMediaVideoInputItem
