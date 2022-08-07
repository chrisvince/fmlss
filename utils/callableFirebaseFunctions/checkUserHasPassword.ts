import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  uid: string
}

type CheckUserHasPassword = (data: Input) => Promise<{ data: boolean }>

export const checkUserHasPassword: CheckUserHasPassword = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-password-hasPassword')(data)
}

