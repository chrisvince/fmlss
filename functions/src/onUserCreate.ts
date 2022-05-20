import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import SendGrid from './api/sendGrid'
import md5 from './utils/md5'

const db = getFirestore()

const sendVerificationEmail = async (
    email: string | undefined,
    verificationLink: string,
) => {
  if (!email) {
    throw new Error('Could not send verification email. No email.')
  }
  if (!verificationLink) {
    throw new Error('Could not send verification email. No verificationLink.')
  }

  const sendGrid = new SendGrid()
  await sendGrid.sendTemplateEmail({
    email,
    templateId: 'd-8d25bc3f764e478cbb2a4ec05a458b4a',
    dynamicTemplateData: {
      verificationLink,
    },
  })
}

export const onUserCreate = functions
    .runWith({ secrets: ['SENDGRID_API_KEY'] })
    .auth.user().onCreate(async (user) => {
      const confirmationCode = md5(user.uid)
      const verificationLink =
        `https://fameless.app/confirm-email/${confirmationCode}`

      await db.collection('users').doc(user.uid).set({
        id: user.uid,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        disabled: false,
        deleted: false,
      })

      await db.collection('emailVerifications').doc(confirmationCode).set({
        userId: user.uid,
        invalid: false,
        complete: false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      })

      await sendVerificationEmail(user.email, verificationLink)
    })
