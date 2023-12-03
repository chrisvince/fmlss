import { firestore } from 'firebase-admin'
import { PostRelationRequest } from './PostRelationRequest'

export enum NotificationType {
  Reply = 'reply',
  Like = 'like',
}

export interface NotificationDataRequest {
  createdAt: firestore.Timestamp
  eventCount: number
  multiLevelActivity: boolean
  readAt: firestore.Timestamp
  rootPost: PostRelationRequest
  targetPost: PostRelationRequest
  targetPostBody: string
  type: NotificationType
  uid: string
  updatedAt: firestore.Timestamp
}
