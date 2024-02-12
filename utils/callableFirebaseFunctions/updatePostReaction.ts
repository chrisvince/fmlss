import firebase from 'firebase/app'
import 'firebase/functions'
import { ReactionId } from '../../types/Reaction'

interface Input {
  reaction: ReactionId | undefined
  slug: string
}

type UpdatePostReaction = (data: Input) => Promise<{ data: void }>

export const updatePostReaction: UpdatePostReaction = data => {
  const functions = firebase.functions()
  return functions.httpsCallable('postReaction-createOrUpdate')(data)
}
