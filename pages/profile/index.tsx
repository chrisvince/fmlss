import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import Page from '../../components/Page'
import EmailVerificationLink from '../../components/EmailVerificationLink'
import Link from 'next/link'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const UserProfile = () => {
  const authUser = useAuthUser()
  const handleSignOutClick = authUser.signOut

  return (
    <Page pageTitle="Profile" thinContainer>
      <p>Your email is {authUser.email}.</p>
      <div>{!authUser.emailVerified && <EmailVerificationLink />}</div>
      <div>
        <Link href="/profile/change-password">
          <a>Change password</a>
        </Link>
      </div>
      <div>
        <Link href="/profile/change-email">
          <a>Change email</a>
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

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(UserProfile as any)
