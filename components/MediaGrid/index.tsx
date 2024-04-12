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
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
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
