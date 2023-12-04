import firebase from 'firebase/app'
import 'firebase/firestore'
import constants from '../../../constants'
import mapNotificationToData from './mapNotificationToData'
import { pipe } from 'ramda'
import { FirebaseDoc } from '../../../types'
import { Notification } from '../../../types/Notification'
import isServer from '../../isServer'

const {
  NOTIFICATIONS_COLLECTION,
  USERS_COLLECTION,
  NOTIFICATION_PAGINATION_COUNT,
} = constants

type GetNotifications = (
  uid: string,
  options: {
    db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
    limit?: number
    startAfter?: FirebaseDoc
    unreadOnly?: boolean
  }
) => Promise<Notification[]>

const getNotifications: GetNotifications = async (
  uid: string,
  {
    db: dbProp,
    startAfter,
    limit = NOTIFICATION_PAGINATION_COUNT,
    unreadOnly = false,
  } = {}
) => {
  const db = dbProp ?? firebase.firestore()

  const snapshot = await pipe(
    () =>
      db
        .collection(`${USERS_COLLECTION}/${uid}/${NOTIFICATIONS_COLLECTION}`)
        .orderBy('createdAt', 'desc'),
    query => (unreadOnly ? query.where('readAt', '==', null) : query),
    query => (startAfter ? query.startAfter(startAfter) : query),
    query => query.limit(limit).get()
  )()

  const data = snapshot.docs.map(notificationDoc => ({
    data: mapNotificationToData(notificationDoc),
    doc: !isServer ? notificationDoc : null,
  }))

  return data
}

export default getNotifications
