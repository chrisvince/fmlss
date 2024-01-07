import { firestore } from 'firebase-admin'
import { ColorSchemeSetting } from './ColorSchemeSetting'

export interface UserDataRequest {
  createdAt: firestore.Timestamp
  firstName: string
  id: string
  lastName: string
  settings: {
    colorScheme: ColorSchemeSetting
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
