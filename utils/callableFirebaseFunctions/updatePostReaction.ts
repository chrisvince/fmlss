import { ReactionId } from '../../types/Reaction'
import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  reaction: ReactionId | undefined
  slug: string
}

export const updatePostReaction = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, void>(
    functions,
    'postReaction-createOrUpdate'
  )(data)
}
