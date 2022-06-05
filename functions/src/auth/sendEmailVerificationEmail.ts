import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { UserRecord } from 'firebase-functions/v1/auth'

import SendGrid from '../api/sendGrid'
import constants from '../constants'
import generateRandomKey from '../util/generateRandomKey'

const {
  APP_URL,
  EMAIL_VERIFICATION_EMAIL_TEMPLATE_ID,
  EMAIL_VERIFICATION_REQUESTS_COLLECTION,
} = constants

const db = getFirestore()

export default async (user: UserRecord | DecodedIdToken) => {
  if (!user.email) {
    throw new Error('No user email. Could not send email verification email.')
  }

  const emailVerificationId = generateRandomKey()

  const emailVerificationRequestDoc = db
      .collection(EMAIL_VERIFICATION_REQUESTS_COLLECTION)
      .doc(emailVerificationId)

  await emailVerificationRequestDoc.set({
    complete: false,
    createdAt: FieldValue.serverTimestamp(),
    invalid: false,
    updatedAt: FieldValue.serverTimestamp(),
    uid: user.uid,
  })

  const verificationLink =
      `${APP_URL}/confirm-email/${emailVerificationId}`

  const sendGrid = new SendGrid()
  await sendGrid.sendTemplateEmail({
    email: user.email,
    templateId: EMAIL_VERIFICATION_EMAIL_TEMPLATE_ID,
    dynamicTemplateData: {
      verificationLink,
    },
  })
}
