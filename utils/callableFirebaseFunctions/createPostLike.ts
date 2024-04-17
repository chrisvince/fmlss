import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  slug: string
}

export const createPostLike = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, boolean>(functions, 'postLike-create')(data)
}
