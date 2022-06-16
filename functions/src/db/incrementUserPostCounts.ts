import { getFirestore, FieldValue } from 'firebase-admin/firestore'
const db = getFirestore()

import constants from '../constants'

const { USERS_COLLECTION } = constants

const incrementUserPostCounts = (
    amount = 1,
    userId: string,
    type: 'reply' | 'post'
) => {
  const postTypeCountFieldName = {
    reply: 'authoredRepliesCount',
    post: 'authoredPostsCount',
  }[type]

  return db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .update({
        postTotalCount: FieldValue.increment(amount),
        [postTypeCountFieldName]: FieldValue.increment(amount),
      })
}

export default incrementUserPostCounts
