import ChangeEmailForm from '../ChangeEmailForm'
import MobileContainer from '../MobileContainer'
import Page from '../Page'
import PageBackButton from '../PageBackButton'

const EmailPage = () => (
  <Page
    aboveTitleContent={
      <MobileContainer>
        <PageBackButton href="/settings">Settings</PageBackButton>
      </MobileContainer>
    }
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
