import { getFunctions, httpsCallable } from 'firebase/functions'
import { ShareMedium } from '../../types/ShareMedium'

interface Input {
  medium: ShareMedium
  slug: string
}

export const postShared = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(functions, 'event-postShared')(data)
}
