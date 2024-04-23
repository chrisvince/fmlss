import { firestore } from 'firebase-admin'

export interface HashtagDataRequest {
  createdAt: firestore.Timestamp
  display: string
  id: string
  popularityScoreAllTime: number
  popularityScoreRecent: number
  postCount: number
  slug: string
  updatedAt: firestore.Timestamp
  viewCount: number
}
