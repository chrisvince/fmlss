import * as functions from 'firebase-functions'
import { getFirestore } from 'firebase-admin/firestore'
import constants from './constants'

const db = getFirestore()

const daysToMiliseconds = (days: number) => 1000 * 60 * 60 * 24 * days

export const invalidateRequests = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async () => {
      let emailVerificationRequestCount = 0
      let passwordResetRequestCount = 0

      const batch = db.batch()

      const expiryCutoff = new Date(Date.now() - daysToMiliseconds(14))

      const emailVerificationRequestDocs = await db
          .collection(constants.EMAIL_VERIFICATION_REQUESTS_COLLECTION)
          .where('createdAt', '<', expiryCutoff)
          .get()

      const passwordResetRequestDocs = await db
          .collection(constants.PASSWORD_RESET_REQUESTS_COLLECTION)
          .where('createdAt', '<', expiryCutoff)
          .get()

      emailVerificationRequestDocs.forEach((doc) => {
        batch.update(doc.ref, { invalid: true })
        emailVerificationRequestCount++
      })

      passwordResetRequestDocs.forEach((doc) => {
        batch.update(doc.ref, { invalid: true })
        passwordResetRequestCount++
      })

      if (!(emailVerificationRequestCount + passwordResetRequestCount)) {
        console.log('No documents to invalidate.')
        return
      }

      console.log(
          `Invalidating ${emailVerificationRequestCount}` +
          `\`${constants.EMAIL_VERIFICATION_REQUESTS_COLLECTION}\` documents.`
      )

      console.log(
          `Invalidating ${passwordResetRequestCount} ` +
          `\`${constants.PASSWORD_RESET_REQUESTS_COLLECTION}\` documents.`
      )

      await batch.commit()
    })
