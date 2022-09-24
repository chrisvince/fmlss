import Page from '../Page'
import ForgotPasswordForm from '../ForgotPasswordForm'
import { Box, Container } from '@mui/system'
import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@mui/material'

const ForgotPasswordPage = () => (
  <Page
    layout="none"
    noPageTitle
    pageTitle="Forgot Password"
    thinContainer
  >
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: 2,
        }}
      >
        <Link href="/" passHref>
          <Box component="a">
            <Image
              alt="FAMELESS"
              src="/fameless.svg"
              height={26}
              width={160}
            />
          </Box>
        </Link>
        <Typography variant="body1" component="h1">
          Forgot password
        </Typography>
        <ForgotPasswordForm />
      </Box>
    </Container>
  </Page>
)

export default ForgotPasswordPage
