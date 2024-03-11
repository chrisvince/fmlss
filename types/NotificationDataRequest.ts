import { firestore } from 'firebase-admin'
import { PostRelationRequest } from './PostRelationRequest'
import { ReactionId } from './Reaction'

export enum NotificationType {
  Like = 'like',
  React = 'react',
  Reply = 'reply',
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
  isOwnPost: boolean
  multiLevelActivity: boolean
  type: NotificationType.Reply
}

export interface NotificationDataLikeRequest
  extends NotificationDataRequestBase {
  type: NotificationType.Like
}

export interface NotificationDataReactRequest
  extends NotificationDataRequestBase {
  reaction: ReactionId
  type: NotificationType.React
}

export type NotificationDataRequest =
  | NotificationDataReplyRequest
  | NotificationDataLikeRequest
  | NotificationDataReactRequest
