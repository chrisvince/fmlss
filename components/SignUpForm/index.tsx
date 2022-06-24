import React, { SyntheticEvent, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import GoogleAuthButton from '../GoogleAuthButton'
import Link from 'next/link'

const auth = firebase.auth()

const UI_STATES = {
  EMAIL_IN_USE_ERROR: 'email-in-use-error',
  ERROR: 'error',
  LOADING: 'loading',
  NOT_SUBMITTED: 'not-submitted',
  SUBMITTED: 'submitted',
}

const EMAIL_ID = 'email'
const EMAIL_LABEL = 'Email'

const PASSWORD_ID = 'password'
const PASSWORD_LABEL = 'Password'

const SignUpForm = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (event: SyntheticEvent) => {
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get(EMAIL_ID) as string | undefined
    const password = formData.get(PASSWORD_ID) as string | undefined

    try {
      setErrorMessage(null)
      setUiState(UI_STATES.LOADING)
      await auth.createUserWithEmailAndPassword(
        email as string,
        password as string,
      )
      setUiState(UI_STATES.SUBMITTED)
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setUiState(UI_STATES.EMAIL_IN_USE_ERROR)
        return
      }
      setErrorMessage(
        error.message ?? 'There was an error. Please try again later.'
      )
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
    return <p>Success.</p>
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor={EMAIL_ID}>{EMAIL_LABEL}</label>
          <input id={EMAIL_ID} name={EMAIL_ID} type="email" />
        </div>
        <div>
          <label htmlFor={PASSWORD_ID}>{PASSWORD_LABEL}</label>
          <input id={PASSWORD_ID} name={PASSWORD_ID} type="password" />
        </div>
        <button type="submit">
          Sign up
        </button>
        {uiState === UI_STATES.EMAIL_IN_USE_ERROR && (
          <p>
            The email is already in use. Please{' '}
            <Link href="/"><a>Sign in</a></Link>
          </p>
        )}
        {uiState === UI_STATES.ERROR && (
          <p>{errorMessage}</p>
        )}
      </form>
      <GoogleAuthButton
        mode="signUp"
        onAuthError={handleGoogleAuthError}
        onAuthSuccess={handleGoogleAuthSuccess}
      />
    </div>
  )
}

export default SignUpForm
