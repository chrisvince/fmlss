import { Typography } from '@mui/material'
import { Box } from '@mui/system'

interface PropTypes {
  leftText: string
  rightText: string
}

const MiniListItem = ({ leftText, rightText }: PropTypes) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" component="div">
        {leftText}
      </Typography>
      <Typography variant="caption">{rightText}</Typography>
    </Box>
  )
}

export default MiniListItem
