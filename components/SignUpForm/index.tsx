import React, { SyntheticEvent, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

const auth = firebase.auth()

const UI_STATES = {
  NOT_SUBMITTED: 'not-submitted',
  LOADING: 'loading',
  SUBMITTED: 'submitted',
  ERROR: 'error',
}

const EMAIL_ID = 'email'
const EMAIL_LABEL = 'Email'

const PASSWORD_ID = 'password'
const PASSWORD_LABEL = 'Password'

const LoginForm = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)

  const onSubmit = async (event: SyntheticEvent) => {
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get(EMAIL_ID)
    const password = formData.get(PASSWORD_ID)

    try {
      setUiState(UI_STATES.LOADING)
      await auth.createUserWithEmailAndPassword(
        email as string,
        password as string,
      )
      setUiState(UI_STATES.SUBMITTED)
    } catch (error) {
      setUiState(UI_STATES.ERROR)
      console.error(error)
    }
  }

  if (uiState === UI_STATES.LOADING) {
    return <p>Loading...</p>
  }

  if (uiState === UI_STATES.SUBMITTED) {
    return <p>Success.</p>
  }

  return (
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
    </form>
  )
}

export default LoginForm
