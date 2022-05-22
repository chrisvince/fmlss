import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'

import FirebaseAuth from '../components/LoginForm'
import Link from 'next/link'

const Login = () => {
  return (
    <Page pageTitle="Login">
      <h1>Login</h1>
      <FirebaseAuth />
      <Link href="/forgot-password">Forgot your password?</Link>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Login)
