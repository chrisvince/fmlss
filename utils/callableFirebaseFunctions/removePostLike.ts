import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  slug: string
}

export const removePostLike = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'postLike-remove')(data)
}
