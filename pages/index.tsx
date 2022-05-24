import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'

import SignInForm from '../components/SignInForm'
import Link from 'next/link'

const SignIn = () => {
  return (
    <Page pageTitle="Sign in">
      <h1>Sign in</h1>
      <SignInForm />
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
})(SignIn)
