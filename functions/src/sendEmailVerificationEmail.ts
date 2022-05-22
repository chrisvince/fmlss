import * as functions from 'firebase-functions'
import sendEmail from './auth/sendEmailVerificationEmail'

export const sendEmailVerificationEmail = functions
    .runWith({ secrets: ['SENDGRID_API_KEY'] })
    .https.onCall(async (_, context) => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The user must be authenticated.'
        )
      }

      await sendEmail(context.auth.token)
    })
