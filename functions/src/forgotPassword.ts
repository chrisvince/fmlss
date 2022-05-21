import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { randomUUID } from 'crypto'

import constants from './constants'
import SendGrid from './api/sendGrid'

const auth = getAuth()
const db = getFirestore()

const sendPasswordResetEmail = async (
    email: string,
    resetPasswordLink: string
) => {
  const sendGrid = new SendGrid()
  await sendGrid.sendTemplateEmail({
    email,
    templateId: constants.PASSWORD_RESET_EMAIL_TEMPLATE_ID,
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
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          console.log(`No user found for email: ${email}. Aborting.`)
          return
        }
        throw error
      }

      const passwordResetId = randomUUID()

      const passwordResetRequestDoc = db
          .collection(constants.PASSWORD_RESET_REQUESTS_COLLECTION)
          .doc(passwordResetId)

      await passwordResetRequestDoc.set({
        complete: false,
        createdAt: FieldValue.serverTimestamp(),
        invalid: false,
        updatedAt: FieldValue.serverTimestamp(),
        uid: user.uid,
      })

      const resetPasswordLink =
        `${constants.APP_URL}/reset-password/${passwordResetId}`

      await sendPasswordResetEmail(email, resetPasswordLink)
    })
