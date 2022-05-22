import { getFirestore } from 'firebase-admin/firestore'
import constants from '../constants'

const db = getFirestore()

const getPasswordResetRequestRef = (passwordResetRequestId: string) =>
  db
      .collection(constants.PASSWORD_RESET_REQUESTS_COLLECTION)
      .doc(passwordResetRequestId)

export default getPasswordResetRequestRef
