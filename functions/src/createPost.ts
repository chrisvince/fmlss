import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import constants from './constants'

const db = getFirestore()

const {
  AUTHORED_POSTS_COLLECTION,
  AUTHORED_REPLIES_COLLECTION,
  POSTING_REQUIRES_ACCOUNT,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

interface RequestData {
  body: string
  replyingToReference?: string
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
  const subcollection = {
    post: AUTHORED_POSTS_COLLECTION,
    reply: AUTHORED_REPLIES_COLLECTION,
  }[type]

  if (!subcollection) return batch

  const userAuthorPostsRef = db
      .collection(`${USERS_COLLECTION}/${uid}/${subcollection}`)
      .doc()

  batch.set(userAuthorPostsRef, postPayload)

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

  const createPostPayload: CreatePostPayload = ({
    slug,
    originReference,
  }) => ({
    ...(originReference ? { originReference } : {}),
    ...(slug ? { slug } : {}),
    body,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  if (replyingToReference) {
    const collectionPath = `${replyingToReference}/${POSTS_COLLECTION}`
    const postRef = db.collection(collectionPath).doc()

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
    batch.set(postRef, createPostPayload({ slug: postRef.id }))
    await batch.commit()

    return {
      id: postRef.id,
    }
  }

  const postRef = db.collection(POSTS_COLLECTION).doc()

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

  batch.set(postRef, createPostPayload({ slug: postRef.id }))
  await batch.commit()

  return {
    id: postRef.id,
  }
})
