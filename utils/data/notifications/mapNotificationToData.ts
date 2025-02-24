import { QueryDocumentSnapshot } from 'firebase/firestore'
import {
  FirebaseDoc,
  NotificationData,
  NotificationDataLikeRequest,
  NotificationDataReactRequest,
  NotificationDataReplyRequest,
  NotificationDataRequest,
  NotificationLikeData,
  NotificationReactData,
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
    post: mapPostRelation(data.post),
    postBody: data.postBody,
    readAt: data.readAt ? data.readAt.toMillis() : null,
    rootPost: mapPostRelation(data.rootPost),
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
    post: mapPostRelation(data.post),
    postBody: data.postBody,
    type: data.type,
    uid: data.uid,
    updatedAt: data.updatedAt.toMillis(),
  }
}

const mapNotificationReactToData = (
  doc: FirebaseDoc
): NotificationReactData => {
  const data = doc.data() as NotificationDataReactRequest

  return {
    createdAt: data.createdAt.toMillis(),
    eventCount: data.eventCount,
    id: doc.id,
    reaction: data.reaction,
    readAt: data.readAt ? data.readAt.toMillis() : null,
    rootPost: mapPostRelation(data.rootPost),
    post: mapPostRelation(data.post),
    postBody: data.postBody,
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

  if (data.type === NotificationType.React) {
    return mapNotificationReactToData(doc)
  }

  throw new Error("Notification type doesn't exist")
}

export default mapNotificationToData
