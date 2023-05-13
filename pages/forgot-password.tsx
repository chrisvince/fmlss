import { ReactElement } from 'react'
import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import ForgotPasswordPage from '../components/ForgotPasswordPage'
import LayoutBasicSlimBranded from '../components/LayoutBasicSlimBranded'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const ForgotPassword = () => <ForgotPasswordPage />

ForgotPassword.getLayout = (page: ReactElement) => (
  <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
)

export const getServerSideProps = withAuthUserTokenSSR()()
export default withAuthUser()(ForgotPassword)
