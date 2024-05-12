import PostAttachmentBorder from '../PostAttachmentBorder'
import MuxPlayer from '@mux/mux-player-react'
import { useTheme } from '@mui/material'
import { MediaVideo } from '../../types/Media'

interface Props {
  media: MediaVideo
}

const PostMediaVideo = ({ media: { playbackId, aspectRatio } }: Props) => {
  const theme = useTheme()

  return (
    <PostAttachmentBorder>
      <MuxPlayer
        playbackId={playbackId}
        accentColor={theme.palette.grey[800]}
        style={{ display: 'block', aspectRatio }}
      />
    </PostAttachmentBorder>
  )
}

export default PostMediaVideo
