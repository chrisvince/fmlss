import firebase from 'firebase/app'
import 'firebase/functions'

type SendEmailVerificationEmail = () => Promise<{ data: void }>

export const sendEmailVerificationEmail: SendEmailVerificationEmail = () => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-email-requestVerification')()
}
