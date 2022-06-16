import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import ComposePostForm from '../../components/ComposePostForm'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../../config/withAuthConfig'
import Page from '../../components/Page'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const ComposePost = () => {
  return (
    <Page pageTitle="Compose">
      <h1>Compose Post</h1>
      <ComposePostForm />
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(ComposePost)
