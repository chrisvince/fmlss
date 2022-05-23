import * as functions from 'firebase-functions'
import { getAuth } from 'firebase-admin/auth'
import FirebaseAuthRestApi from './api/firebaseAuthRestApi'

const auth = getAuth()

interface Data {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export const changePassword = functions
    .runWith({ secrets: ['WEB_API_KEY'] })
    .https.onCall(async (data, context) => {
      const { currentPassword, newPassword, confirmNewPassword }: Data = data

      if (![currentPassword, newPassword, confirmNewPassword].every((x) => x)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            '`currentPassword`, `newPassword` and `confirmNewPassword` must ' +
            'be provided.'
        )
      }
      if (newPassword !== confirmNewPassword) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Both `password` and `confirmPassword` must match.'
        )
      }

      if (newPassword.length < 6) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'New password must not be less than 6 characters.'
        )
      }

      if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The user is not authenticated.'
        )
      }

      const uid = context.auth.uid
      const email = context.auth.token.email

      if (!email) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'No user email present.'
        )
      }

      const firebaseAuthRestApi = new FirebaseAuthRestApi()
      const credentialsVerified = await firebaseAuthRestApi.verifyCredentials({
        email,
        password: currentPassword,
      })

      if (!credentialsVerified) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Current password is incorrect.'
        )
      }

      await auth.updateUser(uid, { password: newPassword })
    })
