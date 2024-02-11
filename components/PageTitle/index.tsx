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
          variant="h1"
          sx={{
            mb: [
              2,
              4.2, // matches the position of the feed to the feed page
            ],
            mt: [0, -1.2], // matches the position of the feed to the feed page
          }}
        >
          {children}
        </Typography>
      </MobileContainer>
    </Box>
  )
}

export default SectionHeading
