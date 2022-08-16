import MobileContainer from '../MobileContainer'
import Page from '../Page'
import SignUpForm from '../SignUpForm'

const SignUpPage = () => {
  return (
    <Page
      description="Join the conversation. Sign up to Fameless."
      pageTitle="Sign up"
      thinContainer
    >
      <MobileContainer>
        <SignUpForm />
      </MobileContainer>
    </Page>
  )
}

export default SignUpPage
