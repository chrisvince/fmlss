import * as functions from 'firebase-functions'
import getPasswordResetRequestRef from './db/getPasswordResetRequestRef'

interface PasswordResetRequest {
  complete: boolean
}

export const checkPasswordResetRequestValid = functions.https.onCall(
    async (data) => {
      const { passwordResetRequestId } = data
      const passwordResetRequestValidDoc =
          await getPasswordResetRequestRef(passwordResetRequestId).get()

      if (!passwordResetRequestValidDoc.exists) {
        throw new functions.https.HttpsError(
            'not-found',
            'The password reset request could not be found.'
        )
      }

      const passwordResetRequestValidData =
          <PasswordResetRequest>passwordResetRequestValidDoc.data()

      if (passwordResetRequestValidData.complete) {
        throw new functions.https.HttpsError(
            'resource-exhausted',
            'The password reset request has already been used.'
        )
      }
    }
)
