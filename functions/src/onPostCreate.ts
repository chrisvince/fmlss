import * as functions from 'firebase-functions'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

import generateWildcardPath from './util/generatePostWildcardPath'
import constants from './constants'

const db = getFirestore()
const { HASHTAGS_COLLECTION, HASHTAG_REGEX } = constants

type Handler = (
  snapshot: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext
) => Promise<void>

const extractHashTags = (str: string) => {
  const hashTagsHashIncluded = str.match(HASHTAG_REGEX) || []
  return hashTagsHashIncluded.map((tag) => tag.slice(1).toLowerCase())
}

const handler: Handler = async (snapshot) => {
  const { body } = snapshot.data()
  const hashtags = extractHashTags(body) || []
  const batch = db.batch()

  batch.update(snapshot.ref, {
    hashtags,
    updatedAt: FieldValue.serverTimestamp(),
  })

  const hashtagDoc = db.collection(HASHTAGS_COLLECTION).doc()
  const hashtagDocPromises = hashtags.map(async (hashtag) => {
    const existingHashtag = await db
        .collection(HASHTAGS_COLLECTION)
        .where('hashtag', '==', hashtag)
        .limit(1)
        .get()

    if (existingHashtag.empty) {
      batch.set(hashtagDoc, {
        createdAt: FieldValue.serverTimestamp(),
        hashtag,
        updatedAt: FieldValue.serverTimestamp(),
        usageCount: FieldValue.increment(1),
      })
      return
    }
    batch.update(existingHashtag.docs[0].ref, {
      updatedAt: FieldValue.serverTimestamp(),
      usageCount: FieldValue.increment(1),
    })
  })
  await Promise.all(hashtagDocPromises)

  await batch.commit()
}

export const onPostsCreateDepth0 = functions.firestore
    .document(generateWildcardPath(0))
    .onCreate(handler)

export const onPostsCreateDepth1 = functions.firestore
    .document(generateWildcardPath(1))
    .onCreate(handler)

export const onPostsCreateDepth2 = functions.firestore
    .document(generateWildcardPath(2))
    .onCreate(handler)

export const onPostsCreateDepth3 = functions.firestore
    .document(generateWildcardPath(3))
    .onCreate(handler)

export const onPostsCreateDepth4 = functions.firestore
    .document(generateWildcardPath(4))
    .onCreate(handler)

export const onPostsCreateDepth5 = functions.firestore
    .document(generateWildcardPath(5))
    .onCreate(handler)

export const onPostsCreateDepth6 = functions.firestore
    .document(generateWildcardPath(6))
    .onCreate(handler)

export const onPostsCreateDepth7 = functions.firestore
    .document(generateWildcardPath(7))
    .onCreate(handler)

export const onPostsCreateDepth8 = functions.firestore
    .document(generateWildcardPath(8))
    .onCreate(handler)

export const onPostsCreateDepth9 = functions.firestore
    .document(generateWildcardPath(9))
    .onCreate(handler)

