import { NotificationType } from './NotificationDataRequest'
import { PostRelation } from './PostRelation'

export interface NotificationData {
  createdAt: number
  eventCount: number
  id: string
  multiLevelActivity: boolean
  readAt: number | null
  rootPost: PostRelation
  targetPost: PostRelation
  targetPostBody: string
  type: NotificationType
  uid: string
  updatedAt: number
}
