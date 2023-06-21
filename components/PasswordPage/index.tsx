import ChangePasswordForm from '../ChangePasswordForm'
import Page from '../Page'

interface Props {
  userHasPassword: boolean
}

const PasswordPage = ({ userHasPassword }: Props) => (
  <Page
    pageTitle={userHasPassword ? 'Password' : 'Create password'}
    renderPageTitle
    thinContainer
  >
    <ChangePasswordForm userHasPassword={userHasPassword} />
  </Page>
)

export default PasswordPage
