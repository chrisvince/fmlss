import React from 'react'

import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'

const Profile = () => {
  const AuthUser = useAuthUser()

  const handleSignOutClick = () => AuthUser.signOut()
  return (
    <Page pageTitle="Profile">
      <p>Your email is {AuthUser.email ? AuthUser.email : 'unknown'}.</p>
      <a onClick={handleSignOutClick}>Sign out</a>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})()

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Profile)
