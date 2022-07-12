import { Container, Box } from '@mui/system'

import TopNavigation from '../TopNavigation'
import LeftNavigationDesktop from '../LeftNavigationDesktop'
import constants from '../../constants'
import RightSideBar from '../RightSideBar'
import CenterSectionContainer from '../CenterSectionContainer'

const {
  SIDEBAR_GAP_LG,
  SIDEBAR_GAP_SM,
  SIDEBAR_WIDTH_LG,
  SIDEBAR_WIDTH_MD,
  SIDEBAR_WIDTH_SM,
} = constants

interface PropTypes {
  children: React.ReactNode
}

const Layout = ({ children }: PropTypes) => {
  return (
    <>
      <TopNavigation />
      <Container>
        <Box
          sx={{
            display: 'grid',
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
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            <LeftNavigationDesktop />
          </Box>
          <Box>
            <CenterSectionContainer>
              {children}
            </CenterSectionContainer>
          </Box>
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          >
            <RightSideBar />
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Layout
