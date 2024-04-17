import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  confirmNewPassword: string
  newPassword: string
  requestId: string
}

export const resetPassword = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'auth-password-reset')(data)
}
