import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import constants from './constants'

const db = getFirestore()

const { POSTS_COLLECTION } = constants

interface Data {
  replyingToReference?: string
  body: string
}

export const createPost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        'unauthenticated',
        'The user is not authenticated.'
    )
  }

  const { body, replyingToReference }: Data = data

  const newPostPayload = {
    body,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }

  if (replyingToReference) {
    const collection = `${replyingToReference}/${POSTS_COLLECTION}`
    const postRef = db.collection(collection).doc()
    await postRef.set({
      id: postRef.id,
      ...newPostPayload,
    })

    db.doc(replyingToReference).update({
      [`${POSTS_COLLECTION}Count`]: FieldValue.increment(1),
    })

    return {
      id: postRef.id,
      path: postRef.path,
    }
  }

  const postRef = db.collection(POSTS_COLLECTION).doc()
  await postRef.set({
    id: postRef.id,
    ...newPostPayload,
  })

  return {
    id: postRef.id,
    path: postRef.path,
  }
})
