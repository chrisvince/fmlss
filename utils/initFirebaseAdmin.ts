import { initializeApp, getApps } from 'firebase-admin/app'
import { credential } from 'firebase-admin'
import isServer from './isServer'
import admin from 'firebase-admin'

const initFirebaseAdmin = () => {
  if (!isServer) {
    throw new Error('initFirebaseAdmin must be called on the server')
  }

  if (getApps().length > 0) {
    if (!admin) {
      throw new Error('Firestore not initialized')
    }
    return admin
  }

  initializeApp({
    credential: credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
        : undefined,
    }),
  })

  if (!admin) {
    throw new Error('Firestore not initialized')
  }

  return admin
}

export default initFirebaseAdmin
