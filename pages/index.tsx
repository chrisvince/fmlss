import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../config/withAuthConfig'
import SignInPage from '../components/SignInPage'
import { ReactElement } from 'react'
import LayoutUnauthed from '../components/LayoutUnauthed'

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const SignIn = () => {
  return <SignInPage />
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <LayoutUnauthed>{page}</LayoutUnauthed>
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(SignIn)
