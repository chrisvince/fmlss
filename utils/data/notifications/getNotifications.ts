import constants from '../../../constants'
import mapNotificationToData from './mapNotificationToData'
import { pipe } from 'ramda'
import { FirebaseDoc, NotificationDataRequest } from '../../../types'
import { Notification } from '../../../types/Notification'
import isServer from '../../isServer'
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
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
    startAfter?: FirebaseDoc
    unreadOnly?: boolean
  }
): Promise<Notification[]> => {
  const db = getFirestore()

  const collectionPath = `${USERS_COLLECTION}/${uid}/${NOTIFICATIONS_COLLECTION}`
  const collectionRef = collection(db, collectionPath)

  const dbRef = pipe(
    ref => query(ref, orderBy('createdAt', 'desc')),
    ref => (unreadOnly ? query(ref, where('readAt', '==', null)) : ref),
    ref => (startAfterProp ? query(ref, startAfter(startAfterProp)) : ref),
    ref => query(ref, limit(limitProp))
  )(collectionRef)

  const docsRef = await getDocs(dbRef)

  const data = docsRef.docs.map(notificationDoc => ({
    data: mapNotificationToData(notificationDoc),
  }))

  return data
}

export default getNotifications
