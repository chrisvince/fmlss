import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

import MobileContainer from '../MobileContainer'

interface PropTypes {
  children: string | React.ReactNode
  sticky?: boolean
}

const SectionHeading = ({ children }: PropTypes) => {
  if (!children) return null

  return (
    <Box
      sx={{
        backgroundColor: {
          sm: 'background.paper',
        },
        marginBottom: {
          xs: 1,
          sm: 2,
        },
        borderBottom: {
          sm: '1px solid',
        },
        borderColor: {
          sm: 'divider',
        },
        paddingBottom: 0.5,
        paddingTop: {
          xs: 1,
          sm: 0,
        },
      }}
    >
      <MobileContainer>
        <Typography
          component="h1"
          variant="h6"
        >
          {children}
        </Typography>
      </MobileContainer>
    </Box>
  )
}

export default SectionHeading
