
import { useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'

import constants from '../../constants'
import CenterSectionContainer from '../CenterSectionContainer'

const { SIDEBAR_GAP_MD, SIDEBAR_GAP_SM, SIDEBAR_WIDTH_LG } = constants

interface PropTypes {
  main: React.ReactNode
  rightPanelChildren?: React.ReactNode
  thinContainer?: boolean
}

const NestedLayout = ({
  main,
  rightPanelChildren,
  thinContainer,
}: PropTypes) => {
  const theme = useTheme()
  const renderRightPanel = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          sm: '1fr',
          md: `1fr ${SIDEBAR_WIDTH_LG}`,
        },
        columnGap: {
          sm: SIDEBAR_GAP_SM,
          md: SIDEBAR_GAP_MD,
        },
      }}
    >
      <Box component="main">
        <CenterSectionContainer thin={thinContainer}>
          {main}
        </CenterSectionContainer>
      </Box>
      {rightPanelChildren && renderRightPanel && (
        <Box component="aside">{rightPanelChildren}</Box>
      )}
    </Box>
  )
}

export default NestedLayout
