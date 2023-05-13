import { Typography } from '@mui/material'
import { Box, Container } from '@mui/system'

import constants from '../../constants'

const { FOOTER_BASIC_HEIGHT } = constants

const year = new Date().getFullYear()

const FooterBasic = () => (
  <footer>
    <Container>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 10,
          height: FOOTER_BASIC_HEIGHT,
          justifyContent: 'flex-start',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Copyright © {year} Fameless. All rights reserved.
        </Typography>
      </Box>
    </Container>
  </footer>
)

export default FooterBasic
