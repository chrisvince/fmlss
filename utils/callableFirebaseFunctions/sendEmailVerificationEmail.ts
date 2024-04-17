import { getFunctions, httpsCallable } from 'firebase/functions'

export const sendEmailVerificationEmail = () => {
  const functions = getFunctions()
  return httpsCallable<never, void>(
    functions,
    'auth-email-requestVerification'
  )()
}
