import { AlternateEmailRounded } from '@mui/icons-material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const TopicPathTitleText = ({ children }: Props) => (
  <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: '0.2em' }}>
    <AlternateEmailRounded fontSize="inherit" color="inherit" />
    <Box sx={{ mt: '-0.23em' }}>{children}</Box>
  </Box>
)

export default TopicPathTitleText
