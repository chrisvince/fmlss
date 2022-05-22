import { useState } from 'react'
import firebase from 'firebase'
import 'firebase/functions'

const functions = firebase.functions()
const sendEmailVerificationEmail = functions.httpsCallable(
  'sendEmailVerificationEmail'
)

const UI_STATES = {
  NOT_SUBMITTED: 'not-submitted',
  LOADING: 'loading',
  SUBMITTED: 'submitted',
  ERROR: 'error',
}

const EmailVerificationLink = () => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)

  const handleVerifyEmailClick = async () => {
    setUiState(UI_STATES.LOADING)
    try {
      await sendEmailVerificationEmail()
      setUiState(UI_STATES.SUBMITTED)
    } catch (error) {
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

  if (uiState === UI_STATES.SUBMITTED) {
    return <p>You will receive a verification email.</p>
  }

  return (
    <a
      // eslint-disable-next-line jsx-a11y/aria-props
      aria-role="button"
      onClick={handleVerifyEmailClick}
    >
      Verify email
    </a>
  )
}

export default EmailVerificationLink
