import { ColorSchemeSetting } from '.'

export interface UserDataInput {
  ['settings.colorScheme']?: ColorSchemeSetting
  ['settings.content.hideAdultContent']?: boolean
  ['settings.content.hideOffensiveContent']?: boolean
  ['settings.dialogs.dontShowConfirmNoTopicAgain']?: boolean
  ['settings.notifications.email.likes']?: boolean
  ['settings.notifications.email.reactions']?: boolean
  ['settings.notifications.email.replies']?: boolean
  shownFirstPostMessage?: boolean
}
