import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'

const PageSpinner = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
)

export default PageSpinner
