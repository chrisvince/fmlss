import { Box } from '@mui/system'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { Typography } from '@mui/material'

interface Props {
  type: 'reply-to' | 'replies'
}

const PostTypeSpacer = ({ type }: Props) => (
  <Box
    sx={{
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      color: 'grey.400',
    }}
  >
    {
      {
        'reply-to': (
          <>
            <KeyboardDoubleArrowUpIcon />
            <Typography>Reply to</Typography>
          </>
        ),
        replies: (
          <>
            <KeyboardDoubleArrowDownIcon />
            <Typography>Replies</Typography>
          </>
        ),
      }[type]
    }
  </Box>
)

export default PostTypeSpacer
