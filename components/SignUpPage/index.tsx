import MobileContainer from '../MobileContainer'
import Page from '../Page'
import SignUpForm from '../SignUpForm'

const SignUpPage = () => {
  return (
    <Page pageTitle="Sign up" thinContainer>
      <MobileContainer>
        <SignUpForm />
      </MobileContainer>
    </Page>
  )
}

export default SignUpPage
