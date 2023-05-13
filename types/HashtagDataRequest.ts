import { firestore } from 'firebase-admin'

export interface HashtagDataRequest {
  createdAt: firestore.Timestamp
  display: string
  id: string
  recentViewCount: number
  slug: string
  updatedAt: firestore.Timestamp
  usageCount: number
  viewCount: number
}
