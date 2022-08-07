import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  email: string
  password: string
}

type ChangeEmail = (data: Input) => Promise<{ data: void }>

export const changeEmail: ChangeEmail = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-email-change')(data)
}
