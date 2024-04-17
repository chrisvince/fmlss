import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  slug: string
}

export const createWatchedPost = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'watchedPost-create')(data)
}
