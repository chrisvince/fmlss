import { Typography } from '@mui/material'
import { Box } from '@mui/system'

interface Props {
  children: string
}

const BlockMessage = ({ children }: Props) => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      py: 6,
    }}
  >
    <Typography variant="body2">{children}</Typography>
  </Box>
)

export default BlockMessage
