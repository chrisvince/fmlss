import { getFirestore, FieldValue } from 'firebase-admin/firestore'
const db = getFirestore()

import constants from '../constants'

const { AUTHORED_REPLIES_COLLECTION, USERS_COLLECTION } = constants

const incrementUserAuthoredRepliesCount = (amount = 1, userId: string) =>
  db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .update({
        [`${AUTHORED_REPLIES_COLLECTION}Count`]: FieldValue.increment(amount),
      })

export default incrementUserAuthoredRepliesCount
