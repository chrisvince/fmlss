import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import ChangeEmailPage from '../../components/ChangeEmailPage'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../../config/withAuthConfig'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const ChangeEmail = () => <ChangeEmailPage />

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(ChangeEmail as any)
