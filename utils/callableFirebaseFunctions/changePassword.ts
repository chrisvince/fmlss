import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  currentPassword?: string
  newPassword: string
  confirmNewPassword: string
}

export const changePassword = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'auth-password-change')(data)
}
