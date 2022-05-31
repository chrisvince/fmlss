import * as admin from 'firebase-admin'

admin.initializeApp()

export * from './onUserCreate'
export * from './onUserDelete'
export * from './verifyEmail'
export * from './forgotPassword'
export * from './checkPasswordResetRequestValid'
export * from './resetPassword'
export * from './sendEmailVerificationEmail'
export * from './changePassword'
export * from './invalidateRequests'
export * from './checkUserHasPassword'
export * from './createPost'
