import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import SendGrid from './api/sendGrid'
import constants from './constants'
import generateRandomKey from './util/generateRandomKey'

const db = getFirestore()

const sendVerificationEmail = async (
    email: string,
    verificationLink: string,
) => {
  const sendGrid = new SendGrid()
  await sendGrid.sendTemplateEmail({
    email,
    templateId: constants.EMAIL_VERIFICATION_EMAIL_TEMPLATE_ID,
    dynamicTemplateData: {
      verificationLink,
    },
  })
}

export const onUserCreate = functions
    .runWith({ secrets: ['SENDGRID_API_KEY'] })
    .auth.user().onCreate(async (user) => {
      // create user doc
      const userDoc = db.collection(constants.USERS_COLLECTION).doc(user.uid)
      await userDoc.set({
        createdAt: FieldValue.serverTimestamp(),
        deleted: false,
        uid: user.uid,
        updatedAt: FieldValue.serverTimestamp(),
      })

      // create emailVerificationRequest doc and send email
      if (!user.email) {
        return
      }

      const emailVerificationId = generateRandomKey()

      const emailVerificationRequestDoc = db
          .collection(constants.EMAIL_VERIFICATION_REQUESTS_COLLECTION)
          .doc(emailVerificationId)

      await emailVerificationRequestDoc.set({
        complete: false,
        createdAt: FieldValue.serverTimestamp(),
        invalid: false,
        updatedAt: FieldValue.serverTimestamp(),
        uid: user.uid,
      })

      const verificationLink =
        `${constants.APP_URL}/confirm-email/${emailVerificationId}`

      await sendVerificationEmail(user.email, verificationLink)
    })
