import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'

import SignInForm from '../components/SignInForm'
import Link from 'next/link'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../config/withAuthConfig'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const SignIn = () => {
  return (
    <Page pageTitle="Sign in">
      <h1>Sign in</h1>
      <SignInForm />
      <Link href="/forgot-password">Forgot your password?</Link>
      <p>
        Don&apos;t have an account?{' '}
        <Link href="/sign-up">
          <a>Sign up</a>
        </Link>
      </p>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(SignIn)
