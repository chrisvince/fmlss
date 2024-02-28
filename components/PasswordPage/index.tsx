import ChangePasswordForm from '../ChangePasswordForm'
import MobileContainer from '../MobileContainer'
import Page from '../Page'
import PageBackButton from '../PageBackButton'

interface Props {
  userHasPassword: boolean
}

const PasswordPage = ({ userHasPassword }: Props) => (
  <Page
    aboveTitleContent={
      <PageBackButton href="/settings">Settings</PageBackButton>
    }
    pageTitle={userHasPassword ? 'Password' : 'Create password'}
    renderPageTitle
    thinContainer
  >
    <MobileContainer>
      <ChangePasswordForm userHasPassword={userHasPassword} />
    </MobileContainer>
  </Page>
)

export default PasswordPage
