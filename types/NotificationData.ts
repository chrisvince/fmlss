import { NotificationType } from './NotificationDataRequest'
import { PostRelation } from './PostRelation'

interface NotificationDataBase {
  createdAt: number
  eventCount: number
  id: string
  readAt: number | null
  rootPost: PostRelation
  targetPost: PostRelation
  targetPostBody: string
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

export type NotificationData = NotificationReplyData | NotificationLikeData
