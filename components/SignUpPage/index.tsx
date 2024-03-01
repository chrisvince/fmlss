import { Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import Page from '../Page'
import SignUpForm from '../SignUpForm'

const SignUpPage = () => {
  return (
    <Page
      description="Join the conversation. Sign up to Fameless."
      pageTitle="Sign up"
      layout="none"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: 2,
        }}
      >
        <Typography variant="body1" component="h1">
          Create account
        </Typography>
        <SignUpForm />
      </Box>
    </Page>
  )
}

export default SignUpPage
