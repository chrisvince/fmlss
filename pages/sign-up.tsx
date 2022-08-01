import {
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import SignUpPage from '../components/SignUpPage'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const SignUp = () => {
  return <SignUpPage />
}

export const getServerSideProps =
  withAuthUserTokenSSR(withAuthUserTokenSSRConfig(ROUTE_MODE))()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(SignUp)
