import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import md5 from './utils/md5'

const db = getFirestore()

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const userIDHash = md5(user.uid)

  await db.collection('users').doc(user.uid).update({
    deleted: true,
    updatedAt: FieldValue.serverTimestamp(),
  })

  await db.collection('emailVerifications').doc(userIDHash).set({
    userId: user.uid,
    invalid: true,
    updatedAt: FieldValue.serverTimestamp(),
  })
})
