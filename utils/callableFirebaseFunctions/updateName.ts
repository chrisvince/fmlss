import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  firstName: string
  lastName: string
}

export const updateName = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'auth-name-update')(data)
}
