import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import ComposePostForm from '../../components/ComposePostForm'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../../config/withAuthConfig'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const ComposePost = () => {
  return (
    <div>
      <h1>Compose Post</h1>
      <ComposePostForm />
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(ComposePost)
