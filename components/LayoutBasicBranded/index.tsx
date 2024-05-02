import { Box, Container, ContainerProps } from '@mui/system'

import FooterBasic from '../FooterBasic'
import constants from '../../constants'
import Brand from '../Brand'

const { FOOTER_BASIC_HEIGHT } = constants

interface PropTypes {
  children: React.ReactNode
  containerProps?: ContainerProps
}

const LayoutBasicBranded = ({ children, containerProps }: PropTypes) => (
  <>
    <Container maxWidth="xs" {...containerProps}>
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

export default LayoutBasicBranded
