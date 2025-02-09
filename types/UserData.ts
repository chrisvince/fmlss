import { ColorSchemeSetting } from '.'
export interface UserData {
  createdAt: number
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
  updatedAt: number
}
