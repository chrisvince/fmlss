import ChangePasswordForm from '../ChangePasswordForm'
import Page from '../Page'

interface Props {
  userHasPassword: boolean
}

const ChangePasswordPage = ({ userHasPassword }: Props) => {
  return (
    <Page
      pageTitle={userHasPassword ? 'Change password' : 'Create password'}
      thinContainer
    >
      <ChangePasswordForm userHasPassword={userHasPassword} />
    </Page>
  )
}

export default ChangePasswordPage
