import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import NewPostPage from '../../components/NewPostPage'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const NewPost = () => <NewPostPage />

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(NewPost)
