import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Link from 'next/link'

import Page from '../components/Page'
import ForgotPasswordForm from '../components/ForgotPasswordForm'

const ForgotPassword = () => {
  return (
    <Page pageTitle="Forgot Password">
      <h1>Forgot password</h1>
      <ForgotPasswordForm />
      <Link href="/">Already know your password?</Link>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(ForgotPassword)
