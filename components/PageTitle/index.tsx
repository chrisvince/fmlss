import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

const PageHeading = ({ children }: { children: string }) => {
  if (!children) return null
  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography component="h1" variant="h6">
        {children}
      </Typography>
    </Box>
  )
}

export default PageHeading
