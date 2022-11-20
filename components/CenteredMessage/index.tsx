import { Typography } from '@mui/material'
import { Box } from '@mui/system'

interface Props {
  children: string
}

const CenteredMessage = ({ children }: Props) => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100vw',
    }}
  >
    <Typography variant="body2">
      {children}
    </Typography>
  </Box>
)

export default CenteredMessage
