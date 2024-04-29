import { Box } from '@mui/system'
import Page from '../Page'
import SignInForm from '../SignInForm'

const SignInPage = () => {
  return (
    <Page
      description="Join the conversation. Sign in to Fameless."
      pageTitle="Sign in"
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
        <SignInForm />
      </Box>
    </Page>
  )
}

export default SignInPage
