import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  username: string
}

type UpdateUsername = (data: Input) => Promise<{ data: void }>

export const updateUsername: UpdateUsername = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-username-update')(data)
}
