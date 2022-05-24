import React, { SyntheticEvent, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import GoogleAuthButton from '../GoogleAuthButton'

const auth = firebase.auth()

const UI_STATES = {
  NOT_SUBMITTED: 'not-submitted',
  LOADING: 'loading',
  SUBMITTED: 'submitted',
  CREDENTIAL_ERROR: 'credential-error',
  ERROR: 'error',
}

const CREDENTIAL_ERRORS = ['auth/wrong-password', 'auth/user-not-found']

const EMAIL_ID = 'email'
const EMAIL_LABEL = 'Email'

const PASSWORD_ID = 'password'
const PASSWORD_LABEL = 'Password'

const SignInForm = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get(EMAIL_ID)
    const password = formData.get(PASSWORD_ID)

    if (!email || !password) {
      setUiState(UI_STATES.CREDENTIAL_ERROR)
      return
    }

    try {
      setUiState(UI_STATES.LOADING)
      await auth.signInWithEmailAndPassword(email as string, password as string)
      setUiState(UI_STATES.SUBMITTED)
    } catch (error: any) {
      if (CREDENTIAL_ERRORS.includes(error.code)) {
        setUiState(UI_STATES.CREDENTIAL_ERROR)
        return
      }
      setUiState(UI_STATES.ERROR)
      console.error(error)
    }
  }

  const handleGoogleAuthSuccess = () => setUiState(UI_STATES.SUBMITTED)
  const handleGoogleAuthError = () => setUiState(UI_STATES.ERROR)

  if (uiState === UI_STATES.LOADING) {
    return <p>Loading...</p>
  }

  if (uiState === UI_STATES.SUBMITTED) {
    return <p>Sign in successful.</p>
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor={EMAIL_ID}>{EMAIL_LABEL}</label>
          <input id={EMAIL_ID} name={EMAIL_ID} type="email" />
        </div>
        <div>
          <label htmlFor={EMAIL_ID}>{PASSWORD_LABEL}</label>
          <input id={PASSWORD_ID} name={PASSWORD_ID} type="password" />
        </div>
        <button type="submit">Sign in</button>
        {uiState === UI_STATES.CREDENTIAL_ERROR && (
          <p>Your email or password is incorrect. Please try again.</p>
        )}
        {uiState === UI_STATES.ERROR && (
          <p>There was an error. Please try again later.</p>
        )}
      </form>
      <GoogleAuthButton
        mode="signIn"
        onAuthError={handleGoogleAuthError}
        onAuthSuccess={handleGoogleAuthSuccess}
      />
    </div>
  )
}

export default SignInForm
