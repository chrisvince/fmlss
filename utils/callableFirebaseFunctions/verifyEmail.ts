import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  confirmationCode: string
}

export const verifyEmail = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'auth-email-verify')(data)
}
