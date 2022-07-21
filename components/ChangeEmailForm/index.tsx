import { SyntheticEvent, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

import { changeEmail } from '../../utils/callableFirebaseFunctions/changeEmail'

const auth = firebase.auth()

const UI_STATES = {
  ERROR: 'error',
  LOADING: 'loading',
  NOT_SUBMITTED: 'not-submitted',
  SAME_EMAIL_ERROR: 'same-email-error',
  SUBMITTED: 'submitted',
  WRONG_CURRENT_PASSWORD_ERROR: 'wrong-current-password-error',
}

const EMAIL_ID = 'email'
const EMAIL_LABEL = 'New email'

const PASSWORD_ID = 'password'
const PASSWORD_LABEL = 'password'

const ChangeEmailForm = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)

  const handleSubmit = async (event: SyntheticEvent) => {
    const formData = new FormData(event.target as HTMLFormElement)
    const email = formData.get(EMAIL_ID) as string | undefined
    const password = formData.get(PASSWORD_ID) as string | undefined

    if (!email) {
      console.error('Email is required')
      return
    }

    if (!password) {
      console.error('Password is required')
      return
    }

    try {
      setUiState(UI_STATES.LOADING)
      await changeEmail({ email, password })
      await auth.signInWithEmailAndPassword(email, password)
      setUiState(UI_STATES.SUBMITTED)
    } catch (error: any) {
      if (
        error.code === 'invalid-argument' &&
        error.message === '`password` is incorrect.'
      ) {
        setUiState(UI_STATES.WRONG_CURRENT_PASSWORD_ERROR)
        return
      }
      if (
        error.code === 'invalid-argument' &&
        error.message === '`email` must be different from the current email.'
      ) {
        setUiState(UI_STATES.SAME_EMAIL_ERROR)
        return
      }
      setUiState(UI_STATES.ERROR)
      console.error(error)
    }
  }

  if (uiState === UI_STATES.LOADING) {
    return <p>Loading...</p>
  }

  if (uiState === UI_STATES.ERROR) {
    return <p>There was an error.</p>
  }

  if (uiState === UI_STATES.WRONG_CURRENT_PASSWORD_ERROR) {
    return <p>The password entered is incorrect. Please try again.</p>
  }

  if (uiState === UI_STATES.SUBMITTED) {
    return <p>Your email has been changed.</p>
  }

  if (uiState === UI_STATES.SAME_EMAIL_ERROR) {
    return <p>The email must be different from your current email.</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={EMAIL_ID}>{EMAIL_LABEL}</label>
        <input id={EMAIL_ID} name={EMAIL_ID} type="email" />
      </div>
      <div>
        <label htmlFor={PASSWORD_ID}>{PASSWORD_LABEL}</label>
        <input id={PASSWORD_ID} name={PASSWORD_ID} type="password" />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default ChangeEmailForm
