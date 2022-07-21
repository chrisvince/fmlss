import { SyntheticEvent, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthUser } from 'next-firebase-auth'

import { changePassword } from '../../utils/callableFirebaseFunctions'

const auth = firebase.auth()

const UI_STATES = {
  NOT_SUBMITTED: 'not-submitted',
  LOADING: 'loading',
  SUBMITTED: 'submitted',
  WRONG_CURRENT_PASSWORD_ERROR: 'wrong-current-password-error',
  ERROR: 'error',
}

const CURRENT_PASSWORD_ID = 'current-password'
const CURRENT_PASSWORD_LABEL = 'Current password'

const NEW_PASSWORD_ID = 'new-password'
const NEW_PASSWORD_LABEL = 'New password'

const CONFIRM_NEW_PASSWORD_ID = 'confirm-new-password'
const CONFIRM_NEW_PASSWORD_LABEL = 'Confirm new password'

interface PropTypes {
  userHasPassword: boolean
}

const ChangePasswordForm = ({ userHasPassword }: PropTypes) => {
  const [uiState, setUiState] = useState(UI_STATES.NOT_SUBMITTED)
  const authUser = useAuthUser()

  const handleSubmit = async (event: SyntheticEvent) => {
    const { email } = authUser
    const formData = new FormData(event.target as HTMLFormElement)
    const currentPassword =
      formData.get(CURRENT_PASSWORD_ID) as string | undefined

    const newPassword =
      formData.get(NEW_PASSWORD_ID) as string | undefined

    const confirmNewPassword =
      formData.get(CONFIRM_NEW_PASSWORD_ID) as string | undefined

    if (!newPassword || !confirmNewPassword) {
      console.error('Both new password and confirm new password are required')
      return
    }

    if (newPassword !== confirmNewPassword) {
      console.error('New password and confirm new password do not match')
    }

    try {
      setUiState(UI_STATES.LOADING)
      await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
      await auth.signInWithEmailAndPassword(
        email as string,
        newPassword as string
      )
      setUiState(UI_STATES.SUBMITTED)
    } catch (error: any) {
      if (
        error.code === 'invalid-argument' &&
        error.message === '`currentPassword` is incorrect.'
      ) {
        setUiState(UI_STATES.WRONG_CURRENT_PASSWORD_ERROR)
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

  if (uiState === UI_STATES.SUBMITTED) {
    return <p>Your password has been changed.</p>
  }

  if (uiState === UI_STATES.WRONG_CURRENT_PASSWORD_ERROR) {
    return <p>The current password entered is incorrect. Please try again.</p>
  }

  return (
    <form onSubmit={handleSubmit}>
      {userHasPassword && (
        <div>
          <label htmlFor={CURRENT_PASSWORD_ID}>{CURRENT_PASSWORD_LABEL}</label>
          <input
            id={CURRENT_PASSWORD_ID}
            name={CURRENT_PASSWORD_ID}
            type="password"
          />
        </div>
      )}
      <div>
        <label htmlFor={NEW_PASSWORD_ID}>{NEW_PASSWORD_LABEL}</label>
        <input id={NEW_PASSWORD_ID} name={NEW_PASSWORD_ID} type="password" />
      </div>
      <div>
        <label htmlFor={CONFIRM_NEW_PASSWORD_ID}>
          {CONFIRM_NEW_PASSWORD_LABEL}
        </label>
        <input
          id={CONFIRM_NEW_PASSWORD_ID}
          name={CONFIRM_NEW_PASSWORD_ID}
          type="password"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default ChangePasswordForm
