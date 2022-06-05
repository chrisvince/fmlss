import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

import constants from './constants'
import sendEmailVerificationEmail from './auth/sendEmailVerificationEmail'

const db = getFirestore()

export const onUserCreate = functions
    .runWith({ secrets: ['SENDGRID_API_KEY'] })
    .auth.user().onCreate(async (user) => {
      const userDoc = db.collection(constants.USERS_COLLECTION).doc(user.uid)
      await userDoc.set({
        createdAt: FieldValue.serverTimestamp(),
        deleted: false,
        uid: user.uid,
        updatedAt: FieldValue.serverTimestamp(),
      })

      await sendEmailVerificationEmail(user)
    })
