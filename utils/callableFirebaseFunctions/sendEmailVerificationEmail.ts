import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

export const sendEmailVerificationEmail = functions.httpsCallable(
  'sendEmailVerificationEmail'
) as () => Promise<{ data: void }>
