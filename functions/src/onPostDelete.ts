import * as functions from 'firebase-functions'

import generatePostParentPath from './util/generatePostParentPath'
import generateWildcardPath from './util/generatePostWildcardPath'
import incrementPostPostsCount from './db/incrementPostPostsCount'

type Handler = (
  snapshot: functions.firestore.QueryDocumentSnapshot,
  context: functions.EventContext
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any

type CreateHandler = (depth: number) => Handler

const createHandler: CreateHandler = (depth) => async (_, context) => {
  const parentPath = generatePostParentPath(context.params, depth)
  if (!parentPath) return
  await incrementPostPostsCount(-1, parentPath)
}

export const onPostsDeleteDepth1 = functions.firestore
    .document(generateWildcardPath(1))
    .onDelete(createHandler(1))

export const onPostsDeleteDepth2 = functions.firestore
    .document(generateWildcardPath(2))
    .onDelete(createHandler(2))

export const onPostsDeleteDepth3 = functions.firestore
    .document(generateWildcardPath(3))
    .onDelete(createHandler(3))

export const onPostsDeleteDepth4 = functions.firestore
    .document(generateWildcardPath(4))
    .onDelete(createHandler(4))

export const onPostsDeleteDepth5 = functions.firestore
    .document(generateWildcardPath(5))
    .onDelete(createHandler(5))

export const onPostsDeleteDepth6 = functions.firestore
    .document(generateWildcardPath(6))
    .onDelete(createHandler(6))

export const onPostsDeleteDepth7 = functions.firestore
    .document(generateWildcardPath(7))
    .onDelete(createHandler(7))

export const onPostsDeleteDepth8 = functions.firestore
    .document(generateWildcardPath(8))
    .onDelete(createHandler(8))

export const onPostsDeleteDepth9 = functions.firestore
    .document(generateWildcardPath(9))
    .onDelete(createHandler(9))

