import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import constants from './constants'

const db = getFirestore()

const {
  USERS_COLLECTION,
  POSTS_COLLECTION,
  POSTING_REQUIRES_ACCOUNT,
  AUTHORED_POSTS_COLLECTION,
  AUTHORED_REPLIES_COLLECTION,
} = constants

interface RequestData {
  replyingToReference?: string
  body: string
}
interface PostPayload {
  body: string
  createdAt: FieldValue
  updatedAt: FieldValue
}

interface CreatePostPayloadInput {
  slug: string,
  originReference?:
    FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
}

type CreatePostPayload = (options: CreatePostPayloadInput) => PostPayload

type UpdateUser = (
  uid: string,
  postPayload: PostPayload,
  batch: FirebaseFirestore.WriteBatch,
  type: 'post' | 'reply'
) => FirebaseFirestore.WriteBatch

const updateUser: UpdateUser = (uid, postPayload, batch, type) => {
  if (type === 'post') {
    const userRef = db.collection(USERS_COLLECTION).doc(uid)

    batch.update(userRef, {
      [`${AUTHORED_POSTS_COLLECTION}Count`]: FieldValue.increment(1),
    })

    const userAuthorPostsRef = db
        .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
        .doc()

    batch.set(userAuthorPostsRef, postPayload)
  }

  if (type === 'reply') {
    const userRef = db.collection(USERS_COLLECTION).doc(uid)

    batch.update(userRef, {
      [`${AUTHORED_REPLIES_COLLECTION}Count`]: FieldValue.increment(1),
    })

    const userAuthorPostsRef = db
        .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_REPLIES_COLLECTION}`)
        .doc()

    batch.set(userAuthorPostsRef, postPayload)
  }

  return batch
}

export const createPost = functions.https.onCall(async (data, context) => {
  if (POSTING_REQUIRES_ACCOUNT && !context.auth) {
    throw new functions.https.HttpsError(
        'unauthenticated',
        'The user is not authenticated.'
    )
  }

  const { body, replyingToReference }: RequestData = data

  const batch = db.batch()

  const createPostPayload: CreatePostPayload =
    ({ slug, originReference }) => ({
      body,
      createdAt: FieldValue.serverTimestamp(),
      ...(slug ? { slug } : {}),
      ...(originReference ? { originReference } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    })

  if (replyingToReference) {
    const collection = `${replyingToReference}/${POSTS_COLLECTION}`
    const postRef = db.collection(collection).doc()
    batch.set(postRef, createPostPayload({ slug: postRef.id }))

    const replyingToReferenceDoc = db.doc(replyingToReference)
    batch.update(replyingToReferenceDoc, {
      [`${POSTS_COLLECTION}Count`]: FieldValue.increment(1),
    })

    if (context.auth) {
      updateUser(
          context.auth.uid,
          createPostPayload({
            originReference: postRef,
            slug: postRef.id,
          }),
          batch,
          'reply',
      )
    }

    await batch.commit()

    return {
      id: postRef.id,
      path: postRef.path,
    }
  }

  const postRef = db.collection(POSTS_COLLECTION).doc()
  batch.set(postRef, createPostPayload({ slug: postRef.id }))

  if (context.auth) {
    updateUser(
        context.auth.uid,
        createPostPayload({
          originReference: postRef,
          slug: postRef.id,
        }),
        batch,
        'post',
    )
  }

  await batch.commit()

  return {
    id: postRef.id,
    path: postRef.path,
  }
})
