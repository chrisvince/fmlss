import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'

import LoginForm from '../components/LoginForm'
import Link from 'next/link'

const Login = () => {
  return (
    <Page pageTitle="Login">
      <h1>Sign in</h1>
      <LoginForm />
      <Link href="/forgot-password">Forgot your password?</Link>
      <p>
        Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
      </p>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Login)
