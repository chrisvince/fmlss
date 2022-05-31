import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'
import EmailVerificationLink from '../components/EmailVerificationLink'
import Link from 'next/link'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../config/withAuthConfig'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const Profile = () => {
  const authUser = useAuthUser()
  const handleSignOutClick = authUser.signOut

  return (
    <Page pageTitle="Profile">
      <p>Your email is {authUser.email}.</p>
      <div>{!authUser.emailVerified && <EmailVerificationLink />}</div>
      <div>
        <Link href="/change-password">
          <a>Change password</a>
        </Link>
      </div>
      <div>
        <button onClick={handleSignOutClick}>Sign out</button>
      </div>
    </Page>
  )
}

export const getServerSideProps =
  withAuthUserTokenSSR(withAuthUserTokenSSRConfig(ROUTE_MODE))()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Profile as any)
