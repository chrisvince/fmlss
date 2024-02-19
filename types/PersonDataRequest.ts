import { firestore } from 'firebase-admin'

export interface PersonDataRequest {
  createdAt: firestore.Timestamp
  name: string
  postCount: number
  slug: string
  updatedAt: firestore.Timestamp
}
