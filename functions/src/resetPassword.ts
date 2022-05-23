import * as functions from 'firebase-functions'
import getPasswordResetRequestRef from './db/getPasswordResetRequestRef'
import { getAuth } from 'firebase-admin/auth'

const auth = getAuth()

interface Data {
  newPassword: string
  confirmNewPassword: string
  passwordResetRequestId: string
}

export const resetPassword = functions.https.onCall(
    async (data) => {
      const {
        newPassword,
        confirmNewPassword,
        passwordResetRequestId,
      }: Data = data

      if (!newPassword || !confirmNewPassword) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Both `password` and `confirmPassword` must be provided.'
        )
      }
      if (newPassword !== confirmNewPassword) {
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

      await auth.updateUser(
          passwordResetRequestData.uid,
          { password: newPassword }
      )

      await passwordResetRequestRef.update({ complete: true })
    }
)
