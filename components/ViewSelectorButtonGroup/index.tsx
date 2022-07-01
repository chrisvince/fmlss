import ButtonGroup from '@mui/material/ButtonGroup'
import { ReactNode } from 'react'

interface PropTypes {
  children: ReactNode,
}

const ViewSelectorButtonGroup = ({ children }: PropTypes) => {
  return (
    <ButtonGroup
      aria-label="Sort Selection"
      fullWidth
      size="small"
    >
      {children}
    </ButtonGroup>
  )
}

export default ViewSelectorButtonGroup
