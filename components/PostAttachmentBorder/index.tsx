import { Box } from '@mui/system'

interface Props {
  children: React.ReactNode
}

const PostAttachmentBorder = ({ children }: Props) => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      overflow: 'hidden',
    }}
  >
    {children}
  </Box>
)

export default PostAttachmentBorder
