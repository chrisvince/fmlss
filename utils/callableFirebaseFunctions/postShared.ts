import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  slug: string
}

export const postShared = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'userEvent-postShared')(data)
}
