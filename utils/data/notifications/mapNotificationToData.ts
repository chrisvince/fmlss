import {
  FirebaseDoc,
  NotificationData,
  NotificationDataLikeRequest,
  NotificationDataReplyRequest,
  NotificationDataRequest,
  NotificationLikeData,
  NotificationReplyData,
  NotificationType,
} from '../../../types'
import mapPostRelation from '../../mapPostRelation'

const mapNotificationReplyToData = (
  doc: FirebaseDoc
): NotificationReplyData => {
  const data = doc.data() as NotificationDataReplyRequest

  return {
    createdAt: data.createdAt.toMillis(),
    eventCount: data.eventCount,
    id: doc.id,
    isOwnPost: data.isOwnPost,
    multiLevelActivity: data.multiLevelActivity,
    readAt: data.readAt ? data.readAt.toMillis() : null,
    rootPost: mapPostRelation(data.rootPost),
    targetPost: mapPostRelation(data.targetPost),
    targetPostBody: data.targetPostBody,
    type: data.type,
    uid: data.uid,
    updatedAt: data.updatedAt.toMillis(),
  }
}

const mapNotificationLikeToData = (doc: FirebaseDoc): NotificationLikeData => {
  const data = doc.data() as NotificationDataLikeRequest

  return {
    createdAt: data.createdAt.toMillis(),
    eventCount: data.eventCount,
    id: doc.id,
    readAt: data.readAt ? data.readAt.toMillis() : null,
    rootPost: mapPostRelation(data.rootPost),
    targetPost: mapPostRelation(data.targetPost),
    targetPostBody: data.targetPostBody,
    type: data.type,
    uid: data.uid,
    updatedAt: data.updatedAt.toMillis(),
  }
}

const mapNotificationToData = (doc: FirebaseDoc): NotificationData => {
  const data = doc.data() as NotificationDataRequest

  if (data.type === NotificationType.Reply) {
    return mapNotificationReplyToData(doc)
  }

  if (data.type === NotificationType.Like) {
    return mapNotificationLikeToData(doc)
  }

  throw new Error("Notification type doesn't exist")
}

export default mapNotificationToData
