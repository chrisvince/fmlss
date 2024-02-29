import { firestore } from 'firebase-admin'

export interface HashtagDataRequest {
  createdAt: firestore.Timestamp
  display: string
  id: string
  slug: string
  updatedAt: firestore.Timestamp
  postCount: number
  viewCount: number
}
