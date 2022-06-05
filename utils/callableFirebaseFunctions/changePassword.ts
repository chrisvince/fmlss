import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

interface Input {
  currentPassword?: string
  newPassword: string
  confirmNewPassword: string
}

export const changePassword =
  functions.httpsCallable('changePassword') as (data: Input) =>
    Promise<{ data: void }>
