import ChangeNameForm from '../ChangeNameForm'
import Page from '../Page'

const NamePage = () => (
  <Page
    backButtonHref="/profile"
    backButtonText="Profile"
    pageTitle="Name"
    renderPageTitle
    thinContainer
  >
    <ChangeNameForm />
  </Page>
)

export default NamePage
