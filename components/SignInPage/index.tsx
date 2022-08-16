import MobileContainer from '../MobileContainer'
import Page from '../Page'
import SignInForm from '../SignInForm'

const SignInPage = () => {
  return (
    <Page
      description="Join the conversation. Sign in to Fameless."
      pageTitle="Sign in"
      thinContainer
    >
      <MobileContainer>
        <SignInForm />
      </MobileContainer>
    </Page>
  )
}

export default SignInPage
