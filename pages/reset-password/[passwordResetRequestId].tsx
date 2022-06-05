import firebase from 'firebase/app'
import 'firebase/functions'
import { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { SyntheticEvent, useState } from 'react'
import { withAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'
import {
  withAuthUserConfig,
  withAuthUserTokenSSRConfig,
} from '../../config/withAuthConfig'

const resetPassword = firebase.functions().httpsCallable('resetPassword')
const checkPasswordResetRequestValid = firebase
  .functions()
  .httpsCallable('checkPasswordResetRequestValid')

const ROUTE_MODE = 'SEND_AUTHED_TO_APP'

const UI_STATES = {
  INVALID_CODE: 'invalid-code',
  LOADING: 'loading',
  NOT_CHANGED: 'not-changed',
  CHANGED: 'changed',
  PASSWORD_MATCH_ERROR: 'password-match-error',
  ERROR: 'error',
  PASSWORD_RESET_REQUEST_USED: 'password-reset-request-used',
}
type StatusKeys = keyof typeof UI_STATES
type StatusValues = typeof UI_STATES[StatusKeys]

const NEW_PASSWORD_ID = 'new-password'
const NEW_PASSWORD_LABEL = 'New password'

const CONFIRM_NEW_PASSWORD_ID = 'confirm-new-password'
const CONFIRM_NEW_PASSWORD_LABEL = 'Confirm new password'

const createGetServerSidePropsPayload = ({
  passwordResetRequestValidationStatus,
  passwordResetRequestId,
}: {
  passwordResetRequestValidationStatus: StatusValues
  passwordResetRequestId?: string
}) => ({
  props: {
    passwordResetRequestId,
    passwordResetRequestValidationStatus,
  },
})

const ResetPassword = ({
  passwordResetRequestValidationStatus,
  passwordResetRequestId,
}: {
  passwordResetRequestValidationStatus: StatusValues
  passwordResetRequestId?: string
}) => {
  const [uiState, setUiState] = useState(passwordResetRequestValidationStatus)

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const newPassword = formData.get(NEW_PASSWORD_ID) as string | undefined

    const confirmNewPassword =
      formData.get(CONFIRM_NEW_PASSWORD_ID) as string | undefined
    
    if (!newPassword || !confirmNewPassword) {
      console.error('Both new password and confirm new password are required')
      return
    }

    if (newPassword !== confirmNewPassword) {
      console.error('New password and confirm new password do not match')
      setUiState(UI_STATES.PASSWORD_MATCH_ERROR)
      return
    }

    try {
      setUiState(UI_STATES.LOADING)
      await resetPassword({
        newPassword,
        confirmNewPassword,
        passwordResetRequestId,
      })
      setUiState(UI_STATES.CHANGED)
    } catch (error) {
      setUiState(UI_STATES.ERROR)
      console.error(error)
    }
  }

  switch (uiState) {
    case UI_STATES.INVALID_CODE:
      return <p>The password change code is not valid.</p>

    case UI_STATES.LOADING:
      return <p>Loading...</p>

    case UI_STATES.ERROR:
      return <p>There was an error.</p>

    case UI_STATES.NOT_CHANGED:
    case UI_STATES.PASSWORD_MATCH_ERROR:
      return (
        <div>
          <p>Please enter your new password.</p>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor={NEW_PASSWORD_ID}>{NEW_PASSWORD_LABEL}</label>
              <input
                type="password"
                id={NEW_PASSWORD_ID}
                name={NEW_PASSWORD_ID}
              />
            </div>
            <div>
              <label htmlFor={CONFIRM_NEW_PASSWORD_ID}>
                {CONFIRM_NEW_PASSWORD_LABEL}
              </label>
              <input
                type="password"
                id={CONFIRM_NEW_PASSWORD_ID}
                name={CONFIRM_NEW_PASSWORD_ID}
              />
            </div>
            <button type="submit">Submit</button>
            {uiState === UI_STATES.PASSWORD_MATCH_ERROR && (
              <p>Passwords must match.</p>
            )}
          </form>
        </div>
      )

    case UI_STATES.CHANGED:
      return (
        <div>
          <p>Your password has been updated.</p>
          <Link href="/">
            <a>Go to sign in page</a>
          </Link>
        </div>
      )

    case UI_STATES.PASSWORD_RESET_REQUEST_USED:
      return <p>The password reset request has already been used.</p>

    default:
      return <p>There was an error verifying your email.</p>
  }
}

export const getServerSideProps = withAuthUserTokenSSR(
  withAuthUserTokenSSRConfig(ROUTE_MODE)
)(async (context: GetServerSidePropsContext) => {
  const { passwordResetRequestId }: { passwordResetRequestId?: string } =
    context.params ?? {}

  if (!passwordResetRequestId) {
    return createGetServerSidePropsPayload({
      passwordResetRequestValidationStatus: UI_STATES.ERROR,
    })
  }

  try {
    await checkPasswordResetRequestValid({ passwordResetRequestId })
  } catch (error: any) {
    if (error.code === 'not-found') {
      return createGetServerSidePropsPayload({
        passwordResetRequestId,
        passwordResetRequestValidationStatus: UI_STATES.INVALID_CODE,
      })
    }
    if (error.code === 'resource-exhausted') {
      return createGetServerSidePropsPayload({
        passwordResetRequestId,
        passwordResetRequestValidationStatus:
          UI_STATES.PASSWORD_RESET_REQUEST_USED,
      })
    }
    return createGetServerSidePropsPayload({
      passwordResetRequestId,
      passwordResetRequestValidationStatus: UI_STATES.ERROR,
    })
  }
  return createGetServerSidePropsPayload({
    passwordResetRequestId,
    passwordResetRequestValidationStatus: UI_STATES.NOT_CHANGED,
  })
})

export default withAuthUser(withAuthUserConfig(ROUTE_MODE))(
  ResetPassword as any
)
