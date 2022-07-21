import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

interface Input {
  email: string
  password: string
}

export const changeEmail = functions.httpsCallable('changeEmail') as (
  data: Input
) => Promise<{ data: void }>
