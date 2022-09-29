import { Box, Container } from '@mui/system'
import Link from 'next/link'
import Image from 'next/image'

import FooterBasic from '../FooterBasic'
import constants from '../../constants'

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
            sm: '22vh',
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
          <Link href="/" passHref>
            <Box component="a">
              <Image
                alt="FAMELESS"
                src="/fameless.svg"
                height={21}
                width={130}
              />
            </Box>
          </Link>
        </Box>
        <Box>{children}</Box>
      </Box>
    </Container>
    <FooterBasic />
  </>
)

export default LayoutBasicSlimBranded
