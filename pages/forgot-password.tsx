import firebase from 'firebase'
import 'firebase/functions'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { SyntheticEvent, useState } from 'react'
import Page from '../components/Page'

const functions = firebase.functions()
const forgotPassword = functions.httpsCallable('forgotPassword')

const STATES = {
  NOT_SUBMITTED: 'not-submitted',
  LOADING: 'loading',
  ERROR: 'error',
  SUBMITTED: 'submitted',
}

const PageLayout = ({ children }: { children: any }) => (
  <Page pageTitle="Forgot Password">
    <h1>Forgot Password</h1>
    {children}
  </Page>
)

const ForgotPassword = () => {
  const [uiState, setUiState] = useState(STATES.NOT_SUBMITTED)
  const handleFormSubmit = async (event: SyntheticEvent) => {
    setUiState(STATES.LOADING)
    event.preventDefault()
    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const email = formData.get('email')
      await forgotPassword({ email })
      setUiState(STATES.SUBMITTED)
    } catch (error) {
      console.error(error)
      setUiState(STATES.ERROR)
    }
  }

  if (uiState === STATES.LOADING) {
    return (
      <PageLayout>
        <p>Loading...</p>
      </PageLayout>
    )
  }

  if (uiState === STATES.NOT_SUBMITTED || uiState === STATES.ERROR) {
    return (
      <PageLayout>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <button type="submit">Submit</button>
          {uiState === STATES.ERROR && (
            <p>There was an error, please try again.</p>
          )}
        </form>
      </PageLayout>
    )
  }

  if (uiState === STATES.SUBMITTED) {
    return (
      <PageLayout>
        <p>Submitted</p>
      </PageLayout>
    )
  }
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(ForgotPassword)
