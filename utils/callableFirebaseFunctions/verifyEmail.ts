import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  confirmationCode: string
}

type VerifyEmail = (data: Input) => Promise<{ data: void }>

export const verifyEmail: VerifyEmail = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-email-verify')(data)
}
