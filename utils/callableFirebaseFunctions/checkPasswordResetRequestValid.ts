import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  passwordResetRequestId: string
}

type CheckPasswordResetRequestValid = (
  data: Input
) => Promise<{ data: boolean }>

export const checkPasswordResetRequestValid: CheckPasswordResetRequestValid = (
  data
) => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-password-resetRequestValid')(data)
}
