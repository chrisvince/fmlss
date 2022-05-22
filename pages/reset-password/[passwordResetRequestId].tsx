import firebase from 'firebase'
import 'firebase/functions'
import { GetServerSidePropsContext } from 'next'
import { SyntheticEvent, useState } from 'react'

const resetPassword = firebase.functions().httpsCallable('resetPassword')
const checkPasswordResetRequestValid = firebase
  .functions()
  .httpsCallable('checkPasswordResetRequestValid')

const STATUS = {
  INVALID_CODE: 'invalid-code',
  NOT_CHANGED: 'not-changed',
  CHANGED: 'changed',
  PASSWORD_MATCH_ERROR: 'password-match-error',
  ERROR: 'error',
  PASSWORD_RESET_REQUEST_USED: 'password-reset-request-used',
}
type StatusKeys = keyof typeof STATUS
type StatusValues = typeof STATUS[StatusKeys]

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
    const password = formData.get('password')
    const confirmPassword = formData.get('confirm-password')

    if (password !== confirmPassword) {
      console.error('passwords must match')
      setUiState(STATUS.PASSWORD_MATCH_ERROR)
      return
    }

    try {
      await resetPassword({
        password,
        confirmPassword,
        passwordResetRequestId,
      })
      setUiState(STATUS.CHANGED)
    } catch (error) {
      setUiState(STATUS.ERROR)
    }
  }

  switch (uiState) {
    case STATUS.INVALID_CODE:
      return <p>The password change code is not valid.</p>

    case STATUS.ERROR:
      return <p>There was an error.</p>

    case STATUS.NOT_CHANGED:
    case STATUS.PASSWORD_MATCH_ERROR:
      return (
        <div>
          <p>Please enter your new password.</p>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" />
            </div>
            <div>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
              />
            </div>
            <button type="submit">Submit</button>
            {uiState === STATUS.PASSWORD_MATCH_ERROR && (
              <p>Passwords must match.</p>
            )}
          </form>
        </div>
      )

    case STATUS.CHANGED:
      return <p>Your password has been updated.</p>

    case STATUS.PASSWORD_RESET_REQUEST_USED:
      return <p>The password reset request has already been used.</p>

    default:
      return <p>There was an error verifying your email.</p>
  }
}

export const getServerSideProps =
  async (context: GetServerSidePropsContext) => {
    const { passwordResetRequestId }: { passwordResetRequestId?: string } =
        context.params ?? {}

    if (!passwordResetRequestId) {
      return createGetServerSidePropsPayload({
        passwordResetRequestValidationStatus: STATUS.ERROR,
      })
    }

    try {
      await checkPasswordResetRequestValid({ passwordResetRequestId })
    } catch (error: any) {
      if (error.code === 'not-found') {
        return createGetServerSidePropsPayload({
          passwordResetRequestId,
          passwordResetRequestValidationStatus: STATUS.INVALID_CODE,
        })
      }
      if (error.code === 'resource-exhausted') {
        return createGetServerSidePropsPayload({
          passwordResetRequestId,
          passwordResetRequestValidationStatus:
              STATUS.PASSWORD_RESET_REQUEST_USED,
        })
      }
      return createGetServerSidePropsPayload({
        passwordResetRequestId,
        passwordResetRequestValidationStatus: STATUS.ERROR,
      })
    }
    return createGetServerSidePropsPayload({
      passwordResetRequestId,
      passwordResetRequestValidationStatus: STATUS.NOT_CHANGED,
    })
  }

export default ResetPassword
