import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const auth = getAuth()
const db = getFirestore()

export const verifyEmail = functions.https.onCall(async (data) => {
  const confirmationCode = data.confirmationCode
  console.log('confirmationCode', confirmationCode)

  if (!confirmationCode) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a valid userIdHash.'
    )
  }

  const emailVerificationDoc =
    await db.collection('emailVerifications').doc(confirmationCode).get()

  if (!emailVerificationDoc.exists) {
    throw new functions.https.HttpsError(
        'not-found',
        'The verification could not be found.'
    )
  }

  const emailVerificationDocData = emailVerificationDoc.data()

  if (!emailVerificationDocData || emailVerificationDocData.invalid) {
    throw new functions.https.HttpsError(
        'invalid-argument',
        'The verification is invalid.'
    )
  }

  const user = await auth.getUser(emailVerificationDocData.userId)
  if (user.emailVerified) {
    if (!emailVerificationDocData.complete) {
      await db.collection('emailVerifications').doc(confirmationCode).update({
        complete: true,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    throw new functions.https.HttpsError(
        'already-exists',
        'Email already verified.'
    )
  }

  await auth.updateUser(emailVerificationDocData.userId, {
    emailVerified: true,
  })

  await db.collection('emailVerifications').doc(confirmationCode).update({
    complete: true,
    updatedAt: FieldValue.serverTimestamp(),
  })
})
