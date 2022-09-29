import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  confirmNewPassword: string
  newPassword: string
  requestId: string
}

type ResetPassword = (data: Input) => Promise<{ data: void }>

export const resetPassword: ResetPassword = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-password-reset')(data)
}
