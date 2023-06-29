import ChangeEmailForm from '../ChangeEmailForm'
import MobileContainer from '../MobileContainer'
import Page from '../Page'

const EmailPage = () => (
  <Page
    backButtonHref="/profile"
    backButtonText="Profile"
    pageTitle="Email"
    renderPageTitle
    thinContainer
  >
    <MobileContainer>
      <ChangeEmailForm />
    </MobileContainer>
  </Page>
)

export default EmailPage
