import { firestore } from 'firebase-admin'

export interface CategoryDataRequest {
  createdAt: firestore.Timestamp
  id: string
  name: string
  postCount: number
  recentViewCount: number
  slug: string
  updatedAt: firestore.Timestamp
  viewCount: number
}
