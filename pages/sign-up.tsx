import {
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import Page from '../components/Page'

import SignUpForm from '../components/SignUpForm'
import Link from 'next/link'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../config/withAuthConfig'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const SignUp = () => {
  return (
    <Page pageTitle="Sign up">
      <h1>Sign up</h1>
      <SignUpForm />
      <p>
        Already have an account?{' '}
        <Link href="/">
          <a>Sign in</a>
        </Link>
      </p>
    </Page>
  )
}

export const getServerSideProps =
  withAuthUserTokenSSR(withAuthUserTokenSSRConfig(ROUTE_MODE))()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(SignUp)
