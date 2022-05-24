import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'
import EmailVerificationLink from '../components/EmailVerificationLink'
import ChangePasswordForm from '../components/ChangePasswordForm'

const Profile = () => {
  const authUser = useAuthUser()
  const handleSignOutClick = () => authUser.signOut()

  return (
    <Page pageTitle="Profile">
      <p>Your email is {authUser.email ? authUser.email : 'unknown'}.</p>
      <div>
        {!authUser.emailVerified && (
          <EmailVerificationLink />
        )}
      </div>
      <div>
        <a onClick={handleSignOutClick}>Sign out</a>
      </div>
      <div>
        <h2>Change password</h2>
        <ChangePasswordForm />
      </div>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})()

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Profile)
