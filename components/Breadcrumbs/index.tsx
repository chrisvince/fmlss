import { NavigateNextRounded } from '@mui/icons-material'
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Breadcrumbs = ({ children }: Props) => (
  <MuiBreadcrumbs
    aria-label="breadcrumbs"
    maxItems={2}
    separator={<NavigateNextRounded sx={{ fontSize: 'caption.fontSize' }} />}
    sx={{ mb: 3, fontSize: 'caption.fontSize' }}
  >
    {children}
  </MuiBreadcrumbs>
)

export default Breadcrumbs
