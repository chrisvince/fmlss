import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import NamePage from '../../components/NamePage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const Name = () => <NamePage />

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(Name as any)
