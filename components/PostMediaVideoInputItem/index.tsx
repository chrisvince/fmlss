import CloseButtonWrapper from '../CloseButtonWrapper'
import PostAttachmentBorder from '../PostAttachmentBorder'
import {
  MediaInputItemVideo,
  MediaInputItemVideoStatus,
} from '../../types/MediaInputItem'
import MuxPlayer from '@mux/mux-player-react'
import { useTheme } from '@mui/material'
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
        <MuxPlayer
          playbackId={playbackId}
          accentColor={theme.palette.grey[800]}
          style={{ display: 'block' }}
        />
      </PostAttachmentBorder>
    </CloseButtonWrapper>
  )
}

export default PostMediaVideoInputItem
