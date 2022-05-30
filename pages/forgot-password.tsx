import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Link from 'next/link'

import Page from '../components/Page'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../config/withAuthConfig'

const ROUTE_MODE = 'public'

const ForgotPassword = () => {
  return (
    <Page pageTitle="Forgot Password">
      <h1>Forgot password</h1>
      <ForgotPasswordForm />
      <Link href="/">Already know your password?</Link>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(ForgotPassword)
