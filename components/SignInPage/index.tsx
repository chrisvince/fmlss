import { Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import Image from 'next/image'
import Page from '../Page'
import SignInForm from '../SignInForm'

const SignInPage = () => (
  <Page
    description="Join the conversation. Join Fameless."
    layout="none"
    noPageTitle
    pageTitle="Sign in or create an account"
    thinContainer
  >
    <Container maxWidth="lg">
      <Box
        sx={{
          alignItems: {
            sm: 'center',
          },
          columnGap: {
            sm: 30,
          },
          display: {
            sm: 'grid',
          },
          gridTemplateColumns: {
            sm: '1fr 400px',
          },
        }}
      >
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            justifyContent: 'flex-start',
          }}
        >
          <Image alt="FAMELESS" src="/fameless.svg" height={34} width={210} />
          <Typography
            component="h2"
            sx={{ lineHeight: 1 }}
            variant="h4"
          >
            The network where nobody knows your name.
          </Typography>
        </Box>
        <SignInForm />
      </Box>
    </Container>
  </Page>
)

export default SignInPage
