import { Container, Box } from '@mui/system'

import LeftNavigationDesktop from '../LeftNavigationDesktop'

interface PropTypes {
  children: React.ReactNode
}

const Layout = ({ children }: PropTypes) => {
  return (
    <Container>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            sm: '160px 1fr',
            md: '280px 1fr',
          },
          columnGap: {
            sm: 3,
            md: 4,
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
        <Box>{children}</Box>
      </Box>
    </Container>
  )
}

export default Layout
