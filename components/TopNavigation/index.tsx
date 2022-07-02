import { Box } from '@mui/material'
import { Container } from '@mui/system'

import constants from '../../constants'
import CenterSectionContainer from '../CenterSectionContainer'

const {
  SIDEBAR_GAP_LG,
  SIDEBAR_GAP_SM,
  SIDEBAR_WIDTH_LG,
  SIDEBAR_WIDTH_MD,
  SIDEBAR_WIDTH_SM,
  TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_MARGIN_BOTTOM_SM,
  TOP_NAVIGATION_MARGIN_BOTTOM_XS,
} = constants

const TopNavigation = () => {
  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        height: TOP_NAVIGATION_HEIGHT,
        marginBottom: {
          xs: TOP_NAVIGATION_MARGIN_BOTTOM_XS,
          sm: TOP_NAVIGATION_MARGIN_BOTTOM_SM,
        },
        backgroundColor: 'lightgray',
        zIndex: 8500,
      }}
    >
      <Container sx={{ height: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            height: '100%',
            alignItems: 'center',
            gridTemplateColumns: {
              sm: `${SIDEBAR_WIDTH_SM} 1fr`,
              md: `${SIDEBAR_WIDTH_MD} 1fr ${SIDEBAR_WIDTH_MD}`,
              lg: `${SIDEBAR_WIDTH_LG} 1fr ${SIDEBAR_WIDTH_LG}`,
            },
            columnGap: {
              sm: SIDEBAR_GAP_SM,
              md: SIDEBAR_GAP_LG,
            },
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0,
            }}
          >
            <b>FAMELESS</b>
          </Box>
          <Box>
            <CenterSectionContainer>
              middle
            </CenterSectionContainer>
          </Box>
          <Box
            sx={{
              position: 'sticky',
              top: 0,
            }}
          >
            3
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default TopNavigation
