import { PostData } from '.'
import type { FirebaseDoc } from '.'
import { ReactionId } from './Reaction'

export interface Post {
  data: PostData
  doc: FirebaseDoc | null
  user?: {
    created: boolean
    like: boolean
    reaction: ReactionId | null
    watching: boolean
  }
}
