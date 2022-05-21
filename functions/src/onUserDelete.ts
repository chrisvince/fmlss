import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import constants from './constants'

const db = getFirestore()

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  await db.collection(constants.USERS_COLLECTION).doc(user.uid).update({
    deleted: true,
    updatedAt: FieldValue.serverTimestamp(),
  })

  const emailVerificationRequestsSnapshot = await db
      .collection(constants.EMAIL_VERIFICATION_REQUESTS_COLLECTION)
      .where('uid', '==', user.uid)
      .get()

  emailVerificationRequestsSnapshot.forEach((snapshot) => {
    snapshot.ref.update({
      invalid: true,
      updatedAt: FieldValue.serverTimestamp(),
    })
  })

  const passwordResetRequestsSnapshot = await db
      .collection(constants.PASSWORD_RESET_REQUESTS_COLLECTION)
      .where('uid', '==', user.uid)
      .get()

  passwordResetRequestsSnapshot.forEach((snapshot) => {
    snapshot.ref.update({
      invalid: true,
      updatedAt: FieldValue.serverTimestamp(),
    })
  })
})
