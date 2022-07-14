import { Typography } from '@mui/material'
import { Box } from '@mui/system'

interface PropTypes {
  children: React.ReactNode
}

const MiniSectionHeading = ({ children }: PropTypes) => {
  return (
    <Box>
      <Typography variant="h6" mb={1}>
        {children}
      </Typography>
    </Box>
  )
}

export default MiniSectionHeading
