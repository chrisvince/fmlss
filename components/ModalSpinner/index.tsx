import { CircularProgress } from '@mui/material'
import { Box } from '@mui/system'

const ModalSpinner = () => (
  <Box
    sx={{
      height: {
        xs: '100%',
        sm: '30vh',
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
)

export default ModalSpinner
