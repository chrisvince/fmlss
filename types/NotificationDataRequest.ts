import { firestore } from 'firebase-admin'
import { PostRelationRequest } from './PostRelationRequest'

export enum NotificationType {
  Reply = 'reply',
  Like = 'like',
}

interface NotificationDataRequestBase {
  createdAt: firestore.Timestamp
  eventCount: number
  readAt: firestore.Timestamp
  rootPost: PostRelationRequest
  targetPost: PostRelationRequest
  targetPostBody: string
  type: NotificationType
  uid: string
  updatedAt: firestore.Timestamp
}

export interface NotificationDataReplyRequest
  extends NotificationDataRequestBase {
  multiLevelActivity: boolean
  type: NotificationType.Reply
}

export interface NotificationDataLikeRequest
  extends NotificationDataRequestBase {
  type: NotificationType.Like
}

export type NotificationDataRequest =
  | NotificationDataReplyRequest
  | NotificationDataLikeRequest
