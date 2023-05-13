import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'
import SignUpPage from '../../components/SignUpPage'
import LayoutBasicSlimBranded from '../../components/LayoutBasicSlimBranded'
import { ReactElement } from 'react'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const SignUp = () => <SignUpPage />

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <LayoutBasicSlimBranded>{page}</LayoutBasicSlimBranded>
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(SignUp)
