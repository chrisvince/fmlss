import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'
import EmailVerificationLink from '../components/EmailVerificationLink'

const Profile = () => {
  const AuthUser = useAuthUser()
  const handleSignOutClick = () => AuthUser.signOut()

  return (
    <Page pageTitle="Profile">
      <p>Your email is {AuthUser.email ? AuthUser.email : 'unknown'}.</p>
      <div>
        {!AuthUser.emailVerified && (
          <EmailVerificationLink />
        )}
      </div>
      <div>
        <a onClick={handleSignOutClick}>Sign out</a>
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
