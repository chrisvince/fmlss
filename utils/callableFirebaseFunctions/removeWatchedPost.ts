import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  slug: string
}

export const removeWatchedPost = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'watchedPost-remove')(data)
}
