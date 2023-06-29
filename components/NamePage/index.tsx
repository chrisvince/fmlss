import ChangeNameForm from '../ChangeNameForm'
import MobileContainer from '../MobileContainer'
import Page from '../Page'

const NamePage = () => (
  <Page
    backButtonHref="/profile"
    backButtonText="Profile"
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
