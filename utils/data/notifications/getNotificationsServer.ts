import constants from '../../../constants'
import mapNotificationToData from './mapNotificationToData'
import { pipe } from 'ramda'
import { Notification } from '../../../types/Notification'
import isServer from '../../isServer'
import initFirebaseAdmin from '../../initFirebaseAdmin'

const {
  NOTIFICATION_PAGINATION_COUNT,
  NOTIFICATIONS_COLLECTION,
  USERS_COLLECTION,
} = constants

const getNotificationsServer = async (uid: string): Promise<Notification[]> => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()

  const snapshot = await pipe(
    () =>
      db
        .collection(`${USERS_COLLECTION}/${uid}/${NOTIFICATIONS_COLLECTION}`)
        .orderBy('createdAt', 'desc'),
    query => query.limit(NOTIFICATION_PAGINATION_COUNT).get()
  )()

  const data = snapshot.docs.map(notificationDoc => ({
    data: mapNotificationToData(notificationDoc),
  }))

  return data
}

export default getNotificationsServer
