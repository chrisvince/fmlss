import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

import constants from './constants'
import SendGrid from './api/sendGrid'
import generateRandomKey from './util/generateRandomKey'

const {
  APP_URL,
  PASSWORD_RESET_EMAIL_TEMPLATE_ID,
  PASSWORD_RESET_REQUESTS_COLLECTION,
} = constants

const auth = getAuth()
const db = getFirestore()

const sendPasswordResetEmail = async (
    email: string,
    resetPasswordLink: string
) => {
  const sendGrid = new SendGrid()
  await sendGrid.sendTemplateEmail({
    email,
    templateId: PASSWORD_RESET_EMAIL_TEMPLATE_ID,
    dynamicTemplateData: {
      resetPasswordLink,
    },
  })
}

export const forgotPassword = functions
    .runWith({ secrets: ['SENDGRID_API_KEY'] })
    .https.onCall(async (data) => {
      const { email } = data

      if (!email) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Email must be specified.'
        )
      }

      let user
      try {
        user = await auth.getUserByEmail(email)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          console.log(`No user found for email: ${email}. Aborting.`)
          return
        }
        throw error
      }

      const passwordResetRequestId = generateRandomKey()

      const passwordResetRequestDoc = db
          .collection(PASSWORD_RESET_REQUESTS_COLLECTION)
          .doc(passwordResetRequestId)

      await passwordResetRequestDoc.set({
        complete: false,
        createdAt: FieldValue.serverTimestamp(),
        invalid: false,
        updatedAt: FieldValue.serverTimestamp(),
        uid: user.uid,
      })

      const resetPasswordLink =
        `${APP_URL}/reset-password/${passwordResetRequestId}`

      await sendPasswordResetEmail(email, resetPasswordLink)
    })
