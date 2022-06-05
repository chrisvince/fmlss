import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

interface Input {
  email: string
}

export const forgotPassword = functions.httpsCallable('forgotPassword') as (
  data: Input
) => Promise<{ data: void }>
