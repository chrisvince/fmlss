import { Box } from '@mui/system'
import FooterBasic from '../FooterBasic'

import constants from '../../constants'

const { FOOTER_BASIC_HEIGHT } = constants

interface PropTypes {
  children: React.ReactNode
}

const LayoutUnauthed = ({ children }: PropTypes) => (
  <>
    <Box
      sx={{
        minHeight: `calc(100vh - ${FOOTER_BASIC_HEIGHT})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pt: 3,
        pb: 5,
      }}
    >
      {children}
    </Box>
    <FooterBasic />
  </>
)

export default LayoutUnauthed
