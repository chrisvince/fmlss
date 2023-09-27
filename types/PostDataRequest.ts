import { firestore } from 'firebase-admin'
import { FirebaseDoc, PostPreview } from '.'

export interface PostDataRequest {
  body: string
  topic?: {
    slug: string
    title: string
  }
  createdAt: firestore.Timestamp
  documentDepth: number
  hashtags: string[]
  id: string
  likesCount: number
  linkPreviews: PostPreview[]
  originalPost?: FirebaseDoc & {
    slug: string
  }
  parent?: FirebaseDoc & {
    slug: string
  }
  postsCount: number
  reference: string
  slug: string
  updatedAt: firestore.Timestamp
}
