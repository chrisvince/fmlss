import { AlternateEmailRounded } from '@mui/icons-material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const TopicPathTitleText = ({ children }: Props) => (
  <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: '0.1em' }}>
    <AlternateEmailRounded fontSize="inherit" color="inherit" />
    <Box
      sx={{
        fontSize: 'inherit',
        mt: '-0.15lh',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
        maxWidth: '100%',
      }}
    >
      {children}
    </Box>
  </Box>
)

export default TopicPathTitleText
