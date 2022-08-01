import MobileContainer from '../MobileContainer'
import Page from '../Page'
import SignInForm from '../SignInForm'

const SignInPage = () => {
  return (
    <Page pageTitle="Sign in" thinContainer>
      <MobileContainer>
        <SignInForm />
      </MobileContainer>
    </Page>
  )
}

export default SignInPage
