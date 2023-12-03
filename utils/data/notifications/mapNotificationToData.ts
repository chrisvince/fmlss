import {
  FirebaseDoc,
  NotificationData,
  NotificationDataRequest,
} from '../../../types'
import mapPostRelation from '../../mapPostRelation'

type MapNotification = (postDoc: FirebaseDoc) => NotificationData

const mapNotificationToData: MapNotification = doc => {
  const data = doc.data() as NotificationDataRequest
  return {
    createdAt: data.createdAt.toMillis(),
    eventCount: data.eventCount,
    id: doc.id,
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

export default mapNotificationToData
