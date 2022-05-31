import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Link from 'next/link'

import Page from '../components/Page'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../config/withAuthConfig'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const ForgotPassword = () => {
  return (
    <Page pageTitle="Forgot Password">
      <h1>Forgot password</h1>
      <ForgotPasswordForm />
      <Link href="/">
        <a>Already know your password?</a>
      </Link>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(ForgotPassword)
