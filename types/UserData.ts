import { ColorSchemeSetting } from '.'
export interface UserData {
  createdAt: number
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
  updatedAt: number
}
