import { ColorSchemeSetting } from '.'

export interface UserDataInput {
  shownFirstPostMessage?: boolean
  ['settings.notifications.email.likes']?: boolean
  ['settings.notifications.email.replies']?: boolean
  ['settings.colorScheme']?: ColorSchemeSetting
}
