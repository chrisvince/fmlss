import { Typography } from '@mui/material'
import { Box } from '@mui/system'

interface PropTypes {
  children: React.ReactNode
}

const SidebarSectionHeading = ({ children }: PropTypes) => {
  return (
    <Box
      sx={{
        paddingBottom: 1,
      }}
    >
      <Typography variant="h6">{children}</Typography>
    </Box>
  )
}

export default SidebarSectionHeading
