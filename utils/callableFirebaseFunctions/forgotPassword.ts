import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  email: string
}

export const forgotPassword = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'auth-password-forgot')(data)
}
