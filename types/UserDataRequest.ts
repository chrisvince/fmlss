import { firestore } from 'firebase-admin'

export interface UserDataRequest {
  createdAt: firestore.Timestamp
  id: string
  shownFirstPostMessage: boolean
  updatedAt: firestore.Timestamp
  username?: string
}
