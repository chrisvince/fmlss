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
      transition: 'background-color ease-in-out 200ms',
      '&:hover': {
        backgroundColor: 'action.hover',
      },
    }}
  >
    {children}
  </Box>
)

export default PostAttachmentBorder
