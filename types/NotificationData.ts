import { NotificationType } from './NotificationDataRequest'
import { PostRelation } from './PostRelation'
import { ReactionId } from './Reaction'

interface NotificationDataBase {
  createdAt: number
  eventCount: number
  id: string
  post: PostRelation
  postBody: string
  readAt: number | null
  rootPost: PostRelation
  type: NotificationType
  uid: string
  updatedAt: number
}

export interface NotificationReplyData extends NotificationDataBase {
  isOwnPost: boolean
  multiLevelActivity: boolean
  type: NotificationType.Reply
}

export interface NotificationLikeData extends NotificationDataBase {
  type: NotificationType.Like
}

export interface NotificationReactData extends NotificationDataBase {
  reaction: ReactionId
  type: NotificationType.React
}

export type NotificationData =
  | NotificationReplyData
  | NotificationLikeData
  | NotificationReactData
