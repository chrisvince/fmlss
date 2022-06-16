import * as functions from 'firebase-functions'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import constants from './constants'

const db = getFirestore()

const {
  AUTHORED_POSTS_COLLECTION,
  POSTING_REQUIRES_ACCOUNT,
  POSTS_COLLECTION,
  USERS_COLLECTION,
} = constants

type PostType = 'post' | 'reply'

interface RequestData {
  body: string
  replyingToReference?: string
}
interface PostPayload {
  body: string
  createdAt: FieldValue
  updatedAt: FieldValue
  type?: PostType
}

interface CreatePostPayloadInput {
  slug: string,
  originReference?:
    FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  type?: PostType
}

type CreatePostPayload = (options: CreatePostPayloadInput) => PostPayload

type UpdateUser = (
  uid: string,
  postPayload: PostPayload,
  batch: FirebaseFirestore.WriteBatch,
) => FirebaseFirestore.WriteBatch

const updateUser: UpdateUser = (uid, postPayload, batch) => {
  const userAuthorPostsRef = db
      .collection(`${USERS_COLLECTION}/${uid}/${AUTHORED_POSTS_COLLECTION}`)
      .doc()

  const postTypeCountFieldName = {
    reply: 'authoredRepliesCount',
    post: 'authoredPostsCount',
  }[postPayload.type as PostType]

  const userRef = db.collection(USERS_COLLECTION).doc(uid)

  batch.update(userRef, {
    postTotalCount: FieldValue.increment(1),
    [postTypeCountFieldName]: FieldValue.increment(1),
  })

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
    type,
  }) => ({
    ...(
      originReference ? { originReference, originId: originReference.id } : {}
    ),
    ...(slug ? { slug } : {}),
    ...(type ? { type } : {}),
    body,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  if (replyingToReference) {
    const collectionPath = `${replyingToReference}/${POSTS_COLLECTION}`
    const postRef = db.collection(collectionPath).doc()

    if (context.auth) {
      const payload = createPostPayload({
        originReference: postRef,
        slug: postRef.id,
        type: 'reply',
      })
      updateUser(context.auth.uid, payload, batch)
    }
    batch.set(postRef, createPostPayload({ slug: postRef.id }))

    const parentDoc = db.doc(replyingToReference)
    batch.update(parentDoc, {
      [`${POSTS_COLLECTION}Count`]: FieldValue.increment(1),
    })

    await batch.commit()

    return {
      id: postRef.id,
    }
  }

  const postRef = db.collection(POSTS_COLLECTION).doc()

  if (context.auth) {
    const payload = createPostPayload({
      originReference: postRef,
      slug: postRef.id,
      type: 'post',
    })
    updateUser(context.auth.uid, payload, batch)
  }

  batch.set(postRef, createPostPayload({ slug: postRef.id }))
  await batch.commit()

  return {
    id: postRef.id,
  }
})
