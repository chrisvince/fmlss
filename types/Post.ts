import { PostData } from '.'
import type { FirebaseDoc } from '.'

export interface Post {
  data: PostData
  doc: FirebaseDoc | null
  user?: {
    like: boolean
    created: boolean
  }
}
