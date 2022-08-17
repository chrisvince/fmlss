import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  newPassword: string
  confirmNewPassword: string
  passwordResetRequestId: string
}

type ResetPassword = (data: Input) => Promise<{ data: void }>

export const resetPassword: ResetPassword = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-password-reset')(data)
}
