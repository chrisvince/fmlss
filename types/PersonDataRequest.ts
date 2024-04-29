import { firestore } from 'firebase-admin'

export interface PersonDataRequest {
  createdAt: firestore.Timestamp
  name: string
  popularityScoreAllTime: number
  popularityScoreRecent: number
  postCount: number
  slug: string
  updatedAt: firestore.Timestamp
}
