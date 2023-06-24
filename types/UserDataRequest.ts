import { firestore } from 'firebase-admin'

export interface UserDataRequest {
  createdAt: firestore.Timestamp
  firstName: string
  id: string
  lastName: string
  shownFirstPostMessage: boolean
  updatedAt: firestore.Timestamp
  username?: string
}
