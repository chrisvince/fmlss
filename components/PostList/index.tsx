import { Box } from '@mui/system'

interface PropTypes {
  children: React.ReactNode
}

const PostList = ({ children }: PropTypes) => {
  return (
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {children}
    </Box>
  )
}

export default PostList
