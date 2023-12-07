import { firestore } from 'firebase-admin'

export interface UserDataRequest {
  createdAt: firestore.Timestamp
  firstName: string
  id: string
  lastName: string
  settings: {
    notifications: {
      email: {
        likes: boolean
        replies: boolean
      }
    }
  }
  shownFirstPostMessage: boolean
  updatedAt: firestore.Timestamp
}
