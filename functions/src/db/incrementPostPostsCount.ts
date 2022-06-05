import { getFirestore, FieldValue } from 'firebase-admin/firestore'
const db = getFirestore()

import constants from '../constants'

const { POSTS_COLLECTION } = constants

const incrementPostPostsCount = (amount = 1, documentPath: string) =>
  db.doc(documentPath).update({
    [`${POSTS_COLLECTION}Count`]: FieldValue.increment(amount),
  })

export default incrementPostPostsCount
