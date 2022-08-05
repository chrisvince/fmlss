import {
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../config/withAuthConfig'
import ForgotPasswordPage from '../components/ForgotPasswordPage'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const ForgotPassword = () => <ForgotPasswordPage />

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(ForgotPassword)
