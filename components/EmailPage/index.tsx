import ChangeEmailForm from '../ChangeEmailForm'
import MobileContainer from '../MobileContainer'
import Page from '../Page'
import PageBackButton from '../PageBackButton'

const EmailPage = () => (
  <Page
    aboveTitleContent={<PageBackButton href="/profile">Profile</PageBackButton>}
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
