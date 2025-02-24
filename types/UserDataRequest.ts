import { firestore } from 'firebase-admin'
import { ColorSchemeSetting } from './ColorSchemeSetting'

export interface UserDataRequest {
  createdAt: firestore.Timestamp
  firstName: string
  id: string
  lastName: string
  settings: {
    colorScheme: ColorSchemeSetting
    content: {
      hideAdultContent: boolean
      hideOffensiveContent: boolean
    }
    dialogs: {
      dontShowConfirmNoTopicAgain: boolean
    }
    notifications: {
      email: {
        likes: boolean
        reactions: boolean
        replies: boolean
      }
    }
  }
  shownFirstPostMessage: boolean
  updatedAt: firestore.Timestamp
}
