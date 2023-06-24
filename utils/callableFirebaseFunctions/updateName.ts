import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  firstName: string
  lastName: string
}

type UpdateName = (data: Input) => Promise<{ data: void }>

export const updateName: UpdateName = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-name-update')(data)
}
