import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import SignInPage from '../components/SignInPage'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const SignIn = () => {
  return <SignInPage />
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(SignIn)
