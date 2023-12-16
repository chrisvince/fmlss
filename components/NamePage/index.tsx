import ChangeNameForm from '../ChangeNameForm'
import MobileContainer from '../MobileContainer'
import Page from '../Page'
import PageBackButton from '../PageBackButton'

const NamePage = () => (
  <Page
    aboveTitleContent={<PageBackButton href="/profile">Profile</PageBackButton>}
    pageTitle="Name"
    renderPageTitle
    thinContainer
  >
    <MobileContainer>
      <ChangeNameForm />
    </MobileContainer>
  </Page>
)

export default NamePage
