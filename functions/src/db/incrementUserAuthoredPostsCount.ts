import { getFirestore, FieldValue } from 'firebase-admin/firestore'
const db = getFirestore()

import constants from '../constants'

const { AUTHORED_POSTS_COLLECTION, USERS_COLLECTION } = constants

const incrementUserAuthoredPostsCount = (amount = 1, userId: string) =>
  db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .update({
        [`${AUTHORED_POSTS_COLLECTION}Count`]: FieldValue.increment(amount),
      })

export default incrementUserAuthoredPostsCount
