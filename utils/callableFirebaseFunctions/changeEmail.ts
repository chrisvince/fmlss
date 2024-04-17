import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  email: string
  password: string
}

export const changeEmail = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'auth-email-change')(data)
}
