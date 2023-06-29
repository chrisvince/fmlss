import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

import MobileContainer from '../MobileContainer'

interface PropTypes {
  children: string | React.ReactNode
}

const SectionHeading = ({ children }: PropTypes) => {
  if (!children) return null

  return (
    <Box sx={{}}>
      <MobileContainer>
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {children}
        </Typography>
      </MobileContainer>
    </Box>
  )
}

export default SectionHeading
