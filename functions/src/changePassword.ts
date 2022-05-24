import * as functions from 'firebase-functions'
import { getAuth } from 'firebase-admin/auth'
import FirebaseAuthRestApi from './api/firebaseAuthRestApi'
import checkUserHasPassword from './auth/checkUserHasPassword'

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

      if (!newPassword || !confirmNewPassword) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            '`newPassword` and `confirmNewPassword` must be provided.'
        )
      }

      if (newPassword !== confirmNewPassword) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            '`password` and `confirmPassword` must match.'
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

      const userHasPassword = await checkUserHasPassword(uid)

      if (!userHasPassword) {
        console.log('User has no existing password, setting password')
        await auth.updateUser(uid, { password: newPassword })
        return
      }
      console.log('User has existing password.')

      if (!currentPassword) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            '`currentPassword` is required.'
        )
      }

      if (!email) {
        throw new functions.https.HttpsError(
            'internal',
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
            '`currentPassword` is incorrect.'
        )
      }

      await auth.updateUser(uid, { password: newPassword })
    })
