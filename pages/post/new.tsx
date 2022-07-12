import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

import NewPostForm from '../../components/NewPostForm'
import { withAuthUserConfig, withAuthUserTokenSSRConfig } from '../../config/withAuthConfig'
import Page from '../../components/Page'

const ROUTE_MODE = 'SEND_UNAUTHED_TO_LOGIN'

const NewPost = () => {
  return (
    <Page pageTitle="New Post">
      <NewPostForm />
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)()

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(NewPost)
