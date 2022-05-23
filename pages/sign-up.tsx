import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import Page from '../components/Page'

import SignUpForm from '../components/SignUpForm'
import Link from 'next/link'

const SignUp = () => {
  return (
    <Page pageTitle="Sign up">
      <h1>Sign up</h1>
      <SignUpForm />
      <p>
        Already have an account? <Link href="/">Sign in</Link>
      </p>
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(SignUp)
