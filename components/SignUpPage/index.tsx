import { Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import Image from 'next/image'
import Link from 'next/link'
import Page from '../Page'
import SignUpForm from '../SignUpForm'

const SignUpPage = () => {
  return (
    <Page
      description="Join the conversation. Sign up to Fameless."
      pageTitle="Sign up"
      thinContainer
      layout="none"
      noPageTitle
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
            Create account
          </Typography>
          <SignUpForm />
        </Box>
      </Container>
    </Page>
  )
}

export default SignUpPage
