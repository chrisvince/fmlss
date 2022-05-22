import * as functions from 'firebase-functions'
import getPasswordResetRequestRef from './db/getPasswordResetRequestRef'
import { getAuth } from 'firebase-admin/auth'

const auth = getAuth()

interface Data {
  password: string
  confirmPassword: string
  passwordResetRequestId: string
}

export const resetPassword = functions.https.onCall(
    async (data) => {
      const {
        password,
        confirmPassword,
        passwordResetRequestId,
      }: Data = data

      if (!password || !confirmPassword) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Both `password` and `confirmPassword` must be provided.'
        )
      }
      if (password !== confirmPassword) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Both `password` and `confirmPassword` must match.'
        )
      }
      if (!passwordResetRequestId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The `passwordResetRequestId` must be provided.'
        )
      }

      const passwordResetRequestRef =
          getPasswordResetRequestRef(passwordResetRequestId)

      const passwordResetRequestDoc = await passwordResetRequestRef.get()
      const passwordResetRequestData = passwordResetRequestDoc.data()

      if (!passwordResetRequestDoc.exists || !passwordResetRequestData?.uid) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The `passwordResetRequest` is not valid.'
        )
      }

      await auth.updateUser(passwordResetRequestData.uid, { password })
      await passwordResetRequestRef.update({ complete: true })
    }
)
