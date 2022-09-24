import { ReactElement } from 'react'
import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../config/withAuthConfig'
import ForgotPasswordPage from '../components/ForgotPasswordPage'
import LayoutUnauthed from '../components/LayoutUnauthed'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const ForgotPassword = () => <ForgotPasswordPage />

ForgotPassword.getLayout = (page: ReactElement) =>
  <LayoutUnauthed>{page}</LayoutUnauthed>

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(ForgotPassword)
