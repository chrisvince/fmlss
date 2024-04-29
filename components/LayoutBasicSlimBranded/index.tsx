import { Box, Container } from '@mui/system'

import FooterBasic from '../FooterBasic'
import constants from '../../constants'
import Brand from '../Brand'

const { FOOTER_BASIC_HEIGHT } = constants

interface PropTypes {
  children: React.ReactNode
}

const LayoutBasicSlimBranded = ({ children }: PropTypes) => (
  <>
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: `calc(100vh - ${FOOTER_BASIC_HEIGHT})`,
          display: 'flex',
          flexDirection: 'column',
          pt: {
            xs: 5,
            sm: '15vh',
          },
          pb: 5,
          gap: 5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Brand height={26} width={165} />
        </Box>
        <Box sx={{ pt: 4 }}>{children}</Box>
      </Box>
    </Container>
    <FooterBasic />
  </>
)

export default LayoutBasicSlimBranded
