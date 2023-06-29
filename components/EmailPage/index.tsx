import ChangeEmailForm from '../ChangeEmailForm'
import Page from '../Page'

const EmailPage = () => (
  <Page
    backButtonHref="/profile"
    backButtonText="Profile"
    pageTitle="Email"
    renderPageTitle
    thinContainer
  >
    <ChangeEmailForm />
  </Page>
)

export default EmailPage
