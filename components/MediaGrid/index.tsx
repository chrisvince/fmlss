import { Box } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  gridLayout?: boolean
}

const MediaGrid = ({ children, gridLayout = false }: Props) => (
  <Box
    sx={
      gridLayout
        ? {
            display: 'grid',
            gap: 2,
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'minmax(100%, 1fr)',
            '& img': {
              aspectRatio: '1 / 1',
              objectFit: 'cover',
            },
          }
        : undefined
    }
  >
    {children}
  </Box>
)

export default MediaGrid
