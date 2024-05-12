import { Box, CircularProgress } from '@mui/material'
import PostAttachmentBorder from '../PostAttachmentBorder'

const PostAttachmentSkeletonLoader = () => (
  <PostAttachmentBorder>
    <Box
      sx={{
        alignItems: 'center',
        aspectRatio: '16/9',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  </PostAttachmentBorder>
)

export default PostAttachmentSkeletonLoader
