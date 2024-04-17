import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  passwordResetRequestId: string
}

export const checkPasswordResetRequestValid = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, boolean>(
    functions,
    'auth-password-resetRequestValid'
  )(data)
}
