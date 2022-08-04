import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  email: string
}

type ForgotPassword = (data: Input) => Promise<{ data: void }>

export const forgotPassword: ForgotPassword = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('forgotPassword')(data)
}
