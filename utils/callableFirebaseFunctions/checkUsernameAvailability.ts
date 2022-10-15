import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  username: string
}

type CheckUsernameAvailability = (
  data: Input
) => Promise<{ data: { usernameAvailable: boolean } }>

export const checkUsernameAvailability: CheckUsernameAvailability = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-username-checkAvailability')(data)
}
