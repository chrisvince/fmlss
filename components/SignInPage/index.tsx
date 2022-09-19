import MobileContainer from '../MobileContainer'
import Page from '../Page'
import SignInForm from '../SignInForm'

const SignInPage = () => {
  return (
    <Page
      description="Join the conversation. Join Fameless."
      pageTitle="Sign up"
      thinContainer
    >
      <MobileContainer>
        <SignInForm />
      </MobileContainer>
    </Page>
  )
}

export default SignInPage
