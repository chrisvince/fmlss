import { Box } from '@mui/system'
import { ReactNode } from 'react'

import constants from '../../constants'

const { CENTER_SECTION_CONTAINER_MAX_WIDTH } = constants

interface PropTypes {
  children: ReactNode
}

const CenterSectionContainer = ({ children }: PropTypes) => {
  return (
    <Box
      sx={{
        margin: '0 auto',
        maxWidth: CENTER_SECTION_CONTAINER_MAX_WIDTH,
      }}
    >
      {children}
    </Box>
  )
}

export default CenterSectionContainer
