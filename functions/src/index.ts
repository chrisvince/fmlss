import * as admin from 'firebase-admin'

admin.initializeApp()

export * from './onUserCreate'
export * from './onUserDelete'
export * from './verifyEmail'
