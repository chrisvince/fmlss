import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import constants from './constants'

const { EMAIL_VERIFICATION_REQUESTS_COLLECTION } = constants

const auth = getAuth()
const db = getFirestore()

export const verifyEmail = functions.https.onCall(async (data) => {
  const { confirmationCode } = data

  if (!confirmationCode) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a valid confirmationCode.'
    )
  }

  const emailVerificationRequestDoc =
    await db
        .collection(EMAIL_VERIFICATION_REQUESTS_COLLECTION)
        .doc(confirmationCode)
        .get()

  if (!emailVerificationRequestDoc.exists) {
    throw new functions.https.HttpsError(
        'not-found',
        'The verification could not be found.'
    )
  }

  const emailVerificationRequestData = emailVerificationRequestDoc.data()

  if (
    !emailVerificationRequestData ||
    emailVerificationRequestData.invalid
  ) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The verification is invalid.'
    )
  }

  const user = await auth.getUser(emailVerificationRequestData.uid)
  if (user.emailVerified) {
    if (!emailVerificationRequestData.fulfilled) {
      await db
          .collection(EMAIL_VERIFICATION_REQUESTS_COLLECTION)
          .doc(confirmationCode)
          .update({
            fulfilled: true,
            updatedAt: FieldValue.serverTimestamp(),
          })
    }

    throw new functions.https.HttpsError(
        'already-exists',
        'Email already verified.'
    )
  }

  await auth.updateUser(emailVerificationRequestData.uid, {
    emailVerified: true,
  })

  await db
      .collection(EMAIL_VERIFICATION_REQUESTS_COLLECTION)
      .doc(confirmationCode)
      .update({
        fulfilled: true,
        updatedAt: FieldValue.serverTimestamp(),
      })
})
