import * as functions from 'firebase-functions'

import generatePostParentPath from './util/generatePostParentPath'
import generatePostWildcardPath from './util/generatePostWildcardPath'
import incrementPostPostsCount from './db/incrementPostPostsCount'

type Handler = (
  snapshot: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any

type CreateReplyCreateHandler = (depth: number) => Handler

const createReplyCreateHandler: CreateReplyCreateHandler =
  (depth) => async (_, context) => {
    const parentPath = generatePostParentPath(context.params, depth)
    if (!parentPath) return
    await incrementPostPostsCount(1, parentPath)
  }

export const onPostsCreateDepth1 = functions.firestore
    .document(generatePostWildcardPath(1))
    .onCreate(createReplyCreateHandler(1))

export const onPostsCreateDepth2 = functions.firestore
    .document(generatePostWildcardPath(2))
    .onCreate(createReplyCreateHandler(2))

export const onPostsCreateDepth3 = functions.firestore
    .document(generatePostWildcardPath(3))
    .onCreate(createReplyCreateHandler(3))

export const onPostsCreateDepth4 = functions.firestore
    .document(generatePostWildcardPath(4))
    .onCreate(createReplyCreateHandler(4))

export const onPostsCreateDepth5 = functions.firestore
    .document(generatePostWildcardPath(5))
    .onCreate(createReplyCreateHandler(5))

export const onPostsCreateDepth6 = functions.firestore
    .document(generatePostWildcardPath(6))
    .onCreate(createReplyCreateHandler(6))

export const onPostsCreateDepth7 = functions.firestore
    .document(generatePostWildcardPath(7))
    .onCreate(createReplyCreateHandler(7))

export const onPostsCreateDepth8 = functions.firestore
    .document(generatePostWildcardPath(8))
    .onCreate(createReplyCreateHandler(8))

export const onPostsCreateDepth9 = functions.firestore
    .document(generatePostWildcardPath(9))
    .onCreate(createReplyCreateHandler(9))

