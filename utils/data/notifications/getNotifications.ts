import constants from '../../../constants'
import mapNotificationToData from './mapNotificationToData'
import { Notification } from '../../../types/Notification'
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore'

const {
  NOTIFICATIONS_COLLECTION,
  USERS_COLLECTION,
  NOTIFICATION_PAGINATION_COUNT,
} = constants

const getNotifications = async (
  uid: string,
  {
    startAfter: startAfterProp,
    limit: limitProp = NOTIFICATION_PAGINATION_COUNT,
    unreadOnly = false,
  }: {
    limit?: number
    startAfter?: Notification
    unreadOnly?: boolean
  }
): Promise<Notification[]> => {
  const db = getFirestore()
  console.log('uid', uid)

  const collectionPath = `${USERS_COLLECTION}/${uid}/${NOTIFICATIONS_COLLECTION}`

  const queryElements = [
    orderBy('createdAt', 'desc'),
    unreadOnly && where('readAt', '==', null),
    startAfterProp &&
      startAfter(Timestamp.fromMillis(startAfterProp.data.createdAt)),
    limit(limitProp),
  ].filter(Boolean) as QueryConstraint[]

  const dbRef = query(collection(db, collectionPath), ...queryElements)
  const docsRef = await getDocs(dbRef)

  const data = docsRef.docs.map(notificationDoc => ({
    data: mapNotificationToData(notificationDoc),
  }))

  return data
}

export default getNotifications
