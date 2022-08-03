import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'

const ContentSpinner = () => (
  <Box
    sx={{
      height: {
        xs: '100%',
        sm: '300px',
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
)

export default ContentSpinner
