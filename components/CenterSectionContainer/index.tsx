import { Box } from '@mui/system'
import { ReactNode } from 'react'

import constants from '../../constants'

const {
  CENTER_SECTION_CONTAINER_MAX_WIDTH,
  CENTER_SECTION_CONTAINER_THIN_MAX_WIDTH,
} = constants

interface PropTypes {
  children: ReactNode
  thin?: boolean
}

const CenterSectionContainer = ({ children, thin }: PropTypes) => {
  return (
    <Box
      sx={{
        margin: '0 auto',
        maxWidth: thin
          ? CENTER_SECTION_CONTAINER_THIN_MAX_WIDTH
          : CENTER_SECTION_CONTAINER_MAX_WIDTH,
      }}
    >
      {children}
    </Box>
  )
}

export default CenterSectionContainer
