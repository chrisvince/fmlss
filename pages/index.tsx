import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'

import FirebaseAuth from '../components/LoginForm'

const Login = () => {
  return (
    <Page pageTitle="Login">
      <h1>Login</h1>
      <FirebaseAuth />
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(Login)
