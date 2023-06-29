import ChangePasswordForm from '../ChangePasswordForm'
import MobileContainer from '../MobileContainer'
import Page from '../Page'

interface Props {
  userHasPassword: boolean
}

const PasswordPage = ({ userHasPassword }: Props) => (
  <Page
    backButtonHref="/profile"
    backButtonText="Profile"
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
