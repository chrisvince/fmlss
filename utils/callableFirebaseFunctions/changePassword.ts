import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  currentPassword?: string
  newPassword: string
  confirmNewPassword: string
}

type ChangePassword = (data: Input) => Promise<{ data: void }>

export const changePassword: ChangePassword = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-password-change')(data)
}
