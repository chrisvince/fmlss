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
          sx={{
            fontWeight: 'bold',
            lineHeight: [undefined, '0.8em'],
            mb: [
              2,
              4.25, // matches the position of the feed to the feed page
            ],
          }}
        >
          {children}
        </Typography>
      </MobileContainer>
    </Box>
  )
}

export default SectionHeading
