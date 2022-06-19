import firebase from 'firebase/app'
import { PostData } from '.'
import type { FirebaseDoc } from '.'
export interface Post {
  createdByUser: boolean
  data: PostData
  doc: FirebaseDoc | null
}
