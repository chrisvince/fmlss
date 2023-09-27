import { firestore } from 'firebase-admin'

export interface TopicDataRequest {
  createdAt: firestore.Timestamp
  id: string
  postCount: number
  recentViewCount: number
  slug: string
  title: string
  updatedAt: firestore.Timestamp
  viewCount: number
}
