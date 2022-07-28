import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'

const ModalSpinner = () => (
  <Box
    sx={{
      height: '40vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
)

export default ModalSpinner
