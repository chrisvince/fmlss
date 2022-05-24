import * as functions from 'firebase-functions'
import checkUserHasPasswordUtil from './auth/checkUserHasPassword'

export const checkUserHasPassword = functions.https.onCall(async (data) => {
  const { uid } = data
  const userHasPassword = await checkUserHasPasswordUtil(uid)
  return userHasPassword
})
