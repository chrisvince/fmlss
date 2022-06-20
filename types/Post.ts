import { PostData } from '.'
import type { FirebaseDoc } from '.'
export interface Post {
  createdByUser: boolean
  data: PostData
  doc: FirebaseDoc | null
  likedByUser: boolean
}
