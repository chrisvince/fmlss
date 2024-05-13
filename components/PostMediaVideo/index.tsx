import PostAttachmentBorder from '../PostAttachmentBorder'
import MuxPlayer from '@mux/mux-player-react/lazy'
import { Box, useTheme } from '@mui/material'
import { MediaVideo } from '../../types/Media'

interface Props {
  media: MediaVideo
}

const PostMediaVideo = ({ media: { playbackId, aspectRatio } }: Props) => {
  const theme = useTheme()

  return (
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
          playbackId={playbackId}
          accentColor={theme.palette.grey[800]}
          style={{ display: 'block', aspectRatio }}
        />
      </Box>
    </PostAttachmentBorder>
  )
}

export default PostMediaVideo
