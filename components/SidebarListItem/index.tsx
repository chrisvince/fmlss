import { Typography } from '@mui/material'
import { Box } from '@mui/system'

interface PropTypes {
  leftText: string
  rightText: string
}

const SidebarListItem = ({ leftText, rightText }: PropTypes) => {
  return (
    <Box
      sx={{
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: 2,
      }}
    >
      <Typography
        variant="body2"
        component="div"
        sx={{
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          hyphens: 'auto',
        }}
      >
        {leftText}
      </Typography>
      <Typography variant="caption">{rightText}</Typography>
    </Box>
  )
}

export default SidebarListItem
